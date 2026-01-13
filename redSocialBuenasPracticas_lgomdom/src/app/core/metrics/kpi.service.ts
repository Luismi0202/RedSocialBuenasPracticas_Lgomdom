import { Injectable } from '@angular/core';

export type KPIs = {
  startupMs?: number;
  homeDataMs?: number;
  forecastDataMs?: number;

  httpRequests: number;

  cacheHit: number;
  cacheMiss: number;

  activeSubscriptions: number;

  avgInputHandlerMs: number;
  inputSamples: number;

  renderItems: number;

  manual: Record<string, number | string | boolean | null>;
};

@Injectable({ providedIn: 'root' })
export class KpiService {
  private _kpis: KPIs = {
    httpRequests: 0,
    cacheHit: 0,
    cacheMiss: 0,
    activeSubscriptions: 0,
    avgInputHandlerMs: 0,
    inputSamples: 0,
    renderItems: 0,
    manual: {},
  };

  get kpis(): KPIs {
    return this._kpis;
  }

  reset() {
    this._kpis = {
      httpRequests: 0,
      cacheHit: 0,
      cacheMiss: 0,
      activeSubscriptions: 0,
      avgInputHandlerMs: 0,
      inputSamples: 0,
      renderItems: 0,
      manual: {},
    };
  }

  incHttp() { this._kpis.httpRequests++; }
  incCacheHit() { this._kpis.cacheHit++; }
  incCacheMiss() { this._kpis.cacheMiss++; }

  incSub() { this._kpis.activeSubscriptions++; }
  decSub() { this._kpis.activeSubscriptions = Math.max(0, this._kpis.activeSubscriptions - 1); }

  setStartupMs(ms: number) { this._kpis.startupMs = ms; }
  setHomeDataMs(ms: number) { this._kpis.homeDataMs = ms; }
  setForecastDataMs(ms: number) { this._kpis.forecastDataMs = ms; }

  addInputSample(ms: number) {
    const n = this._kpis.inputSamples + 1;
    const prevAvg = this._kpis.avgInputHandlerMs;
    this._kpis.avgInputHandlerMs = prevAvg + (ms - prevAvg) / n;
    this._kpis.inputSamples = n;
  }

  setRenderItems(n: number) { this._kpis.renderItems = n; }

  setManual(id: string, value: number | string | boolean | null) {
    this._kpis.manual[id] = value;
  }

  getValueById(id: string): any {
    switch (id) {
      case 'startupMs': return this._kpis.startupMs;
      case 'homeDataMs': return this._kpis.homeDataMs;
      case 'forecastDataMs': return this._kpis.forecastDataMs;

      case 'httpRequests': return this._kpis.httpRequests;

      case 'cacheHit': return this._kpis.cacheHit;
      case 'cacheMiss': return this._kpis.cacheMiss;

      case 'activeSubscriptions': return this._kpis.activeSubscriptions;

      case 'avgInputHandlerMs': return this._kpis.avgInputHandlerMs;
      case 'inputSamples': return this._kpis.inputSamples;

      case 'renderItems': return this._kpis.renderItems;

      case 'cacheHitRatio': {
        const denom = this._kpis.cacheHit + this._kpis.cacheMiss;
        return denom === 0 ? null : Math.round((this._kpis.cacheHit / denom) * 100);
      }

      default:
        return this._kpis.manual[id];
    }
  }
}
