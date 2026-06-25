# Documentación de la Interfaz Angular: ThinkLab

Este archivo detalla la estructura, decisiones de diseño y detalles de la implementación realizada para el frontend de **ThinkLab**, una plataforma web adaptativa para el fortalecimiento del pensamiento crítico en estudiantes de educación secundaria.

---

## 🛠️ Stack Tecnológico y Versiones

La aplicación se construyó siguiendo las especificaciones del cliente y utilizando las versiones más recientes y eficientes de Angular y sus dependencias:

*   **Angular v22.0.2** con una arquitectura 100% basada en **Standalone Components** (sin `NgModules`).
*   **TypeScript** en modo estricto (`strict: true` en `tsconfig.json`).
*   **Angular Material v22.0.2** para el diseño de componentes comunes (Cards, Inputs, Progress Bars, Snackbars, Buttons).
*   **Chart.js v4.4.3** y **ng2-charts v6.0.1** para renderizar la gráfica radar del perfil cognitivo.
*   **RxJS v7.8.1** para el manejo reactivo del estado de la sesión, del usuario y de las actualizaciones del perfil.
*   **Dart Sass** para compilar estilos modulares y responsivos.

---

## 🎨 Paleta Visual y Estilo

Se implementó un diseño de estética moderna y oscura (glowing dark theme) con las siguientes variables de diseño globales en `src/styles/variables.scss`:

*   **Fondo principal:** `#0f1117` (Dark Navy casi negro).
*   **Superficie de cards:** `#1a1d2e` (Azul oscuro profundo).
*   **Acento primario:** `#6c63ff` (Violeta vibrante).
*   **Acento secundario:** `#00d4aa` (Verde-cyan brillante).
*   **Texto principal:** `#e8e8f0` (Blanco grisáceo).
*   **Texto secundario:** `#8b8fa8` (Gris frío).
*   **Estados y Umbrales:**
    *   *Riesgo Alto / Error:* `#ff6b6b` (Rojo suave)
    *   *Riesgo Medio / Advertencia:* `#ffd93d` (Amarillo)
    *   *Riesgo Bajo / Éxito:* `#6bcb77` (Verde pastel)

Se integró la tipografía **'Inter'** de Google Fonts como fuente principal para optimizar la legibilidad en pantallas de texto extenso (65ch máx). Las cards cuentan con bordes sutiles de `1px solid rgba(255,255,255,0.08)`, un border-radius de `12px` y sombras elevadas con `box-shadow` de gran profundidad.

---

## 📂 Arquitectura de Archivos Implementada

La estructura generada sigue exactamente el patrón de módulos funcionales y capas de servicios especificado:

```
src/
├── app/
│   ├── app.component.ts/html/scss     # Layout principal y barra de navegación
│   ├── app.config.ts                  # Proveedores de HttpClient, Animaciones y Rutas
│   ├── app.routes.ts                  # Sistema de rutas con Lazy Loading y Guards
│   ├── core/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts          # Seguridad: valida existencia del JWT
│   │   │   └── role.guard.ts          # Seguridad: comprueba permisos de rol
│   │   ├── interceptors/
│   │   │   └── jwt.interceptor.ts     # Inyector de cabeceras Bearer y manejador de error 401
│   │   ├── models/                    # Modelos e interfaces del contrato de API
│   │   │   ├── user.model.ts
│   │   │   ├── scenario.model.ts
│   │   │   ├── decision.model.ts
│   │   │   ├── cognitive-profile.model.ts
│   │   │   └── adaptation-rule.model.ts
│   │   └── services/                  # Lógica de negocio y llamadas HTTP (Mocks reactivos)
│   │       ├── auth.service.ts
│   │       ├── scenario.service.ts
│   │       ├── decision.service.ts
│   │       ├── profile.service.ts
│   │       └── session-state.service.ts
│   ├── features/                      # Vistas funcionales (Lazy Loaded)
│   │   ├── auth/
│   │   │   └── login/                 # Formulario de inicio de sesión con SnackBar
│   │   ├── student/
│   │   │   ├── dashboard/             # Dashboard estudiantil con estadísticas rápidas
│   │   │   ├── scenario-viewer/       # Visor responsivo de dos columnas con cronómetro
│   │   │   ├── consequence/           # Resultados del escenario con comparativas de tendencia
│   │   │   └── profile/               # Perfil cognitivo del alumno con radar y decisiones
│   │   ├── teacher/
│   │   │   ├── dashboard/             # Tabla de estudiantes con búsqueda reactiva y ordenación
│   │   │   └── student-detail/        # Detalle de alumno con gráfica radar y cards individuales
│   │   └── admin/
│   │       └── dashboard/             # Panel administrativo con KPIs y lista de escenarios
│   └── shared/                        # Componentes y pipes globales reutilizables
│       ├── components/
│       │   ├── cognitive-radar/       # Renderizador de gráfica radar de Chart.js
│       │   ├── progress-bar-labeled/  # Barra con texto y color según umbrales
│       │   └── feedback-badge/        # Alertas de retroalimentación cognitiva
│       └── pipes/
│           └── feedback-label.pipe.ts # Transformador de puntuación numérica a etiqueta cualitativa
├── environments/
│   ├── environment.ts                 # Configuración de desarrollo local
│   └── environment.prod.ts            # Configuración para producción
└── styles/
    ├── variables.scss                 # Variables y paletas de color Sass
    ├── typography.scss                # Importación y configuración de fuentes
    └── global.scss                    # Resets, scrollbars y sobreescrituras globales
```

---

## ⚙️ Implementación de Servicios y Lógica Mock

### 🛡️ Autenticación (`auth.service.ts`)
*   Almacena el JWT en `localStorage` con la clave `thinklab_token`.
*   Extrae el payload base64 del JWT para recuperar el rol, nombre y correo del usuario.
*   **Cuentas Mocks configuradas:**
    1.  `j.vidaurre@thinklab.edu.pe` → Rol `student` (Javier Vidaurre).
    2.  `j.pacheco@thinklab.edu.pe` → Rol `teacher` (José Pacheco).
    3.  `admin@thinklab.edu.pe` → Rol `admin` (Administrador General).
    *Nota: Cualquier inicio de sesión exitoso requiere contraseña (mínimo 6 caracteres) e inyecta un JWT con firma mock correspondientemente estructurado.*

### 🎭 Escenarios (`scenario.service.ts`)
*   Se crearon **10 escenarios completos** con sus opciones A, B, y C, ponderaciones cognitivas implícitas y descripciones detalladas de las consecuencias narrativas.
*   Entrega los escenarios en rotación secuencial basándose en el índice actual del usuario.

### 📝 Decisiones (`decision.service.ts` y `session-state.service.ts`)
*   Calcula el tiempo de respuesta del estudiante usando `performance.now()` en el visor y enviándolo en `responseTimeMs`.
*   Aplica una variación aleatoria controlada (`-0.08` a `+0.08`) a los puntajes cognitivos, manteniéndolos acotados entre `0` y `1`.
*   Genera mensajes de retroalimentación cualitativos y niveles de alerta basados en el promedio de las dimensiones:
    *   `> 0.7` → **Positive** (Verde)
    *   `0.4 - 0.7` → **Neutral** (Amarillo)
    *   `< 0.4` → **Warning** (Naranja/Rojo)
*   Retorna `nextScenarioId` como `null` en el escenario 5, forzando la conclusión del desafío y redirigiendo al estudiante a su perfil.

### 📊 Perfiles y Datos de Grupo (`profile.service.ts`)
*   Mantiene los 5 estudiantes requeridos (Javier, José, Oscar, Eduardo y Rodrigo en estado inactivo) con perfiles cognitivos balanceados que representan los diferentes niveles del sistema de retroalimentación.

---

## 📈 Componentes y Pipes Compartidos

1.  `<app-cognitive-radar>`: Renderiza de manera responsiva el triángulo de dimensiones mediante Chart.js, desactivando las leyendas redundantes y configurando tooltips estilizados en porcentaje.
2.  `<app-progress-bar-labeled>`: Barra de carga con porcentaje. Cuenta con transiciones suaves en CSS y cambia de color según el umbral del valor asignado.
3.  `<app-feedback-badge>`: Módulo gráfico de advertencias o felicitaciones cognitivas. Carga íconos y degradados según el estado del resultado de la decisión.
4.  `feedbackLabel`: Pipe que transforma valores flotantes en etiquetas de nivel (`Bajo`, `Medio`, `Alto`).

---

## 🔒 Rutas y Seguridad

*   `authGuard`: Comprueba la autenticidad del JWT. Si no existe o expiró, redirige inmediatamente a `/login`.
*   `roleGuard`: Valida que el rol codificado en el JWT del cliente coincida con el rol de la sección a la que intenta ingresar (`student`, `teacher` o `admin`). Si hay un intento no autorizado, intercepta y redirige automáticamente al panel principal de su rol de origen.

---

## 🧪 Validación y Calidad del Código
*   Se eliminaron todos los tipos implícitos y explícitos `any` de los componentes y servicios del frontend, garantizando el cumplimiento de las restricciones en TypeScript.
*   Se solucionó el problema de orden de inicialización en `App` mediante el uso de la API funcional `inject()`.
*   Se instaló el paquete `@angular/animations` requerido para la compilación de transiciones de Angular Material en Angular 22.
*   **Migración de Sass (Dart Sass Moderno)**:
    *   Se reemplazaron las directivas `@import` por `@use` nativo para resolver las advertencias del plugin `angular-sass` y preparar la base de código para la futura eliminación de `@import` en Dart Sass 3.0.0.
    *   Se reemplazó la función obsoleta `lighten()` por la función recomendada `color.adjust()` de la biblioteca `sass:color`.
*   **Corrección de Flujo Cognitivo en Visor de Escenarios**:
    *   Se solucionó un bug lógico en `ScenarioViewerComponent` donde el estado `previousProfile` enviado a la pantalla de consecuencias narrativas se leía del estado de sesión *después* de que se hubiese enviado la respuesta y actualizado dicho perfil. Ahora se captura el estado clonado del perfil *antes* de enviar la decisión, permitiendo visualizar correctamente la diferencia y tendencias antes y después de cada elección.
*   **Estado de Pruebas**:
    *   El comando `ng test` heredado no está configurado actualmente en `angular.json` para esta iteración simplificada de prototipo.
*   La aplicación compila correctamente sin errores ni advertencias (`exit code 0`):
    ```bash
    npx ng build
    # Compilación exitosa en /dist/thinklab
    ```

