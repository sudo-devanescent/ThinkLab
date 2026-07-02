# ThinkLab Backend

Plataforma de simulaciones adaptativas para el desarrollo del pensamiento crítico en estudiantes universitarios. El backend gestiona escenarios ramificados, evalúa decisiones en tiempo real y adapta la dificultad según el perfil cognitivo de cada usuario.

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [NestJS](https://nestjs.com/) | ^10.0 | Framework backend Node.js |
| [TypeORM](https://typeorm.io/) | ^0.3.17 | ORM para PostgreSQL |
| [PostgreSQL](https://www.postgresql.org/) | - | Base de datos relacional |
| [Passport](http://www.passportjs.org/) + JWT | - | Autenticación |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | ^5.1.1 | Hashing de contraseñas |
| [Jest](https://jestjs.io/) | ^29.5 | Testing unitario y E2E |
| [TypeScript](https://www.typescriptlang.org/) | ^5.1.3 | Lenguaje |

## Requisitos Previos

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

## Configuración del Entorno

Crear un archivo `.env` en la raíz del proyecto basado en las siguientes variables:

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=thinklab_owner
DB_PASSWORD= -
DB_NAME=thinklab
DB_SCHEMA=thinklab
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de PostgreSQL | `127.0.0.1` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario de BD | `thinklab_owner` |
| `DB_PASSWORD` | Contraseña de BD | - |
| `DB_NAME` | Nombre de la BD | `thinklab` |
| `DB_SCHEMA` | Esquema de BD | `thinklab` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | - |
| `PORT` | Puerto del servidor | `3000` |

## Instalación

```bash
# Instalar dependencias
npm install

# (Opcional) Compilar para producción
npm run build
```

La base de datos y el esquema deben crearse manualmente antes de iniciar:

```sql
CREATE DATABASE thinklab;
CREATE SCHEMA thinklab;
```

Las migraciones/tablas se gestionan externamente (el ORM corre con `synchronize: false` por seguridad).

## Ejecución

```bash
# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run start:prod

# Debug
npm run start:debug
```

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Compila TypeScript a `dist/` |
| `npm run start` | Inicia el servidor |
| `npm run start:dev` | Inicia en modo watch (hot-reload) |
| `npm run start:prod` | Inicia desde `dist/main.js` |
| `npm run test` | Ejecuta tests unitarios |
| `npm run test:e2e` | Ejecuta tests end-to-end |

## Arquitectura

```
src/
├── main.ts                         # Punto de entrada
├── app.module.ts                   # Módulo raíz
├── app.controller.ts               # Health check básico (GET /)
├── common/                         # Código compartido
│   ├── decorators/
│   │   └── roles.decorator.ts      # @Roles() para autorización
│   └── guards/
│       ├── jwt-auth.guard.ts       # Guard de autenticación JWT
│       └── roles.guard.ts          # Guard de roles
├── core/                           # Lógica de negocio pura
│   ├── evaluation-engine/
│   │   ├── engine.js               # Motor de evaluación de decisiones
│   │   ├── adaptive-rules.js       # Selección adaptativa de escenarios
│   │   ├── engine.test.js          # Tests del motor
│   │   └── adaptive-rules.test.js  # Tests de reglas adaptativas
│   └── types/
│       └── index.d.ts              # Contratos de tipos
├── entities/                       # Entidades TypeORM
│   ├── user.entity.ts
│   ├── session.entity.ts
│   ├── scenario.entity.ts
│   ├── scenario-option.entity.ts
│   ├── scenario-tag.entity.ts
│   ├── tag.entity.ts
│   ├── decision.entity.ts
│   ├── session-scenario.entity.ts
│   ├── cognitive-profile.entity.ts
│   └── adaptation-rule.entity.ts
├── health/                         # Health check
│   ├── health.module.ts
│   └── health.controller.ts
└── modules/                        # Módulos funcionales
    ├── auth/                       # Autenticación y registro
    ├── scenarios/                  # Gestión de escenarios
    ├── decisions/                  # Procesamiento de decisiones
    ├── profiles/                   # Perfiles cognitivos
    ├── teacher/                    # Panel docente
    └── adaptive/                   # Reglas de adaptación
```

### Módulos

| Módulo | Responsabilidad |
|--------|----------------|
| **Auth** | Registro e inicio de sesión con JWT. Crea perfil cognitivo inicial al registrar. |
| **Scenarios** | Obtiene el siguiente escenario adaptado al perfil del usuario. Usa el motor adaptativo para seleccionar según reglas. |
| **Decisions** | Procesa la decisión del estudiante, actualiza su perfil cognitivo mediante el motor de evaluación. |
| **Profiles** | Consulta el perfil cognitivo del usuario con etiquetas cualitativas. |
| **Teacher** | Panel para docentes: lista de estudiantes con sus perfiles y progreso. |
| **Adaptive** | Reglas de adaptación disponibles (actualmente registro de entidad). |

## API Endpoints

### Salud

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/` | No | Bienvenida |
| `GET` | `/health` | No | Verifica conexión a BD |

### Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/auth/register` | No | Registrar usuario |
| `POST` | `/auth/login` | No | Iniciar sesión |

**`POST /auth/register`**
```json
{
  "email": "estudiante@thinklab.edu.pe",
  "password": "mypassword",
  "fullName": "Nombre Completo",
  "role": "student"
}
```
- `role` es opcional (default: `student`)
- La contraseña debe tener al menos 6 caracteres

**`POST /auth/login`**
```json
{
  "email": "estudiante@thinklab.edu.pe",
  "password": "mypassword"
}
```
- Responde con `access_token` (JWT expira en 7 días) y datos del usuario

### Escenarios

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/scenarios/next` | JWT | Obtener siguiente escenario adaptado |

- El motor adaptativo selecciona el escenario según el perfil cognitivo del usuario
- Crea o reutiliza la sesión activa del usuario
- Retorna el escenario con opciones y `sessionScenarioId` para enviar decisiones

### Decisiones

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/decisions` | JWT | Enviar decisión de un escenario |

**`POST /decisions`**
```json
{
  "sessionScenarioId": "uuid-del-session-scenario",
  "optionId": "uuid-de-la-opcion",
  "responseTimeMs": 3500
}
```
- Actualiza el perfil cognitivo del usuario usando el motor de evaluación
- Valida que la opción pertenezca al escenario
- Solo se permite una decisión por `sessionScenarioId`

### Perfil

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/profile/me` | JWT | Obtener perfil cognitivo del usuario |

Responde con las dimensiones cognitivas (`coherence`, `risk`, `consistency`, `totalDecisions`) más etiquetas cualitativas:
| Dimensión | Rango | Etiquetas |
|-----------|-------|-----------|
| coherence | 0 - 1 | Bajo (< 0.4), Medio (0.4-0.7), Alto (>= 0.7) |
| risk | 0 - 1 | Bajo (< 0.4), Medio (0.4-0.7), Alto (>= 0.7) |
| consistency | 0 - 1 | Bajo (< 0.4), Medio (0.4-0.7), Alto (>= 0.7) |
| experience | - | Sin decisiones, Principiante (< 5), Intermedio (5-15), Avanzado (> 15) |

### Docente

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/teacher/students` | JWT | `teacher` | Lista de estudiantes con perfiles |

## Autenticación

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <access_token>
```

El token JWT incluye en su payload:
- `sub`: ID del usuario
- `email`: Correo del usuario
- `role`: Rol del usuario (`student` o `teacher`)

Los roles se verifican mediante el guard `RolesGuard` combinado con el decorador `@Roles()`.

## Motor de Evaluación Adaptativo

El núcleo del sistema son dos funciones puras en `src/core/evaluation-engine/`:

### `engine.js` — Evaluación de Decisiones

Actualiza el perfil cognitivo aplicando:
1. **Promedio móvil ponderado** — Combina el historial del usuario con el impacto de la nueva decisión
2. **Penalización contextual** — Si el riesgo asumido por el usuario se desvía del riesgo esperado del escenario, se penaliza su perfil de riesgo
3. **Clamping** — Los valores se mantienen en el rango [0, 1]

### `adaptive-rules.js` — Selección de Escenarios

Evalúa reglas del tipo `{ "profile.coherence": { "<": 0.4 } }` contra el perfil del usuario y selecciona la etiqueta del siguiente escenario según la regla de mayor prioridad que se cumpla.

## Testing

```bash
# Tests unitarios del motor de evaluación y reglas adaptativas
npm run test

# Tests end-to-end de API
npm run test:e2e
```

Los tests unitarios cubren las funciones puras del motor (evaluación de decisiones, selección adaptativa) con casos borde como clamping y penalización contextual. Los tests E2E verifican que los endpoints protegidos rechacen peticiones sin autenticación.
