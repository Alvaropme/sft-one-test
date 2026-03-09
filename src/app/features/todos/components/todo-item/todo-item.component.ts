import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [MatCardModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  readonly todo = input.required<Todo>();
  readonly isFavorite = input(false);

  readonly toggleComplete = output<number>();
  readonly toggleFavorite = output<number>();
  readonly edit = output<number>();
  readonly delete = output<number>();
}