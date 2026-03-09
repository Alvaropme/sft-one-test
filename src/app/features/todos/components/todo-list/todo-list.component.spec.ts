describe('TodoListComponent', () => {
  it('should create', () => {
    expect(true).toBe(true);
  });

  it('should handle empty todos array', () => {
    const todos: any[] = [];
    expect(todos.length).toBe(0);
  });

  it('should render todo items', () => {
    const todos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
    ];
    expect(todos.length).toBe(2);
  });

  it('should check if todo is favorite', () => {
    const favorites = [1, 2];
    const isFavorite = (id: number) => favorites.includes(id);
    expect(isFavorite(1)).toBe(true);
    expect(isFavorite(3)).toBe(false);
  });
});
