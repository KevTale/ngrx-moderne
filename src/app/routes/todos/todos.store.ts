import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  Store,
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { v4 as uuid } from 'uuid';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export interface TodosState {
  todos: Todo[];
}
export const initialState: TodosState = {
  todos: [],
};

export const todosActions = createActionGroup({
  source: 'Todos',
  events: {
    addTodo: props<{ title: string }>(),
    editTodo: props<{ id: string; title: string }>(),
    completeTodo: props<{ id: string }>(),
    removeTodo: props<{ id: string }>(),
    loadTodos: emptyProps(),
    loadTodosSuccess: props<{ todos: Todo[] }>(),
    loadTodosFailure: props<{ error: string }>(),
    resetTodos: emptyProps(),
  },
});

export const todosFeature = createFeature({
  name: 'todos',
  reducer: createReducer(
    initialState,
    on(todosActions.addTodo, (state, action) => ({
      ...state,
      todos: [
        { id: uuid(), title: action.title, completed: false },
        ...state.todos,
      ],
    })),
    on(todosActions.completeTodo, (state, action) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === action.id ? { ...todo, completed: true } : todo
      ),
    })),
    on(todosActions.editTodo, (state, action) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === action.id ? { ...todo, title: action.title } : todo
      ),
    })),
    on(todosActions.removeTodo, (state, action) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== action.id),
    })),
    on(todosActions.loadTodosSuccess, (state, action) => ({
      ...state,
      todos: action.todos,
    })),
    on(todosActions.resetTodos, (state) => ({
      ...state,
      todos: [],
    }))
  ),
  extraSelectors: ({ selectTodos }) => ({
    selectHasTodos: createSelector(selectTodos, (todos) => todos.length > 0),
    selectCompletedTodos: createSelector(selectTodos, (todos) =>
      todos.filter((todo) => todo.completed)
    ),
  }),
});

export const loadTodos = createEffect(
  (actions$ = inject(Actions)) => {
    const http = inject(HttpClient);

    return actions$.pipe(
      ofType(todosActions.loadTodos),
      switchMap(() =>
        http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
          map((todos) => todosActions.loadTodosSuccess({ todos })),
          catchError((error) => of(todosActions.loadTodosFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export function injectTodosFeature() {
  const store = inject(Store);

  return {
    addTodo: (title: string) => store.dispatch(todosActions.addTodo({ title })),
    removeTodo: (id: string) => store.dispatch(todosActions.removeTodo({ id })),
    resetTodos: () => store.dispatch(todosActions.resetTodos()),
    loadTodos: () => store.dispatch(todosActions.loadTodos()),
    todos: store.selectSignal(todosFeature.selectTodos),
    hasTodos: store.selectSignal(todosFeature.selectHasTodos),
    completedTodos: store.selectSignal(todosFeature.selectCompletedTodos),
  };
}
