export const environment = {
  production: true,
  api: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    todosEndpoint: '/todos',
    timeout: 30000,
  },
  storage: {
    localStorageKeys: {
      favorites: 'todos_favorites',
      todos: 'todos_cache',
    },
    sessionStorageKeys: {
      filters: 'todos_filters',
    },
    cookieKeys: {
      theme: 'theme',
      language: 'language',
    },
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },
  debounceTime: 300,
};
