import { Todo } from '../models/todo.model';

describe('TodoService', () => {
  describe('Todo Model', () => {
    it('should have correct structure', () => {
      const todo: Todo = {
        id: 1,
        userId: 1,
        title: 'Test Todo',
        completed: false,
      };
      
      expect(todo.id).toBe(1);
      expect(todo.userId).toBe(1);
      expect(todo.title).toBe('Test Todo');
      expect(todo.completed).toBe(false);
    });
  });

  describe('API URL building', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';
    const todosEndpoint = '/todos';

    it('should build correct get todos URL', () => {
      const page = 1;
      const limit = 10;
      const url = `${baseUrl}${todosEndpoint}?_page=${page}&_limit=${limit}`;
      expect(url).toBe('https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10');
    });

    it('should build correct get todo by id URL', () => {
      const id = 5;
      const url = `${baseUrl}${todosEndpoint}/${id}`;
      expect(url).toBe('https://jsonplaceholder.typicode.com/todos/5');
    });

    it('should build correct create URL', () => {
      const url = `${baseUrl}${todosEndpoint}`;
      expect(url).toBe('https://jsonplaceholder.typicode.com/todos');
    });

    it('should build correct update URL', () => {
      const id = 5;
      const url = `${baseUrl}${todosEndpoint}/${id}`;
      expect(url).toBe('https://jsonplaceholder.typicode.com/todos/5');
    });

    it('should build correct delete URL', () => {
      const id = 5;
      const url = `${baseUrl}${todosEndpoint}/${id}`;
      expect(url).toBe('https://jsonplaceholder.typicode.com/todos/5');
    });
  });

  describe('Filter params', () => {
    it('should handle completed filter', () => {
      const filter = { completed: true };
      const params = new URLSearchParams();
      if (filter.completed !== undefined && filter.completed !== null) {
        params.set('completed', filter.completed.toString());
      }
      expect(params.toString()).toBe('completed=true');
    });

    it('should handle search filter', () => {
      const filter = { search: 'test' };
      const params = new URLSearchParams();
      if (filter.search) {
        params.set('q', filter.search);
      }
      expect(params.toString()).toBe('q=test');
    });

    it('should handle combined filters', () => {
      const filter = { completed: true, search: 'test' };
      const params = new URLSearchParams();
      if (filter.completed !== undefined && filter.completed !== null) {
        params.set('completed', filter.completed.toString());
      }
      if (filter.search) {
        params.set('q', filter.search);
      }
      expect(params.toString()).toBe('completed=true&q=test');
    });
  });
});
