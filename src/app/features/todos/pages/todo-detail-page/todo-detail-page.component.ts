import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TodoStore } from '../../store/todo.store';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-todo-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    LoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="detail-page">
      <mat-toolbar color="primary">
        <button mat-icon-button routerLink="/todos">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Todo Detail</span>
      </mat-toolbar>

      <div class="content">
        @if (store.loading()) {
          <app-loading message="Loading todo..."></app-loading>
        }

        @if (!store.loading() && store.selectedTodo()) {
          <mat-card class="detail-card">
            <mat-card-header>
              <mat-card-title>Todo #{{ store.selectedTodo()?.id }}</mat-card-title>
              <mat-card-subtitle>
                User ID: {{ store.selectedTodo()?.userId }}
              </mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <div class="todo-status">
                <mat-checkbox 
                  [checked]="store.selectedTodo()?.completed" 
                  (change)="toggleComplete()"
                  color="primary">
                  Completed
                </mat-checkbox>
                
                <span class="status-badge" [class.completed]="store.selectedTodo()?.completed">
                  {{ store.selectedTodo()?.completed ? 'Completed' : 'Pending' }}
                </span>
              </div>
              
              <div class="todo-title">
                <h2>{{ store.selectedTodo()?.title }}</h2>
              </div>

              <div class="todo-meta">
                <p><strong>Created:</strong> {{ getCreatedDate() }}</p>
                <p><strong>Favorite:</strong> {{ isFavorite() ? 'Yes' : 'No' }}</p>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              <button mat-button color="primary" (click)="toggleFavorite()">
                <mat-icon>{{ isFavorite() ? 'star' : 'star_border' }}</mat-icon>
                {{ isFavorite() ? 'Remove from favorites' : 'Add to favorites' }}
              </button>
              <button mat-button routerLink="/todos">
                <mat-icon>list</mat-icon>
                Back to list
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .detail-page {
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .content {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .detail-card {
      margin-bottom: 16px;
    }
    
    .todo-status {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      background: #ff9800;
      color: white;
      font-size: 12px;
      font-weight: 500;
      
      &.completed {
        background: #4caf50;
      }
    }
    
    .todo-title {
      margin-bottom: 24px;
      
      h2 {
        font-size: 24px;
        margin: 0;
      }
    }
    
    .todo-meta {
      p {
        margin: 8px 0;
        color: #666;
      }
    }
    
    mat-card-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class TodoDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  store = inject(TodoStore);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.loadTodoById(+id);
    }
  }

  toggleComplete(): void {
    const todo = this.store.selectedTodo();
    if (todo) {
      this.store.toggleComplete(todo.id);
    }
  }

  toggleFavorite(): void {
    const todo = this.store.selectedTodo();
    if (todo) {
      this.store.toggleFavorite(todo.id);
      this.cdr.markForCheck();
    }
  }

  isFavorite(): boolean {
    const todo = this.store.selectedTodo();
    return todo ? this.store.favorites().includes(todo.id) : false;
  }

  getCreatedDate(): string {
    const todo = this.store.selectedTodo();
    if (!todo) return 'Unknown';
    return new Date(todo.id * 1000000000).toLocaleDateString();
  }
}
