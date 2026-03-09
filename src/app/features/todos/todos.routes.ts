import { Routes } from '@angular/router';

export const todosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/todos-page/todos-page.component').then(m => m.TodosPageComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/todo-detail-page/todo-detail-page.component').then(m => m.TodoDetailPageComponent),
  },
];
