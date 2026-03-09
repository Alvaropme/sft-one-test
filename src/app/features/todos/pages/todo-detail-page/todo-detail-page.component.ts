import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TodoStore } from '../../store/todo.store';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-todo-detail-page',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    LoadingComponent,
    MatToolbarModule
  ],
  templateUrl: './todo-detail-page.component.html',
  styleUrl: './todo-detail-page.component.scss',
})
export class TodoDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(TodoStore);

  readonly todo = computed(() => this.store.selectedTodo());

  readonly isFavorite = computed(() => {
    const todo = this.todo();
    return todo ? this.store.favorites().includes(todo.id) : false;
  });

  readonly createdDate = computed(() => {
    const todo = this.todo();
    if (!todo) return 'Unknown';
    return new Date(todo.id * 1000000000).toLocaleDateString();
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.loadTodoById(+id);
  }

  toggleComplete(): void {
    const todo = this.todo();
    if (todo) this.store.toggleComplete(todo.id);
  }

  toggleFavorite(): void {
    const todo = this.todo();
    if (todo) this.store.toggleFavorite(todo.id);
  }
}