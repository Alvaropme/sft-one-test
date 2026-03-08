import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter, PaginationConfig } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { StorageService } from '../../../core/services/storage.service';
import { LoggingService } from '../../../core/services/logging.service';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  private todoService = inject(TodoService);
  private storageService = inject(StorageService);
  private loggingService = inject(LoggingService);

  private todosSignal = signal<Todo[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private selectedTodoSignal = signal<Todo | null>(null);
  private favoritesSignal = signal<number[]>(this.storageService.getFavorites());
  private filterSignal = signal<TodoFilter>({});
  private paginationSignal = signal<PaginationConfig>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  readonly todos = computed(() => this.todosSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly selectedTodo = computed(() => this.selectedTodoSignal());
  readonly favorites = computed(() => this.favoritesSignal());
  readonly filter = computed(() => this.filterSignal());
  readonly pagination = computed(() => this.paginationSignal());

  readonly filteredTodos = computed(() => {
    const todos = this.todosSignal();
    const favorites = this.favoritesSignal();
    return todos.map(todo => ({
      ...todo,
      isFavorite: favorites.includes(todo.id),
    }));
  });

  constructor() {
    effect(() => {
      const favorites = this.favoritesSignal();
      this.storageService.setFavorites(favorites);
    });

    effect(() => {
      const filter = this.filterSignal();
      this.storageService.setFilters(filter as unknown as Record<string, unknown>);
    });

    const savedFilter = this.storageService.getFilters();
    if (savedFilter) {
      this.filterSignal.set(savedFilter as TodoFilter);
    }
  }

  loadTodos(page = 1, pageSize = 10): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const filter = this.filterSignal();

    this.todoService.getTodos(page, pageSize, filter).subscribe({
      next: ({ todos, total }) => {
        this.todosSignal.set(todos);
        this.paginationSignal.set({ page, pageSize, total });
        this.loadingSignal.set(false);
        this.loggingService.info('Todos loaded successfully', { count: todos.length });
      },
      error: (err) => {
        this.errorSignal.set(err.message || 'Failed to load todos');
        this.loadingSignal.set(false);
        this.loggingService.error('Failed to load todos', err);
      },
    });
  }

  loadTodoById(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.todoService.getTodoById(id).subscribe({
      next: (todo) => {
        this.selectedTodoSignal.set(todo);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err.message || 'Failed to load todo');
        this.loadingSignal.set(false);
      },
    });
  }

  createTodo(todo: CreateTodoDto): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.todoService.createTodo(todo).subscribe({
      next: (newTodo) => {
        const todoWithId = { ...newTodo, id: newTodo.id || Date.now() };
        this.todosSignal.update(todos => [todoWithId, ...todos]);
        this.loadingSignal.set(false);
        this.loggingService.logEvent('todo_created', { id: todoWithId.id });
      },
      error: (err) => {
        this.errorSignal.set(err.message || 'Failed to create todo');
        this.loadingSignal.set(false);
      },
    });
  }

  updateTodo(id: number, todo: UpdateTodoDto): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.todoService.updateTodo(id, todo).subscribe({
      next: (updatedTodo) => {
        const todoWithId = { ...updatedTodo, id };
        this.todosSignal.update(todos =>
          todos.map(t => t.id === id ? todoWithId : t)
        );
        
        const selected = this.selectedTodoSignal();
        if (selected?.id === id) {
          this.selectedTodoSignal.set(todoWithId);
        }
        
        this.loadingSignal.set(false);
        this.loggingService.logEvent('todo_updated', { id });
      },
      error: (err) => {
        this.errorSignal.set(err.message || 'Failed to update todo');
        this.loadingSignal.set(false);
      },
    });
  }

  deleteTodo(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todosSignal.update(todos => todos.filter(t => t.id !== id));
        
        const selected = this.selectedTodoSignal();
        if (selected?.id === id) {
          this.selectedTodoSignal.set(null);
        }
        
        this.loadingSignal.set(false);
        this.loggingService.logEvent('todo_deleted', { id });
      },
      error: (err) => {
        this.errorSignal.set(err.message || 'Failed to delete todo');
        this.loadingSignal.set(false);
      },
    });
  }

  toggleComplete(id: number): void {
    const todo = this.todosSignal().find(t => t.id === id);
    if (todo) {
      this.updateTodo(id, { completed: !todo.completed });
    }
  }

  toggleFavorite(id: number): void {
    const favorites = this.favoritesSignal();
    if (favorites.includes(id)) {
      this.favoritesSignal.set(favorites.filter(f => f !== id));
    } else {
      this.favoritesSignal.set([...favorites, id]);
    }
  }

  setFilter(filter: TodoFilter): void {
    this.filterSignal.set(filter);
    this.loadTodos(1, this.paginationSignal().pageSize);
  }

  setPage(page: number): void {
    const { pageSize } = this.paginationSignal();
    this.loadTodos(page, pageSize);
  }

  clearSelectedTodo(): void {
    this.selectedTodoSignal.set(null);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
