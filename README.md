# Angular Todo App

A Todo management application developed as part of a frontend technical assessment for Software One.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Angular CLI >= 21

```bash
npm install -g @angular/cli
```

### Installation

```bash
git clone <your-repo-url>
cd angular-todo-app
npm install
```

### Run the development server

```bash
ng serve
```

Navigate to `http://localhost:4200`. The app reloads automatically on file changes.

### Build for production

```bash
ng build
```

Output is placed in the `dist/` folder.

### Run tests

```bash
npm run test:coverage
```

---

## Project Structure

```
src/app
├── core/                    # Global singleton services
│   ├── config/              # Application configuration
│   ├── error-handler/       # Global runtime error handler
│   ├── interceptors/        # HTTP interceptors (auth, error)
│   └── services/            # Core services (storage, logging, error)
├── features/                # Feature modules
│   ├── settings/            # User preferences
│   └── todos/               # Todo feature
│       ├── components/      # Todo UI components
│       ├── dialogs/         # Feature-scoped dialog components
│       ├── models/          # TypeScript interfaces and types
│       ├── pages/           # Routed page components
│       ├── services/        # Feature HTTP services
│       └── store/           # Signals-based state store
├── layout/                  # Shell layout component
└── shared/                  # Shared reusable components
    └── components/          # LoadingComponent, AlertComponent
```

---

## Requirements Review

### Angular & Tooling

**Angular CLI 21** — visible in `package.json` line 16.

**TypeScript strict mode** — enabled in `tsconfig.json` line 6.

**ESLint** — v21, configured in `devDependencies`.

**Prettier** — v3.8.1, configured in `devDependencies`.

**SCSS** — applied for layout and per-component styles.

**Angular Material** — used as the UI component library throughout the app.

---

### Components & Modules

Four feature components organized by responsibility:

- `todo-filters` — dedicated filter UI (search + status)
- `todo-form` — reactive form for creating and editing todos
- `todo-item` — individual todo card
- `todo-list` — paginated list of todo items

Communication between components uses `input()`/`output()` signals throughout. `TodoService` handles all API interactions via Observables.

**A note on ViewChild/ViewChildren** — these were not used as no justified use case was found. Child component communication is handled entirely via `input()`/`output()` signals, and direct DOM access was not required thanks to Angular Material's built-in focus management. Using `ViewChild` artificially to tick a requirement box would contradict the modern Angular practices applied throughout the codebase.

---

### Lazy Loading

Lazy loading is implemented for all feature routes in `app.routes.ts`. Each feature loads its component only when the route is first visited.

---

### Interceptors

Two interceptors are configured in `src/app/core/interceptors`:

- **Auth interceptor** — simulated since no real authentication system is in scope. Behaves exactly as a real auth interceptor would but injects a fixed token placeholder that does not break API calls.
- **Error interceptor** — global HTTP error handler that maps status codes to user-friendly messages, logs them via `LoggingService`, and surfaces them through `ErrorService` to the `AlertComponent`.

---

### Change Detection

**A note on OnPush and ChangeDetectorRef** — these are pre-signals patterns for manual change detection control. Since this app uses Angular Signals throughout, Angular's reactivity is already granular by design. Adding `OnPush` or `ChangeDetectorRef` manually would be redundant and would contradict the signals-first approach.

**TrackBy** — fully implemented via the `track` expression in Angular 17+'s built-in `@for` syntax in `todo-list.component.html`. This replaces the legacy `*ngFor [trackBy]` pattern and achieves the same DOM reuse optimization.

---

### Standalone Components

All components in this application are standalone — this is the Angular 21 default and best practice. No `NgModule` declarations exist anywhere in the codebase.

Utility components: `LoadingComponent` and `AlertComponent` in `src/app/shared/components`.

Business components consuming services: `TodosPageComponent`, `TodoDetailPageComponent`, and others throughout the todos feature.

---

### API Integration

Built on the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) as required. Full CRUD operations are implemented (Create, Read, Update, Delete).

Since JSONPlaceholder does not persist write operations, all mutations are tracked locally via a signal-based overlay layer in the store and synced to `localStorage`. This means created, updated, and deleted todos survive page reloads, simulating a real persistent backend.

Loading, error, and success states are handled globally via `TodoStore`, `ErrorService`, and the `AlertComponent`.

Pagination and filtering (search + status) are fully implemented.

---

### Cookie & Local Storage Management

`StorageService` (`src/app/core/services/storage.service.ts`) provides a unified API for all three browser storage mechanisms:

| Storage | Used for |
|---|---|
| `localStorage` | Favorites (persistent across sessions) |
| `sessionStorage` | Active filters (cleared when tab closes) |
| `cookie` | Theme and language preferences |

All three support generic `setItem<T>`, `getItem<T>`, `removeItem`, and `clear` methods.

---

### Reactive Forms & Validation

`TodoFormComponent` implements a reactive form with:

- **Synchronous validators** — required, minlength (3), maxlength (100), min value
- **Async validator** — duplicate title detection against existing todos
- **User-friendly error messages** — inline errors displayed per field on touch
- **Submit guard** — button disabled while form is invalid, pending, or submitting

---

### Error Handling & Logging

Three layers of error handling:

- **HTTP errors** — `ErrorInterceptor` maps status codes to messages, logs via `LoggingService`, and surfaces them to the UI via `AlertComponent`
- **Runtime errors** — `GlobalErrorHandler` (`src/app/core/error-handler/`) catches any unhandled JavaScript exceptions via Angular's `ErrorHandler` token
- **Validation errors** — inline form field errors handled directly in `TodoFormComponent`. A dedicated `ValidationErrorService` centralises error message mapping for reuse across forms

---

### Unit Testing

Jest is configured as the test runner with a zoneless environment. Tests are written for:

- `TodoItemComponent` — 100% coverage
- `TodoFormComponent` — 100% coverage
- `TodoService` — 100% coverage

Tests use `HttpTestingController` for HTTP assertions, `ComponentRef.setInput()` for signal inputs, and `flushPromises` for async validators in a zoneless environment.

```bash
npm run test:coverage
```