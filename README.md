# Angular Todo App

Aplicación de gestión de tareas desarrollada como parte de una prueba técnica para desarrolladores frontend en Software One.
Se trata de una simple aplicación de tareas, ya que era una de las aplicaciones recomendadas en las bases de la prueba y la que mas encajaba con el API proporcionada.

---

## Primeros pasos

### Requisitos previos

- Node.js >= 18
- Angular CLI >= 21

```bash
npm install -g @angular/cli
```

### Instalación

```bash
git clone <url-del-repositorio>
cd angular-todo-app
npm install
```

### Ejecutar el servidor de desarrollo

```bash
ng serve
```

Navega a `http://localhost:4200`. La aplicación se recarga automáticamente con cada cambio en los ficheros.

### Compilar para producción

```bash
ng build
```

La salida se genera en la carpeta `dist/`.

### Ejecutar los tests

```bash
npm run test:coverage
```

---

## Estructura del proyecto

```
src/app
├── core/                    # Servicios singleton globales
│   ├── config/              # Configuración de la aplicación
│   ├── error-handler/       # Manejador global de errores en tiempo de ejecución
│   ├── interceptors/        # Interceptores HTTP (auth, errores)
│   └── services/            # Servicios base (almacenamiento, logging, errores)
├── features/                # Módulos de funcionalidad
│   ├── settings/            # Preferencias de usuario
│   └── todos/               # Funcionalidad de tareas
│       ├── components/      # Componentes de UI de tareas
│       ├── dialogs/         # Diálogos propios de la funcionalidad
│       ├── models/          # Interfaces y tipos TypeScript
│       ├── pages/           # Componentes de página con ruta
│       ├── services/        # Servicios HTTP de la funcionalidad
│       └── store/           # Estado basado en Signals
├── layout/                  # Componente shell de la aplicación
└── shared/                  # Componentes reutilizables
    └── components/          # LoadingComponent, AlertComponent
```

---

## Revisión de requisitos

### Angular y herramientas

**Angular CLI 21** — visible en `package.json`, línea 16.

**Modo strict de TypeScript** — activado en `tsconfig.json`, línea 6.

**ESLint** — v21, configurado en `devDependencies`.

**Prettier** — v3.8.1, configurado en `devDependencies`.

**SCSS** — aplicado en los estilos de layout y en cada componente.

**Angular Material** — utilizado como librería de componentes UI en toda la aplicación.

---

### Componentes y módulos

Cuatro componentes de funcionalidad organizados por responsabilidad:

- `todo-filters` — UI dedicada al filtrado (búsqueda y estado)
- `todo-form` — formulario reactivo para crear y editar tareas
- `todo-item` — tarjeta individual de una tarea
- `todo-list` — lista paginada de tareas

La comunicación entre componentes se gestiona mediante signals `input()`/`output()`. `TodoService` gestiona todas las interacciones con la API a través de Observables.

**Nota sobre ViewChild/ViewChildren** — no se han utilizado al no encontrar ningún caso de uso que lo justificase. La comunicación con componentes hijos se gestiona completamente mediante signals `input()`/`output()`, y el acceso directo al DOM no fue necesario gracias a la gestión automática de foco de Angular Material. Utilizar `ViewChild` de forma artificial para cumplir un requisito contradiría las buenas prácticas de Angular moderno aplicadas en el resto del código.

---

### Lazy Loading

Se ha implementado lazy loading para todas las rutas de funcionalidad en `app.routes.ts`. Cada módulo carga su componente únicamente cuando se visita la ruta por primera vez.

---

### Interceptores

Dos interceptores configurados en `src/app/core/interceptors`:

- **Interceptor de autenticación** — simulado al no contar con un sistema de autenticación real en el alcance de la prueba. Funciona exactamente igual que uno real pero inyecta un token fijo que no rompe las llamadas a la API.
- **Interceptor de errores** — manejador global de errores HTTP que mapea códigos de estado a mensajes comprensibles para el usuario, los registra mediante `LoggingService` y los muestra a través de `ErrorService` y `AlertComponent`.

---

### Detección de cambios

**Nota sobre OnPush y ChangeDetectorRef** — estos son patrones previos a las signals para el control manual de la detección de cambios. Al utilizar Angular Signals en toda la aplicación, la reactividad ya es granular por diseño. Añadir `OnPush` o `ChangeDetectorRef` de forma manual sería redundante y contradiría el enfoque signals-first aplicado en el proyecto.

**TrackBy** — implementado mediante la expresión `track` de la sintaxis `@for` integrada en Angular 17+, visible en `todo-list.component.html`. Esto reemplaza el patrón heredado `*ngFor [trackBy]` y consigue la misma optimización de reutilización del DOM.

---

### Componentes Standalone

Todos los componentes de esta aplicación son standalone — este es el comportamiento por defecto y la buena práctica en Angular 21. No existe ningún `NgModule` en todo el proyecto.

Componentes de utilidad: `LoadingComponent` y `AlertComponent` en `src/app/shared/components`.

Componentes de negocio que consumen servicios: `TodosPageComponent`, `TodoDetailPageComponent` y otros a lo largo de la funcionalidad de tareas.

---

### Integración con API

Construido sobre la [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) tal como se requería. Se han implementado operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar).

Dado que JSONPlaceholder no persiste las operaciones de escritura, todas las mutaciones se registran localmente mediante una capa de signals superpuesta en el store y se sincronizan con `localStorage`. Esto permite que las tareas creadas, actualizadas y eliminadas sobrevivan a recargas de página, simulando un backend real con persistencia.

Los estados de carga, error y éxito se gestionan globalmente a través de `TodoStore`, `ErrorService` y `AlertComponent`.

La paginación y el filtrado (búsqueda por texto y por estado) están completamente implementados.

---

### Gestión de cookies y almacenamiento local

`StorageService` (`src/app/core/services/storage.service.ts`) ofrece una API unificada para los tres mecanismos de almacenamiento del navegador:

| Almacenamiento | Uso |
|---|---|
| `localStorage` | Favoritos (persistentes entre sesiones) |
| `sessionStorage` | Filtros activos (se borran al cerrar la pestaña) |
| `cookie` | Preferencias de tema e idioma |

Los tres soportan métodos genéricos `setItem<T>`, `getItem<T>`, `removeItem` y `clear`.

---

### Formularios reactivos y validaciones

`TodoFormComponent` implementa un formulario reactivo con:

- **Validadores síncronos** — requerido, longitud mínima (3), longitud máxima (100), valor mínimo
- **Validador asíncrono** — detección de títulos duplicados contra las tareas existentes
- **Mensajes de error amigables** — errores en línea por campo, mostrados al interactuar
- **Bloqueo del envío** — botón deshabilitado mientras el formulario es inválido, pendiente o se está enviando

---

### Manejo de errores y logging

Tres capas de gestión de errores:

- **Errores HTTP** — `ErrorInterceptor` mapea códigos de estado a mensajes, los registra mediante `LoggingService` y los muestra en la UI a través de `AlertComponent`
- **Errores en tiempo de ejecución** — `GlobalErrorHandler` (`src/app/core/error-handler/`) captura cualquier excepción JavaScript no controlada mediante el token `ErrorHandler` de Angular
- **Errores de validación** — errores en línea gestionados directamente en `TodoFormComponent`. Un `ValidationErrorService` dedicado centraliza el mapeo de mensajes de error para su reutilización en otros formularios

- **Prueba de errores** — como bien comentamos antes, el api proporcionada no cuenta con escritura funcional, por lo cual los elementos que creemos nosotros se crean simuladamente en nuestro local, se podría haber montado un sistema de mockeo que funcionase guardando los mismos en el storage y trabajando sobre ello en vez de contra la API, pero hemos preferido dejarlo así para poder tener casos seguros de errores controlados que lancen los interceptores y el alert desarrollado.
Estos casos son la edición y el borrado de cualquier tarea que creemos nosotros. 

---

### Testing unitario

Jest está configurado como runner de tests en un entorno zoneless. Se han escrito tests para:

- `TodoItemComponent` — cobertura del 100%
- `TodoFormComponent` — cobertura del 100%
- `TodoService` — cobertura del 100%

Los tests utilizan `HttpTestingController` para las aserciones HTTP, `ComponentRef.setInput()` para las signals de entrada, y `flushPromises` para los validadores asíncronos en el entorno zoneless.

```bash
npm run test:coverage
```