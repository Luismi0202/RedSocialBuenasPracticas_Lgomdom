import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonList, IonLabel, IonButton, IonNote, IonSpinner
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { SocialBadService, Post } from '../../core/services/social-bad.service';
import { KpiService } from '../../core/metrics/kpi.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonList, IonLabel, IonButton, IonNote, IonSpinner
  ],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  readonly pageSize = 24;

  private search$ = new BehaviorSubject<string>('');
  private visibleCount$ = new BehaviorSubject<number>(this.pageSize);
  private samplingScroll = false;

  posts$!: Observable<Post[]>;
  filtered$!: Observable<Post[]>;
  visible$!: Observable<Post[]>;
  loading$!: Observable<boolean>;
  error = '';

  constructor(
    private api: SocialBadService,
    private router: Router,
    public kpi: KpiService
  ) {}

  ngOnInit() {
    // KPI arranque aproximado
    const navStart = (performance.getEntriesByType('navigation')[0] as any)?.startTime ?? 0;
    this.kpi.setStartupMs(Math.round(performance.now() - navStart));

    // One cached request, then client-side filtering with debounce.
    this.posts$ = this.api.getPosts();

    this.filtered$ = combineLatest([
      this.posts$,
      this.search$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(v => v.trim().toLowerCase())
      )
    ]).pipe(
      map(([posts, q]) => !q ? posts : posts.filter(p => (p.title + ' ' + p.body).toLowerCase().includes(q))),
      tap(list => this.kpi.setRenderItems(Math.min(list.length, this.pageSize)))
    );

    this.visible$ = combineLatest([this.filtered$, this.visibleCount$]).pipe(
      map(([list, count]) => list.slice(0, count))
    );

    this.loading$ = this.posts$.pipe(map(() => false), startWith(true));

    // Aproximación del tamaño de Home (LOC) sumando métodos del prototipo
    try {
      const proto = Object.getPrototypeOf(this);
      const names = Object.getOwnPropertyNames(proto).filter(n => n !== 'constructor');
      const loc = names.reduce((sum, n) => {
        const fn = (this as any)[n];
        if (typeof fn === 'function') {
          return sum + (fn.toString().split('\n').length);
        }
        return sum;
      }, 0);
      if (loc > 0) this.kpi.setManual('homeComponentLoc', loc);
    } catch {}
  }

  onInput(ev: any) {
    const t0 = performance.now();
    const value = (ev?.target?.value ?? '').toString();
    this.search$.next(value);
    this.kpi.addInputSample(performance.now() - t0);

    // Medir requests por acción (búsqueda) como delta de httpRequests tras 800ms
    const before = this.kpi.kpis.httpRequests;
    setTimeout(() => {
      const delta = Math.max(0, this.kpi.kpis.httpRequests - before);
      this.kpi.setManual('requestsPerActionSelectCity', delta);
    }, 800);
  }

  trackByPostId = (_: number, p: Post) => p.id;

  prettyTitle(p: Post): string {
    // Keep pure and cheap to avoid blocking change detection
    return `[${p.id}] ${p.title.toUpperCase()}`;
  }

  loadMore() {
    const next = this.visibleCount$.value + this.pageSize;
    this.visibleCount$.next(next);
    this.kpi.setRenderItems(next);
  }

  onScroll() {
    if (this.samplingScroll) return;
    this.samplingScroll = true;
    const durationMs = 1000;
    let frames = 0;
    let start = performance.now();
    const loop = () => {
      frames++;
      if (performance.now() - start < durationMs) {
        requestAnimationFrame(loop);
      } else {
        const fps = Math.round((frames * 1000) / durationMs);
        this.kpi.setManual('scrollFps', fps);
        this.samplingScroll = false;
      }
    };
    requestAnimationFrame(loop);
  }

  openPost(p: Post) {
    // Anti-patrón: no validar, pasar datos por querystring
    this.router.navigate(['/detail'], { queryParams: { id: p.id, title: p.title } });
  }

  goSettings() {
    this.router.navigate(['/settings']);
  }
}
