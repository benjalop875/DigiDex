import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'explorer',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'skills',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'types',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'digimon/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'digimon/:id/evolutions',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
