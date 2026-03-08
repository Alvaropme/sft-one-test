import { Component, inject, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TodoStore } from '../../store/todo.store';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoFiltersComponent } from '../../components/todo-filters/todo-filters.component';
import { TodoFormDialogComponent } from '../../todos-form-dialog/todo-form-dialog.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { Todo, TodoFilter } from '../../models/todo.model';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    TodoListComponent,
    TodoFiltersComponent,
    AlertComponent,
  ],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.scss',
})
export class TodosPageComponent {
  readonly store = inject(TodoStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly SNACK_CONFIG = { duration: 3000 } as const;

  private readonly existingTitles = computed(() =>
    this.store.todos().map(t => t.title.toLowerCase())
  );

  constructor() {
    this.store.loadTodos();
  }

  onFilterChange(filter: TodoFilter): void {
    this.store.setFilter(filter);
  }

  onToggleComplete(id: number): void {
    this.store.toggleComplete(id);
  }

  onToggleFavorite(id: number): void {
    this.store.toggleFavorite(id);
  }

  onDelete(id: number): void {
    this.store.deleteTodo(id);
    this.snackBar.open('Todo deleted', 'Close', this.SNACK_CONFIG);
  }

  onPageChange(page: number): void {
    this.store.setPage(page);
  }

  openCreateDialog(): void {
    this.openTodoDialog({
      mode: 'create',
      existingTitles: this.existingTitles(),
    });
  }

  openEditDialog(id: number): void {
    const todo = this.store.todos().find(t => t.id === id);
    if (!todo) return;

    this.openTodoDialog({
      mode: 'edit',
      todo,
      existingTitles: this.existingTitles().filter(
        title => title !== todo.title.toLowerCase()
      ),
    });
  }

  private openTodoDialog(data: { mode: 'create' | 'edit'; todo?: Todo; existingTitles: string[] }): void {
    this.dialog
      .open(TodoFormDialogComponent, { width: '500px', data })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (!result) return;
        if (data.mode === 'create') {
          this.store.createTodo(result);
          this.snackBar.open('Todo created', 'Close', this.SNACK_CONFIG);
        } else {
          this.store.updateTodo(data.todo!.id, result);
          this.snackBar.open('Todo updated', 'Close', this.SNACK_CONFIG);
        }
      });
  }
}