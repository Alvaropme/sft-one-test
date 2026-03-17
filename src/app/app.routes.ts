import { Routes } from '@angular/router';
import { ShellLayoutComponent } from './layout/shell.layout';

export const routes: Routes = [
  {
    path: '',
    component: ShellLayoutComponent,
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