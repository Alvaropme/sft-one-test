import { Component, inject, OnInit, signal, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TodoStore } from '../../store/todo.store';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoFiltersComponent } from '../../components/todo-filters/todo-filters.component';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter } from '../../models/todo.model';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSidenavModule,
    TodoListComponent,
    TodoFiltersComponent,
    AlertComponent,
  ],
  template: `
    <div class="todos-page">
      <mat-toolbar color="primary" class="toolbar">
        <span>Todo App</span>
        <span class="spacer"></span>
        <a mat-button routerLink="/settings">
          <mat-icon>settings</mat-icon>
          Settings
        </a>
      </mat-toolbar>

      <div class="content">
        <app-alert [useErrorService]="true"></app-alert>

        <div class="header-actions">
          <app-todo-filters (filterChange)="onFilterChange($event)"></app-todo-filters>
          <button mat-raised-button color="accent" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon>
            New Todo
          </button>
        </div>

        <app-todo-list
          [todos]="store.filteredTodos"
          [favorites]="store.favorites"
          [pagination]="store.pagination"
          [loading]="store.loading"
          (toggleComplete)="onToggleComplete($event)"
          (toggleFavorite)="onToggleFavorite($event)"
          (edit)="openEditDialog($event)"
          (delete)="onDelete($event)"
          (pageChange)="onPageChange($event)">
        </app-todo-list>
      </div>
    </div>
  `,
  styles: [`
    .todos-page {
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .spacer {
      flex: 1;
    }
    
    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
    }
  `]
})
export class TodosPageComponent implements OnInit {
  store = inject(TodoStore);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
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
    this.snackBar.open('Todo deleted successfully', 'Close', { duration: 3000 });
  }

  onPageChange(page: number): void {
    this.store.setPage(page);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TodoFormDialogComponent, {
      width: '500px',
      data: { mode: 'create', existingTitles: this.store.todos().map(t => t.title.toLowerCase()) },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.createTodo(result);
        this.snackBar.open('Todo created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditDialog(id: number): void {
    const todo = this.store.todos().find(t => t.id === id);
    if (!todo) return;

    const otherTitles = this.store.todos()
      .filter(t => t.id !== id)
      .map(t => t.title.toLowerCase());

    const dialogRef = this.dialog.open(TodoFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', todo, existingTitles: otherTitles },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.updateTodo(id, result);
        this.snackBar.open('Todo updated successfully', 'Close', { duration: 3000 });
      }
    });
  }
}

@Component({
  selector: 'app-todo-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TodoFormComponent],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Create Todo' : 'Edit Todo' }}</h2>
    <mat-dialog-content>
      <app-todo-form
        [todo]="data.todo ?? null"
        [existingTitles]="data.existingTitles"
        (create)="onCreate($event)"
        (update)="onUpdate($event)"
        (cancel)="dialogRef.close()">
      </app-todo-form>
    </mat-dialog-content>
  `,
})
export class TodoFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TodoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; todo?: Todo; existingTitles: string[] }
  ) {}

  onCreate(todo: CreateTodoDto): void {
    this.dialogRef.close(todo);
  }

  onUpdate(update: { id: number; todo: UpdateTodoDto }): void {
    this.dialogRef.close(update.todo);
  }
}
