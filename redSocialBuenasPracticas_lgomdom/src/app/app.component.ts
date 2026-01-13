import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { KpiService } from './core/metrics/kpi.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private kpi: KpiService) {}

  ngOnInit(): void {
    // Estimar JS inicial descargado usando PerformanceResourceTiming
    // Espera breve para que terminen cargas iniciales
    setTimeout(() => {
      try {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const kb = entries
          .filter(e => e.initiatorType === 'script')
          .reduce((sum, e) => {
            const bytes = (e.transferSize && e.transferSize > 0) ? e.transferSize : (e.encodedBodySize || 0);
            return sum + bytes;
          }, 0) / 1024;
        if (kb > 0) {
          this.kpi.setManual('initialJsKb', Math.round(kb));
        }
      } catch {}
    }, 1500);
  }
}
