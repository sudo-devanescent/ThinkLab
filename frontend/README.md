# 🧠 ThinkLab - Plataforma Web Adaptativa para el Pensamiento Crítico

ThinkLab es un frontend moderno e interactivo desarrollado en Angular para el fortalecimiento del pensamiento crítico en estudiantes de educación secundaria. La aplicación expone a los alumnos a diferentes dilemas y decisiones ético-cognitivas y mide su desempeño en tres dimensiones clave: **Coherencia**, **Tolerancia al Riesgo**, y **Consistencia**.

---

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js**: v24.16.0 o superior
- **npm**: v11.13.0 o superior

### Instalación de Dependencias
Para descargar e instalar todas las dependencias necesarias, ejecuta:
```bash
npm install
```

### Servidor de Desarrollo
Para iniciar el servidor de desarrollo local, ejecuta:
```bash
npm start
# o alternativamente: ng serve
```
Una vez que el servidor esté en ejecución, abre tu navegador en [http://localhost:4200/](http://localhost:4200/). La aplicación se recargará automáticamente al modificar los archivos de origen.

---

## 👥 Cuentas de Demostración (Mock Credentials)

Para ingresar y probar los flujos específicos por rol, utiliza las siguientes credenciales:

| Rol | Correo Electrónico | Contraseña | Nombre de Usuario |
| :--- | :--- | :--- | :--- |
| **Estudiante** | `j.vidaurre@thinklab.edu.pe` | `ThinkLab2026!` | Javier Vidaurre |
| **Docente** | `j.pacheco@thinklab.edu.pe` | `ThinkLab2026!` | José Pacheco |
| **Administrador** | `admin@thinklab.edu.pe` | `ThinkLab2026!` | Administrador General |

---

## 🛠️ Stack Tecnológico

- **Framework**: Angular v22.0.2 (Standalone Components)
- **Lenguaje**: TypeScript (Strict Mode)
- **UI & Diseño**: Angular Material v22.0.2
- **Gráficas**: Chart.js v4.5.1 + ng2-charts v10.0.0
- **Estilos**: Dart Sass con arquitectura moderna `@use` y `color.adjust()`
- **Gestión de Estado & Reactividad**: RxJS v7.8.0

---

## 🔧 Compilación y Construcción

Para compilar el proyecto en modo producción y generar los archivos listos para despliegue:
```bash
npm run build
# o: ng build
```
Los archivos optimizados se guardarán en la carpeta `dist/thinklab`.

> [!NOTE]
> Las pruebas unitarias (`ng test`) no están configuradas actualmente en `angular.json` ya que el proyecto utiliza un entorno simplificado de prototipado.

---

## ✨ Mejoras y Optimizaciones Recientes

1. **Migración Completa de Dart Sass**:
   - Reemplazo de las reglas `@import` obsoletas por `@use` nativo para resolver advertencias de compilación y evitar fugas de selectores.
   - Sustitución de la función obsoleta `lighten()` por `color.adjust()` de la biblioteca `sass:color`.
2. **Corrección de Estado Cognitivo**:
   - Solucionado el bug en el visor de escenarios donde `previousProfile` se leía tarde (después de que el estado general ya se hubiera actualizado). Ahora las consecuencias narrativas muestran correctamente el cambio entre el perfil cognitivo anterior y el nuevo.
