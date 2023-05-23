import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { injectTodosFeature } from './todos.store';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [NgFor, FormsModule],
  template: `
    <button (click)="todosFeature.loadTodos()">Load all todos</button>
    <form (ngSubmit)="addTodo()">
      <input
        placeholder="Add Todo"
        name="todoName"
        [(ngModel)]="todoName"
        type="text"
      />
    </form>
    <ul>
      <li *ngFor="let todo of todosFeature.todos()">
        {{ todo.title }}
      </li>
    </ul>
  `,
})
export default class TodosRoute {
  readonly todosFeature = injectTodosFeature();

  todoName = '';

  addTodo() {
    this.todosFeature.addTodo(this.todoName);
    this.todoName = '';
  }
}
