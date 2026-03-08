import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);
  private baseUrl = API_CONFIG.baseUrl + API_CONFIG.todosEndpoint;

  getTodos(page = 1, limit = 10, filter?: TodoFilter): Observable<{ todos: Todo[]; total: number }> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    if (filter) {
      if (filter.completed !== undefined && filter.completed !== null) {
        params = params.set('completed', filter.completed.toString());
      }
      if (filter.search) {
        params = params.set('q', filter.search);
      }
    }

    return this.http.get<Todo[]>(this.baseUrl, { params }).pipe(
      map(todos => ({
        todos,
        total: todos.length,
      }))
    );
  }

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`);
  }

  createTodo(todo: CreateTodoDto): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, todo);
  }

  updateTodo(id: number, todo: UpdateTodoDto): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/${id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  toggleTodoComplete(id: number, completed: boolean): Observable<Todo> {
    return this.updateTodo(id, { completed });
  }
}
