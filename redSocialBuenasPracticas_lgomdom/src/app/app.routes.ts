import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // En una app optimizada, estas rutas deberían ser lazy y correctas.
  // En esta “anti-app” mantenemos loadComponent por compatibilidad standalone,
  // pero el resto del código incumple las buenas prácticas de forma deliberada.
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'detail',
    loadComponent: () => import('./pages/detail/detail.page').then(m => m.DetailPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
  },

  { path: '**', redirectTo: 'home' },
];
