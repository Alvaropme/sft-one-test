import { Routes } from '@angular/router';
import { ShellLayoutComponent } from './layout/shell.layout.ts/shell.layout.ts';

export const routes: Routes = [
  {
    path: '',
    component: ShellLayoutComponent,   // ← shell wraps all children
    children: [
      {
        path: '',
        redirectTo: 'todos',
        pathMatch: 'full',
      },
      {
        path: 'todos',
        loadChildren: () =>
          import('./features/todos/todos.routes').then(m => m.todosRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'todos',
  },
];