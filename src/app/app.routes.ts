import { loadTodos, todosFeature } from './routes/todos/todos.store';

import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'todos',
    loadComponent: () => import('./routes/todos/todos.route'),
    providers: [provideState(todosFeature), provideEffects({ loadTodos })],
  },
  {
    path: 'products',
    loadComponent: () => import('./routes/products/products.route'),
  },
];
