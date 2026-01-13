import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonButton, IonList, IonNote,
  IonAccordionGroup, IonAccordion
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { KpiService } from '../../core/metrics/kpi.service';
import { METRICS_CATALOG, CategoryDef, KpiDef } from '../../core/metrics/metrics.catalog';
import { SocialBadService } from '../../core/services/social-bad.service';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonButton, IonList, IonNote,
    IonAccordionGroup, IonAccordion
  ],
  templateUrl: './settings.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  catalog: CategoryDef[] = METRICS_CATALOG;

  constructor(
    private router: Router,
    public kpi: KpiService,
    private social: SocialBadService
  ) {
    // Valores manuales recomendados (App B “bien”)
    this.kpi.setManual('lazyRoutesCount', 3);
    this.kpi.setManual('sharedReusableComponents', 2); // city-suggestion-item, forecast-hour-item
    this.kpi.setManual('httpOutsideServices', 0);
    this.kpi.setManual('ionicUiRatio', 95);

    this.kpi.setManual('pageSize', 24);
    this.kpi.setManual('debounceMs', 300);
    this.kpi.setManual('devicesTested', 1); // ajusta según tu práctica

    this.kpi.setManual('cacheTtlSeconds', 60);
    this.kpi.setManual('offlineFallback', false); // si no lo implementas
    this.kpi.setManual('manualRefresh', true);

    this.kpi.setManual('manualSubscribesInPages', 0);
    this.kpi.setManual('storesCount', 1); // LocationStore

    // DevTools (rellenar manualmente si quieres)
    this.kpi.setManual('initialJsKb', null);
    this.kpi.setManual('scrollFps', null);
    this.kpi.setManual('homeComponentLoc', null);

    // Requests por acción: lo dejamos manual (puedes medir delta y rellenar)
    this.kpi.setManual('requestsPerActionSelectCity', null);
  }

  reset() {
    this.kpi.reset();
  }

  refresh() {
    // Invalidate caches to allow controlled re-fetch on next navigation/search
    this.social.invalidateAll();
  }


  back() {
    this.router.navigate(['/home']);
  }

  displayValue(def: KpiDef): string {
    const v = this.kpi.getValueById(def.id);
    if (v === undefined || v === null || v === '') return 'N/A';
    if (typeof v === 'number') {
      if (def.unit === 'ms') return `${v.toFixed(2)} ms`;
      if (def.unit === '%') return `${v} %`;
      if (def.unit) return `${v} ${def.unit}`;
      return `${v}`;
    }
    if (typeof v === 'boolean') return v ? 'Sí' : 'No';
    return String(v);
  }

  sourceLabel(s: string): string {
    if (s === 'AUTO') return 'AUTO';
    if (s === 'DEVTOOLS') return 'DEVTOOLS';
    return 'MANUAL';
  }
}
