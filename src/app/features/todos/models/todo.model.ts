export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface CreateTodoDto {
  userId: number;
  title: string;
  completed: boolean;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}

export interface TodoFilter {
  completed?: boolean | null;
  search?: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}
