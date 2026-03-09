import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { API_CONFIG } from '../../../core/config/api.config';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../models/todo.model';

const baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.todosEndpoint}`;

const mockTodo: Todo = {
  id: 1,
  userId: 1,
  title: 'Test Todo',
  completed: false,
};

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifies no unexpected requests were made
    httpMock.verify();
  });

  // ─── getTodos ─────────────────────────────────────────────────────────

  describe('getTodos', () => {
    it('should fetch todos with default pagination', () => {
      service.getTodos().subscribe(result => {
        expect(result.todos).toEqual([mockTodo]);
        expect(result.total).toBe(1);
      });

      const req = httpMock.expectOne(r => r.url === baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('_page')).toBe('1');
      expect(req.request.params.get('_limit')).toBe('10');

      req.flush([mockTodo], {
        headers: { 'X-Total-Count': '1' },
      });
    });

    it('should fetch todos with custom pagination', () => {
      service.getTodos(2, 5).subscribe(result => {
        expect(result.todos).toEqual([mockTodo]);
      });

      const req = httpMock.expectOne(r => r.url === baseUrl);
      expect(req.request.params.get('_page')).toBe('2');
      expect(req.request.params.get('_limit')).toBe('5');
      req.flush([mockTodo], { headers: { 'X-Total-Count': '1' } });
    });

    it('should apply completed filter', () => {
      service.getTodos(1, 10, { completed: true }).subscribe();

      const req = httpMock.expectOne(r => r.url === baseUrl);
      expect(req.request.params.get('completed')).toBe('true');
      req.flush([], { headers: { 'X-Total-Count': '0' } });
    });

    it('should apply search filter', () => {
      service.getTodos(1, 10, { search: 'test' }).subscribe();

      const req = httpMock.expectOne(r => r.url === baseUrl);
      expect(req.request.params.get('q')).toBe('test');
      req.flush([], { headers: { 'X-Total-Count': '0' } });
    });

    it('should apply both filters combined', () => {
      service.getTodos(1, 10, { completed: false, search: 'todo' }).subscribe();

      const req = httpMock.expectOne(r => r.url === baseUrl);
      expect(req.request.params.get('completed')).toBe('false');
      expect(req.request.params.get('q')).toBe('todo');
      req.flush([], { headers: { 'X-Total-Count': '0' } });
    });

    it('should not apply completed filter when undefined', () => {
      service.getTodos(1, 10, { completed: undefined }).subscribe();

      const req = httpMock.expectOne(r => r.url === baseUrl);
      expect(req.request.params.has('completed')).toBe(false);
      req.flush([], { headers: { 'X-Total-Count': '0' } });
    });

    it('should return 0 total when X-Total-Count header is missing', () => {
      service.getTodos().subscribe(result => {
        expect(result.total).toBe(0);
      });

      const req = httpMock.expectOne(r => r.url === baseUrl);
      req.flush([]);
    });

    it('should return empty array when body is null', () => {
      service.getTodos().subscribe(result => {
        expect(result.todos).toEqual([]);
      });

      const req = httpMock.expectOne(r => r.url === baseUrl);
      req.flush(null, { headers: { 'X-Total-Count': '0' } });
    });
  });

  // ─── getTodoById ──────────────────────────────────────────────────────

  describe('getTodoById', () => {
    it('should fetch a todo by id', () => {
      service.getTodoById(1).subscribe(todo => {
        expect(todo).toEqual(mockTodo);
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTodo);
    });
  });

  // ─── createTodo ───────────────────────────────────────────────────────

  describe('createTodo', () => {
    it('should create a todo', () => {
      const dto: CreateTodoDto = { title: 'New Todo', userId: 1, completed: false };

      service.createTodo(dto).subscribe(todo => {
        expect(todo).toEqual(mockTodo);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockTodo);
    });
  });

  // ─── updateTodo ───────────────────────────────────────────────────────

  describe('updateTodo', () => {
    it('should update a todo', () => {
      const dto: UpdateTodoDto = { title: 'Updated', completed: true };

      service.updateTodo(1, dto).subscribe(todo => {
        expect(todo).toEqual({ ...mockTodo, ...dto });
      });

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush({ ...mockTodo, ...dto });
    });
  });

  // ─── deleteTodo ───────────────────────────────────────────────────────

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      let completed = false;
      service.deleteTodo(1).subscribe(() => completed = true);

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(completed).toBe(true);
    });
  });
});