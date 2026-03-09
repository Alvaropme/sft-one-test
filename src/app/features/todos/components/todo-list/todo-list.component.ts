import { Component, input, output, computed } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { TodoItemComponent } from '../todo-item/todo-item.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { Todo, PaginationConfig } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [MatPaginatorModule, TodoItemComponent, LoadingComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  readonly todos = input.required<Todo[]>();
  readonly favorites = input<number[]>([]);
  readonly pagination = input.required<PaginationConfig>();
  readonly loading = input(false);

  readonly toggleComplete = output<number>();
  readonly toggleFavorite = output<number>();
  readonly edit = output<number>();
  readonly delete = output<number>();
  readonly pageChange = output<number>();

  private readonly favoritesSet = computed(() => new Set(this.favorites()));

  isFavorite(id: number): boolean {
    return this.favoritesSet().has(id);
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex + 1);
  }
}