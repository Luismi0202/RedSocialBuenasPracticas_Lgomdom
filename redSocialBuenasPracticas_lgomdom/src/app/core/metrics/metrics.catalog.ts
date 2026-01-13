export type KpiSource = 'AUTO' | 'DEVTOOLS' | 'MANUAL';

export type KpiDef = {
  id: string;              // clave única para buscar valor en KpiService
  name: string;            // nombre visible
  description: string;     // qué mide y por qué importa
  unit?: string;           // ms, %, #, KB...
  source: KpiSource;       // AUTO / DEVTOOLS / MANUAL
  target?: string;         // objetivo recomendado (texto)
};

export type BestPracticeDef = {
  code: string;            // p.ej. "BP 1.3"
  title: string;           // texto corto
  description?: string;    // explicación de la práctica
  kpis: KpiDef[];
};

export type CategoryDef = {
  code: string;            // p.ej. "2.2.1"
  title: string;           // título categoría
  practices: BestPracticeDef[];
};

export const METRICS_CATALOG: CategoryDef[] = [
  {
    code: '2.2.1',
    title: 'Gestión eficiente de componentes',
    practices: [
      {
        code: 'BP 1.1',
        title: 'Dividir la interfaz en componentes pequeños y reutilizables',
        kpis: [
          {
            id: 'sharedReusableComponents',
            name: 'Componentes reutilizables (shared) usados en ≥2 vistas',
            description:
              'Mide cuántos componentes UI reutilizables existen. Favorece mantenimiento y reduce duplicación.',
            unit: '#',
            source: 'MANUAL',
            target: '≥ 2 (en App B)',
          },
        ],
      },
      {
        code: 'BP 1.2',
        title: 'Evitar componentes excesivamente grandes con demasiada lógica',
        kpis: [
          {
            id: 'homeComponentLoc',
            name: 'Tamaño HomePage (aprox. líneas de código)',
            description:
              'A mayor tamaño, mayor riesgo de mezclar responsabilidades y degradar mantenibilidad.',
            unit: 'LOC',
            source: 'MANUAL',
            target: 'Menor que App A (en App B)',
          },
        ],
      },
      {
        code: 'BP 1.3',
        title: 'Mantener la lógica de negocio en servicios, no en componentes',
        kpis: [
          {
            id: 'httpOutsideServices',
            name: 'Llamadas HTTP fuera de servicios',
            description:
              'Número de llamadas HTTP realizadas directamente desde componentes. Debe ser 0 en un diseño limpio.',
            unit: '#',
            source: 'MANUAL',
            target: '0 (en App B)',
          },
        ],
      },
    ],
  },
  {
    code: '2.2.2',
    title: 'Lazy loading de páginas y componentes',
    practices: [
      {
        code: 'BP 2.1',
        title: 'Uso de lazy loading',
        kpis: [
          {
            id: 'lazyRoutesCount',
            name: 'Rutas lazy (loadComponent)',
            description:
              'Cuántas rutas se cargan de forma diferida. Reduce tiempo de arranque y JS inicial.',
            unit: '#',
            source: 'MANUAL',
            target: '3 (home, forecast, settings) en App B',
          },
          {
            id: 'initialJsKb',
            name: 'JS inicial descargado',
            description:
              'Tamaño (KB) de JavaScript descargado al cargar Home en frío. Se mide en DevTools/Network o Lighthouse.',
            unit: 'KB',
            source: 'DEVTOOLS',
            target: 'Menor en App B',
          },
        ],
      },
    ],
  },
  {
    code: '2.2.3',
    title: 'Uso correcto de servicios y estado compartido',
    practices: [
      {
        code: 'BP 3.1',
        title: 'Usar servicios para datos compartidos y lógica de negocio',
        kpis: [
          {
            id: 'httpRequests',
            name: 'Peticiones HTTP totales',
            description:
              'Contador de requests HTTP. Valores altos suelen indicar duplicación o falta de cache/reutilización.',
            unit: '#',
            source: 'AUTO',
            target: 'Menor en App B',
          },
        ],
      },
      {
        code: 'BP 3.2',
        title: 'Liberar suscripciones cuando no sean necesarias',
        kpis: [
          {
            id: 'activeSubscriptions',
            name: 'Suscripciones activas (aprox.)',
            description:
              'Si crece con la navegación, hay fugas de memoria por subscriptions sin cancelar.',
            unit: '#',
            source: 'AUTO',
            target: 'Estable en App B',
          },
        ],
      },
      {
        code: 'BP 3.3',
        title: 'Evitar almacenar grandes volúmenes de datos sin control',
        kpis: [
          {
            id: 'renderItems',
            name: 'Elementos renderizados en la lista de previsión',
            description:
              'Cantidad de filas que se renderizan. Listas grandes penalizan memoria y FPS.',
            unit: '#',
            source: 'AUTO',
            target: '24 (en App B)',
          },
        ],
      },
    ],
  },
  {
    code: '2.3.1',
    title: 'Uso eficiente de componentes Ionic',
    practices: [
      {
        code: 'BP 4.1',
        title: 'Usar componentes Ionic en lugar de HTML puro cuando proceda',
        kpis: [
          {
            id: 'ionicUiRatio',
            name: 'Ratio de uso de componentes Ionic en UI crítica',
            description:
              'Estimación del porcentaje de UI construida con ion-* en listas, inputs y navegación.',
            unit: '%',
            source: 'MANUAL',
            target: 'Alto en App B',
          },
        ],
      },
    ],
  },
  {
    code: '2.3.2',
    title: 'Gestión de listas y grandes volúmenes de datos',
    practices: [
      {
        code: 'BP 5.1',
        title: 'Evitar renderizar grandes listas completas',
        kpis: [
          {
            id: 'renderItems',
            name: 'Elementos renderizados simultáneamente',
            description:
              'Número de elementos en la lista. Afecta directamente al rendimiento (scroll y memoria).',
            unit: '#',
            source: 'AUTO',
            target: '24 o paginación en App B',
          },
        ],
      },
      {
        code: 'BP 5.2',
        title: 'Cargar datos de forma progresiva',
        kpis: [
          {
            id: 'pageSize',
            name: 'Tamaño de página (carga progresiva)',
            description:
              'Cuántos elementos se cargan por “bloque”. Si no existe paginación, se considera “N/A”.',
            unit: '#',
            source: 'MANUAL',
            target: '24 (en App B) o similar',
          },
        ],
      },
      {
        code: 'BP 5.3',
        title: 'Minimizar número de elementos visibles',
        kpis: [
          {
            id: 'scrollFps',
            name: 'FPS durante scroll (aprox.)',
            description:
              'Fluidez del scroll. Se mide con Performance/FPS meter en DevTools.',
            unit: 'FPS',
            source: 'DEVTOOLS',
            target: 'Más estable en App B',
          },
        ],
      },
    ],
  },
  {
    code: '2.3.3',
    title: 'Optimización de eventos y gestos',
    practices: [
      {
        code: 'BP 6.1',
        title: 'Evitar cálculos pesados en eventos frecuentes',
        kpis: [
          {
            id: 'avgInputHandlerMs',
            name: 'Coste medio del handler de input',
            description:
              'Tiempo medio (ms) ejecutado al teclear. Debe ser bajo para no bloquear UI.',
            unit: 'ms',
            source: 'AUTO',
            target: 'Menor en App B',
          },
        ],
      },
      {
        code: 'BP 6.2',
        title: 'Delegar lógica compleja a servicios',
        kpis: [
          {
            id: 'debounceMs',
            name: 'Debounce aplicado en búsqueda',
            description:
              'Retardo (ms) para agrupar pulsaciones y evitar requests por tecla.',
            unit: 'ms',
            source: 'MANUAL',
            target: '300ms en App B (ejemplo)',
          },
        ],
      },
      {
        code: 'BP 6.3',
        title: 'Probar el comportamiento en dispositivos reales',
        kpis: [
          {
            id: 'devicesTested',
            name: 'Nº de dispositivos reales probados',
            description:
              'Métrica de proceso. Ayuda a detectar fallos que no aparecen en navegador/emulador.',
            unit: '#',
            source: 'MANUAL',
            target: '≥ 1 real + 1 emulador',
          },
        ],
      },
    ],
  },
  {
    code: '2.4.1',
    title: 'Optimización del consumo de APIs y servicios remotos',
    practices: [
      {
        code: 'BP 7.1',
        title: 'Evitar peticiones duplicadas',
        kpis: [
          {
            id: 'requestsPerActionSelectCity',
            name: 'Requests por acción: seleccionar ciudad',
            description:
              'Cuántas peticiones se disparan al seleccionar una ciudad. Idealmente 1.',
            unit: '#',
            source: 'MANUAL',
            target: '≈ 1 en App B',
          },
        ],
      },
      {
        code: 'BP 7.2',
        title: 'Reutilizar resultados cuando sea posible',
        kpis: [
          {
            id: 'cacheHitRatio',
            name: 'Cache hit ratio',
            description:
              'Porcentaje de aciertos en cache: cacheHit / (cacheHit+cacheMiss).',
            unit: '%',
            source: 'AUTO',
            target: 'Alto en App B tras repetir navegación',
          },
        ],
      },
      {
        code: 'BP 7.3',
        title: 'Centralizar llamadas HTTP en servicios',
        kpis: [
          {
            id: 'httpOutsideServices',
            name: 'Llamadas HTTP fuera de servicios',
            description:
              'Debe ser 0 para mantener arquitectura limpia y testeable.',
            unit: '#',
            source: 'MANUAL',
            target: '0 en App B',
          },
        ],
      },
    ],
  },
  {
    code: '2.4.2',
    title: 'Cacheo y reutilización de datos',
    practices: [
      {
        code: 'BP 8.1',
        title: 'Almacenar datos en memoria durante la sesión',
        kpis: [
          {
            id: 'cacheTtlSeconds',
            name: 'TTL de cache configurado',
            description:
              'Tiempo de vida del cache en memoria. En App A suele ser 0 (sin cache).',
            unit: 's',
            source: 'MANUAL',
            target: '60s (ejemplo) en App B',
          },
        ],
      },
      {
        code: 'BP 8.2',
        title: 'Uso de persistencia local cuando sea necesario',
        kpis: [
          {
            id: 'offlineFallback',
            name: 'Fallback offline implementado',
            description:
              'Si existe estrategia offline (SQLite/Storage). Si no aplica, marcar N/A.',
            source: 'MANUAL',
            target: 'Opcional',
          },
        ],
      },
      {
        code: 'BP 8.3',
        title: 'Sincronización controlada con el servidor',
        kpis: [
          {
            id: 'manualRefresh',
            name: 'Refresh explícito (invalida cache)',
            description:
              'Indica si existe botón/acción que fuerza recarga controlada.',
            source: 'MANUAL',
            target: 'Sí en App B',
          },
        ],
      },
    ],
  },
  {
    code: '2.4.3',
    title: 'Gestión correcta de observables y suscripciones',
    practices: [
      {
        code: 'BP 9.1',
        title: 'Suscribirse solo cuando sea necesario',
        kpis: [
          {
            id: 'manualSubscribesInPages',
            name: 'Subscribes manuales en páginas',
            description:
              'Cuantos subscribe() directos hay en páginas para pintar UI. Con async pipe debería ser 0.',
            unit: '#',
            source: 'MANUAL',
            target: '0 en App B',
          },
        ],
      },
      {
        code: 'BP 9.2',
        title: 'Cancelar suscripciones al abandonar vistas',
        kpis: [
          {
            id: 'activeSubscriptions',
            name: 'Suscripciones activas tras navegación repetida',
            description:
              'Si aumenta con navegar, hay fugas. Si se mantiene, se cancelan correctamente.',
            unit: '#',
            source: 'AUTO',
            target: 'Estable en App B',
          },
        ],
      },
      {
        code: 'BP 9.3',
        title: 'Centralizar flujos de datos en servicios',
        kpis: [
          {
            id: 'storesCount',
            name: 'Nº de stores/servicios que exponen flujos (Observable)',
            description:
              'Métrica de arquitectura: flujos centralizados favorecen consistencia y testabilidad.',
            unit: '#',
            source: 'MANUAL',
            target: '≥ 1 en App B',
          },
        ],
      },
    ],
  },
];
