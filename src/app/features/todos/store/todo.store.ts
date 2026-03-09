import { Injectable, inject, signal, computed, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter, PaginationConfig } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { StorageService } from '../../../core/services/storage.service';
import { LoggingService } from '../../../core/services/logging.service';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  private readonly todoService = inject(TodoService);
  private readonly storageService = inject(StorageService);
  private readonly loggingService = inject(LoggingService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly todosSignal = signal<Todo[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly selectedTodoSignal = signal<Todo | null>(null);
  private readonly favoritesSignal = signal<number[]>(this.storageService.getFavorites());
  private readonly filterSignal = signal<TodoFilter>({});
  private readonly paginationSignal = signal<PaginationConfig>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  readonly todos = this.todosSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedTodo = this.selectedTodoSignal.asReadonly();
  readonly favorites = this.favoritesSignal.asReadonly();
  readonly filter = this.filterSignal.asReadonly();
  readonly pagination = this.paginationSignal.asReadonly();

  readonly filteredTodos = computed(() => {
    const todos = this.todosSignal();
    const filter = this.filterSignal();

    return todos.filter(todo => {
      const matchesSearch = filter.search
        ? todo.title.toLowerCase().includes(filter.search.toLowerCase())
        : true;
      const matchesStatus = filter.completed !== undefined
        ? todo.completed === filter.completed
        : true;
      return matchesSearch && matchesStatus;
    });
  });

  constructor() {
    effect(() => {
      this.storageService.setFavorites(this.favoritesSignal());
    });

    effect(() => {
      this.storageService.setFilters(
        this.filterSignal() as unknown as Record<string, unknown>
      );
    });

    const savedFilter = this.storageService.getFilters();
    if (savedFilter) {
      this.filterSignal.set(savedFilter as TodoFilter);
    }
  }

  loadTodos(page = 1, pageSize = 10): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.todoService.getTodos(page, pageSize, this.filterSignal())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ todos, total }) => {
          this.todosSignal.set(todos);
          this.paginationSignal.set({ page, pageSize, total });
          this.loadingSignal.set(false);
          this.loggingService.info('Todos loaded', { count: todos.length });
        },
        error: (err) => {
          this.errorSignal.set(err.message ?? 'Failed to load todos');
          this.loadingSignal.set(false);
          this.loggingService.error('Failed to load todos', err);
        },
      });
  }

  loadTodoById(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.todoService.getTodoById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todo) => {
          this.selectedTodoSignal.set(todo);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(err.message ?? 'Failed to load todo');
          this.loadingSignal.set(false);
        },
      });
  }

  createTodo(todo: CreateTodoDto): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.todoService.createTodo(todo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newTodo) => {
          const todoWithId = { ...newTodo, id: newTodo.id || Date.now() };
          this.todosSignal.update(todos => [todoWithId, ...todos]);
          this.loadingSignal.set(false);
          this.loggingService.logEvent('todo_created', { id: todoWithId.id });
        },
        error: (err) => {
          this.errorSignal.set(err.message ?? 'Failed to create todo');
          this.loadingSignal.set(false);
        },
      });
  }

  updateTodo(id: number, todo: UpdateTodoDto): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.todoService.updateTodo(id, todo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedTodo) => {
          const todoWithId = { ...updatedTodo, id };
          this.todosSignal.update(todos =>
            todos.map(t => t.id === id ? todoWithId : t)
          );
          if (this.selectedTodoSignal()?.id === id) {
            this.selectedTodoSignal.set(todoWithId);
          }
          this.loadingSignal.set(false);
          this.loggingService.logEvent('todo_updated', { id });
        },
        error: (err) => {
          this.errorSignal.set(err.message ?? 'Failed to update todo');
          this.loadingSignal.set(false);
        },
      });
  }

  deleteTodo(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.todoService.deleteTodo(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.todosSignal.update(todos => todos.filter(t => t.id !== id));
          if (this.selectedTodoSignal()?.id === id) {
            this.selectedTodoSignal.set(null);
          }
          this.loadingSignal.set(false);
          this.loggingService.logEvent('todo_deleted', { id });
        },
        error: (err) => {
          this.errorSignal.set(err.message ?? 'Failed to delete todo');
          this.loadingSignal.set(false);
        },
      });
  }

  toggleComplete(id: number): void {
    const todo = this.todosSignal().find(t => t.id === id);
    if (todo) this.updateTodo(id, { completed: !todo.completed });
  }

  toggleFavorite(id: number): void {
    const favorites = this.favoritesSignal();
    this.favoritesSignal.set(
      favorites.includes(id)
        ? favorites.filter(f => f !== id)
        : [...favorites, id]
    );
  }

  setFilter(filter: TodoFilter): void {
    this.filterSignal.set(filter);
    this.loadTodos(1, this.paginationSignal().pageSize);
  }

  setPage(page: number): void {
    this.loadTodos(page, this.paginationSignal().pageSize);
  }

  clearSelectedTodo(): void {
    this.selectedTodoSignal.set(null);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}