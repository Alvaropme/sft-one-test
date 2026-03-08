import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo, PaginationConfig } from '../../models/todo.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, TodoItemComponent, LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="todo-list-container">
      @if (loading()) {
        <app-loading [overlay]="true" message="Loading todos..."></app-loading>
      }
      
      @if (!loading() && todos().length === 0) {
        <div class="empty-state">
          <span class="empty-icon">📝</span>
          <p>No todos found</p>
          <p class="empty-hint">Create a new todo to get started!</p>
        </div>
      }
      
      @for (todo of todos(); track todo.id) {
        <app-todo-item
          [todo]="todo"
          [isFavorite]="isFavorite(todo.id)"
          (toggleComplete)="toggleComplete.emit($event)"
          (toggleFavorite)="toggleFavorite.emit($event)"
          (edit)="edit.emit($event)"
          (delete)="delete.emit($event)">
        </app-todo-item>
      }
      
      @if (todos().length > 0) {
        <mat-paginator
          [length]="pagination().total"
          [pageSize]="pagination().pageSize"
          [pageIndex]="pagination().page - 1"
          [pageSizeOptions]="[5, 10, 20, 50]"
          (page)="onPageChange($event)"
          aria-label="Select page">
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .todo-list-container {
      position: relative;
      min-height: 200px;
    }
    
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }
    
    .empty-icon {
      font-size: 64px;
      display: block;
      margin-bottom: 16px;
    }
    
    .empty-hint {
      font-size: 14px;
      color: #9e9e9e;
    }
    
    mat-paginator {
      margin-top: 16px;
      background: transparent;
    }
  `]
})
export class TodoListComponent {
  @Input({ required: true }) todos!: () => Todo[];
  @Input() favorites: () => number[] = () => [];
  @Input() pagination!: () => PaginationConfig;
  @Input() loading: () => boolean = () => false;
  
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() toggleFavorite = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();

  isFavorite(id: number): boolean {
    return this.favorites().includes(id);
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event.pageIndex + 1);
  }
}
