import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'explorer',
        pathMatch: 'full'
      },
      {
        path: 'explorer',
        loadComponent: () => import('./explorer/list.component').then(m => m.ListComponent)
      },
      {
        path: 'digimon/:id',
        loadComponent: () => import('./digimon/detail/detail.component').then(m => m.DigimonDetailComponent)
      },
      {
        path: 'digimon/:id/evolutions',
        loadComponent: () => import('./digimon/evolutions/evolutions-page.component').then(m => m.EvolutionsPageComponent)
      },
      {
        path: 'skills',
        loadComponent: () => import('./skills/skills.component').then(m => m.SkillsComponent)
      },
      {
        path: 'types',
        loadComponent: () => import('./types/types.component').then(m => m.TypesComponent)
      },
      {
        path: '**',
        loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  }
];
