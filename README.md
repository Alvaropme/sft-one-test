# Angular Todo App

Una aplicación de gestión de tareas desarrollada como parte de una prueba técnica para desarrolladores frontend para Software One.

---

## Primeros pasos

### Requisitos

- Node.js >= 18
- Angular CLI >= 21

```bash
npm install -g @angular/cli
```

### Instalación

```bash
git clone 
cd angular-todo-app
npm install
```

### Ejecutar el servidor de desarrollo

```bash
ng serve
```

Navega a http://localhost:4200. La aplicación se recargará automáticamente cuando haya cambios en los archivos.

### Compilar para producción

```bash
ng build
```

La salida se genera en la carpeta dist/.

---

## Reisión de requisitos

### Angular

- Proyecto creado con Angular CLI 17 o superior

En el package.json se muestra en la línea 16 que se ha creado con Angular 21.

-  TypeScript strict mode activado

En el archivo tsconfig.json se puede ver en la linea 6 que el strict mode esta activado.

-  Estructura de proyecto organizada

Se ha establecido una estructura organizada, separando funcionalidades, servicios y componentes. 
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

### Herramientas

 - ESLint configurado

Se ha instalado ESLint versión 21 como se muestra en el apartado devDependencies del package.json (linea 31).

- Prettier

Versión 3.8.1, se puede comprobar en devDependencies al igual que ESLint (linea 45).

-  Estilos usando SCSS

Se han aplicado estilos usando SCSS para layout y cada componente. Los estilos son simples devido a la limitación de tiempo y a que es solo una prueba técnica. 

-  Integrado Angular Material o PrimeNG

Se ha utilizado la libreria de componentes UI Angular Material. 