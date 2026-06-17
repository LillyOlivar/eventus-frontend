# Eventus Frontend — Angular 17

Interfaz web de la Plataforma de Gestión de Eventos Académicos  
**Universidad del Cauca — Desarrollo de Aplicaciones Web**

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Angular | 17 | Framework principal |
| TypeScript | 5.4 | Lenguaje |
| Angular Signals | 17 | Gestión de estado reactivo |
| Angular Router | 17 | Enrutamiento lazy loading |
| HttpClient | 17 | Consumo de API REST |
| Reactive Forms | 17 | Formularios con validación |

---

## Estructura del proyecto

```
eventus-frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # authGuard, adminGuard, guestGuard
│   │   │   ├── interceptors/    # authInterceptor (inyecta JWT)
│   │   │   └── services/        # AuthService, EventsService, RegistrationsService
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/       # Página de login
│   │   │   │   └── register/    # Página de registro
│   │   │   ├── events/
│   │   │   │   ├── event-list/  # Listado con filtros
│   │   │   │   ├── event-detail/# Detalle + inscripción
│   │   │   │   └── event-form/  # Crear / editar evento (admin)
│   │   │   ├── dashboard/       # Panel del participante
│   │   │   └── admin/
│   │   │       └── admin-panel/ # Panel admin con estadísticas
│   │   ├── shared/
│   │   │   └── models/          # Interfaces TypeScript (User, Event, Registration...)
│   │   ├── app.component.*      # Root con navbar
│   │   ├── app.config.ts        # Providers (router, http, animations)
│   │   └── app.routes.ts        # Rutas con lazy loading
│   ├── environments/            # environment.ts / environment.prod.ts
│   ├── styles.css               # Estilos globales (design system)
│   ├── index.html
│   └── main.ts                  # Bootstrap standalone
├── angular.json
├── tsconfig.json
└── package.json
```

---

## Requisitos previos

- Node.js ≥ 18
- Angular CLI: `npm install -g @angular/cli`
- Backend Eventus corriendo en `http://localhost:3000`

---

## Instalación y configuración

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/eventus-frontend.git
cd eventus-frontend
npm install
```

### 2. Configurar entorno

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',  // URL de tu backend
};
```

### 3. Iniciar la aplicación

```bash
ng serve
# o
npm start
```

Disponible en: **`http://localhost:4200`**

---

## Funcionalidades

### Para todos los usuarios (sin login)
- Ver listado de eventos con filtros por categoría y estado
- Ver detalle de cada evento (lugar, fechas, cupos disponibles)

### Para participantes (PARTICIPANT)
- Registrarse con validación de contraseña segura
- Iniciar sesión con JWT
- Inscribirse a eventos (con control de cupos)
- Cancelar inscripciones
- Panel personal con mis inscripciones y estado de asistencia

### Para administradores (ADMIN)
- CRUD completo de eventos (crear, editar, eliminar)
- Panel admin con estadísticas: total eventos, usuarios, inscripciones
- Gestión de tabla de todos los eventos
- Marcar asistencia de participantes

---

## Rutas de la aplicación

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/events` | EventListComponent | Público |
| `/events/:id` | EventDetailComponent | Público |
| `/login` | LoginComponent | Solo no autenticados |
| `/register` | RegisterComponent | Solo no autenticados |
| `/dashboard` | DashboardComponent | Autenticado |
| `/admin` | AdminPanelComponent | Solo ADMIN |
| `/admin/events/new` | EventFormComponent | Solo ADMIN |
| `/admin/events/:id/edit` | EventFormComponent | Solo ADMIN |

---

## Arquitectura y patrones usados

### Signals (Angular 17)
El `AuthService` usa Signals para gestión reactiva del estado del usuario:
```typescript
private _currentUser = signal<User | null>(null);
currentUser = this._currentUser.asReadonly();
isLoggedIn = computed(() => !!this._token());
isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');
```

### Interceptor JWT automático
`authInterceptor` inyecta el token en todas las requests automáticamente:
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
  return next(req);
};
```

### Lazy loading de rutas
Todos los componentes se cargan bajo demanda para optimizar el rendimiento inicial:
```typescript
loadComponent: () => import('./features/events/event-list/...').then(m => m.EventListComponent)
```

### Guards de ruta
- `authGuard` — redirige a `/login` si no está autenticado
- `adminGuard` — redirige a `/events` si no es ADMIN
- `guestGuard` — redirige a `/events` si ya está autenticado

### Validaciones en formularios
- Reactive Forms con validadores síncronos
- Validación de contraseña: mayúscula + minúscula + número + símbolo
- Mensajes de error específicos por campo
- `markAllAsTouched()` al intentar submit con formulario inválido

---

## Scripts

```bash
npm start              # Desarrollo en localhost:4200
npm run build          # Build de producción en /dist
npm run build:prod     # Alias de build producción
npm test               # Tests unitarios con Karma
```

---

## Despliegue en Vercel (recomendado)

1. Hacer build: `npm run build:prod`
2. Conectar repositorio en [vercel.com](https://vercel.com)
3. Framework preset: **Angular**
4. Output directory: `dist/eventus-frontend/browser`
5. Agregar variable de entorno o actualizar `environment.prod.ts` con la URL del backend en producción

**Configurar redirects para SPA** — crear `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Equipo

**Asignatura:** Desarrollo de Aplicaciones Web  
**Universidad del Cauca — Facultad de Ingeniería Electrónica y Telecomunicaciones**
