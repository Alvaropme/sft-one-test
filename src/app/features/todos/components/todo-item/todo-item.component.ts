import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="todo-item" [class.completed]="todo.completed">
      <div class="todo-content">
        <mat-checkbox 
          [checked]="todo.completed" 
          (change)="toggleComplete.emit(todo.id)"
          color="primary">
        </mat-checkbox>
        <div class="todo-info">
          <span class="todo-title">{{ todo.title }}</span>
          <span class="todo-id">#{{ todo.id }}</span>
        </div>
        <div class="todo-actions">
          <button mat-icon-button (click)="toggleFavorite.emit(todo.id)" [color]="isFavorite ? 'accent' : 'default'">
            <mat-icon>{{ isFavorite ? 'star' : 'star_border' }}</mat-icon>
          </button>
          <button mat-icon-button (click)="edit.emit(todo.id)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="delete.emit(todo.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .todo-item {
      margin-bottom: 12px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      &.completed {
        opacity: 0.7;
        
        .todo-title {
          text-decoration: line-through;
          color: #9e9e9e;
        }
      }
    }
    
    .todo-content {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 12px;
    }
    
    .todo-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    
    .todo-title {
      font-size: 16px;
      font-weight: 500;
      word-break: break-word;
    }
    
    .todo-id {
      font-size: 12px;
      color: #9e9e9e;
    }
    
    .todo-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }
  `]
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Input() isFavorite = false;
  
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() toggleFavorite = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
}
