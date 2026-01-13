import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton, IonNote, IonSpinner
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { SocialBadService, Comment } from '../../core/services/social-bad.service';
import { KpiService } from '../../core/metrics/kpi.service';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-detail',
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton, IonNote, IonSpinner
  ],
  templateUrl: './detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailPage implements OnInit {
  postId = 0;
  title = '';

  error = '';

  comments$!: Observable<Comment[]>;
  loading$!: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: SocialBadService,
    public kpi: KpiService
  ) {}

  ngOnInit() {
    this.postId = Number(this.route.snapshot.queryParamMap.get('id') ?? '0');
    this.title = this.route.snapshot.queryParamMap.get('title') ?? '';

    const t0 = performance.now();

    this.comments$ = this.api.getComments(this.postId).pipe(
      tap(list => {
        this.kpi.setRenderItems(list.length);
        this.kpi.setForecastDataMs(Math.round(performance.now() - t0));
      }),
      catchError(() => {
        this.error = 'Error cargando comentarios';
        return of([] as Comment[]);
      })
    );

    this.loading$ = this.comments$.pipe(map(() => false), startWith(true));
  }

  // Anti-patrón: función costosa en template
  prettyEmail(email: string): string { return email.toLowerCase(); }

  trackByCommentId = (_: number, c: Comment) => c.id;

  back() {
    this.router.navigate(['/home']);
  }

  goSettings() {
    this.router.navigate(['/settings']);
  }
}
