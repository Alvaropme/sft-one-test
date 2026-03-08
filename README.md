# Angular Todo Application

A modern, production-ready Todo application built with Angular 19+ demonstrating professional architecture, best practices, and clean code.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete todos
- **Filtering**: Filter todos by status (completed/pending) and search
- **Pagination**: Paginated todo list
- **Favorites**: Mark todos as favorites (persisted in localStorage)
- **User Preferences**: Theme and language settings (stored in cookies)
- **State Management**: Angular Signals-based reactive state
- **Error Handling**: Global error handling with user-friendly messages
- **HTTP Interceptors**: Auth and error interceptors
- **Lazy Loading**: Feature modules loaded on demand
- **Responsive UI**: Material Design with Angular Material

## Technologies Used

- **Angular 19+**: Latest Angular with standalone components
- **TypeScript**: Strict mode with strong typing
- **Angular Material**: Modern Material Design components
- **RxJS**: Reactive programming
- **Angular Signals**: Reactive state management
- **Jest**: Unit testing framework
- **ESLint**: Code linting
- **SCSS**: CSS preprocessor

## Project Structure

```
src/app
├── core/                    # Global singleton services
│   ├── config/             # Application configuration
│   ├── error-handler/      # Global error handler
│   ├── interceptors/       # HTTP interceptors (auth, error)
│   └── services/           # Core services (storage, logging, error)
├── features/                # Feature modules
│   ├── settings/           # User preferences
│   └── todos/              # Todo feature
│       ├── components/     # Todo components
│       ├── models/         # TypeScript interfaces
│       ├── pages/          # Page components
│       ├── services/       # Feature services
│       └── store/          # Signals-based store
├── layout/                  # Layout components
└── shared/                  # Shared/reusable components
    └── components/         # Reusable UI components
```

## Architecture

### State Management (Signals)

The application uses Angular Signals for reactive state management:

- **Signals**: Primitive reactive values (`signal`)
- **Computed**: Derived values (`computed`)
- **Effects**: Side effects (`effect`)

Example from `TodoStore`:

```typescript
readonly todos = computed(() => this.todosSignal());
readonly loading = computed(() => this.loadingSignal());
readonly filteredTodos = computed(() => {
  const todos = this.todosSignal();
  const favorites = this.favoritesSignal();
  return todos.map(todo => ({
    ...todo,
    isFavorite: favorites.includes(todo.id),
  }));
});
```

### Lazy Loading

Routes are lazy loaded for better performance:

```typescript
{
  path: 'todos',
  loadChildren: () => import('./features/todos/todos.routes').then(m => m.todosRoutes),
}
```

### HTTP Interceptors

Two interceptors are configured:

1. **AuthInterceptor**: Adds Bearer token to requests
2. **ErrorInterceptor**: Handles HTTP errors globally

### Storage Service

Manages three storage types:

- **LocalStorage**: Favorites and cached todos
- **SessionStorage**: Temporary filters
- **Cookies**: User preferences (theme, language)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:4200`

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test:coverage

# Run tests in watch mode
npm test:watch
```

## Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## API Integration

This application uses the JSONPlaceholder API:

- **Base URL**: `https://jsonplaceholder.typicode.com`
- **Endpoints**:
  - `GET /todos` - List all todos
  - `GET /todos/:id` - Get single todo
  - `POST /todos` - Create todo
  - `PUT /todos/:id` - Update todo
  - `DELETE /todos/:id` - Delete todo

## Technical Decisions

### Standalone Components

All components use the standalone API, eliminating the need for NgModules:

```typescript
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, ...],
  ...
})
export class TodoItemComponent { }
```

### Control Flow Syntax

Using modern Angular control flow:

```html
@if (loading()) {
  <app-loading></app-loading>
}
@for (todo of todos(); track todo.id) {
  <app-todo-item [todo]="todo"></app-todo-item>
}
```

### OnPush Change Detection

All components use `ChangeDetectionStrategy.OnPush` for performance:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  ...
})
```

### Typed Forms

Using Angular's typed reactive forms:

```typescript
form = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(3)]],
  userId: [1, [Validators.required, Validators.min(1)]],
  completed: [false],
});
```

## Component Communication

The application demonstrates multiple communication patterns:

1. **Input/Output**: Parent-child component communication
2. **Signals**: Service-based state sharing via signals
3. **ViewChild**: Direct component access

## Build

```bash
# Build for production
npm run build

# Build for development
npm run watch
```

## License

MIT
