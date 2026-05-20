import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'explorer',
        pathMatch: 'full'
      },
      {
        path: 'explorer',
        loadComponent: () => import('./features/explorer/list/list.component').then(m => m.ListComponent)
      },
      {
        path: 'skills',
        loadComponent: () => import('./features/skills/skills.component').then(m => m.SkillsComponent)
      },
      {
        path: 'types',
        loadComponent: () => import('./features/types/types.component').then(m => m.TypesComponent)
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  }
];
