# EduReminder

**EduReminder** es una aplicación web moderna diseñada para ayudar a estudiantes y profesionales a gestionar sus recordatorios académicos y tareas de manera eficiente. La aplicación permite crear, organizar, filtrar y gestionar recordatorios con una interfaz intuitiva y responsive.

## 🚀 Características

- ✅ Crear y gestionar recordatorios personalizados
- 📅 Organización por fechas y prioridades
- 🔍 Sistema de filtros avanzado
- 📊 Estadísticas rápidas de tareas
- 💾 Almacenamiento local persistente
- 📱 Diseño responsive para móviles y escritorio
- 🎨 Interfaz moderna con Tailwind CSS

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Un navegador web moderno

## 🛠️ Instalación y Configuración

Sigue estos pasos para configurar el proyecto en tu ambiente local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/moises-qs/sistema-recordatorio.git
cd sistema-recordatorio/edureminder
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

### 4. Abrir en el navegador

Una vez que el servidor de desarrollo esté ejecutándose, abre tu navegador y ve a:

```
http://localhost:5173
```

## 📦 Comandos Disponibles

- **`npm run dev`** - Inicia el servidor de desarrollo
- **`npm run build`** - Construye la aplicación para producción
- **`npm run preview`** - Previsualiza la build de producción
- **`npm run lint`** - Ejecuta el linter para revisar el código

## 🏗️ Stack Tecnológico

El proyecto está construido utilizando las siguientes tecnologías:

### Frontend
- **[Vue.js 3](https://vuejs.org/)** - Framework progresivo de JavaScript
- **[Vite](https://vitejs.dev/)** - Herramienta de build ultrarrápida
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[PostCSS](https://postcss.org/)** - Procesador de CSS

### Herramientas de Desarrollo
- **[Vue SFC (Single File Components)](https://vuejs.org/guide/scaling-up/sfc.html)** - Componentes de archivo único
- **[Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)** - API de composición de Vue 3
- **[ES6+ JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - JavaScript moderno

### Funcionalidades
- **LocalStorage API** - Persistencia de datos local
- **Responsive Design** - Diseño adaptable
- **Modular Architecture** - Arquitectura modular con composables

## 👥 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

---

## Gitflow - Flujo de Trabajo del Equipo

Este proyecto utiliza **Gitflow** como estrategia de ramificación. A continuación se detalla el flujo de trabajo específico para nuestro equipo de desarrollo.

### Estructura de Ramas

- **`main`** - Código de producción estable
- **`develop`** - Rama de integración para nuevas funcionalidades
- **`feature/`** - Ramas para desarrollo de nuevas funcionalidades
- **`hotfix/`** - Ramas para corrección de errores críticos en producción
- **`release/`** - Ramas para preparar nuevas versiones

### Convenciones de Commits

Utiliza los siguientes prefijos para tus commits:

- **`feat:`** - Nueva funcionalidad
- **`fix:`** - Corrección de errores
- **`docs:`** - Cambios en documentación
- **`refactor:`** - Refactorización de código
- **`test:`** - Adición o modificación de tests
- **`chore:`** - Tareas de mantenimiento

**Ejemplos:**
```bash
feat: implementa filtrado por categorías
fix: corrige error en validación de fechas
docs: actualiza guía de instalación
```

### Flujo de Trabajo Paso a Paso

#### 1. Configuración Inicial (Solo la primera vez)

```bash
# Clonar el repositorio
git clone https://github.com/moises-qs/sistema-recordatorio.git
cd sistema-recordatorio/edureminder

# Instalar dependencias
npm install

# Verificar que estás en main
git branch

# Crear y cambiar a la rama develop (si no existe)
git checkout -b develop
git push -u origin develop
```

#### 2. Creación de Rama para Ticket Asignado

Cada desarrollador debe crear su rama según el ticket asignado:

**Ejemplos de tickets del equipo:**

- **Jorge**: Remover botón de crear reminders
- **Nils**: Cambiar el logo del proyecto  
- **Luis**: Implementar el mantenimiento de categorías de reminders
- **Anco**: Hay un error al filtrar por fechas
- **Moises**: Documentar guía para trabajar con Gitflow en el README

```bash
# Asegurarse de estar en develop y actualizado
git checkout develop
git pull origin develop

# Crear rama según el tipo de ticket
# Para Jorge (feature):
git checkout -b feature/remover-boton-crear-reminders

# Para Nils (feature):
git checkout -b feature/cambiar-logo-proyecto

# Para Luis (feature):
git checkout -b feature/mantenimiento-categorias

# Para Anco (bugfix):
git checkout -b fix/error-filtro-fechas

# Para Moises (docs):
git checkout -b docs/guia-gitflow-readme
```

#### 3. Desarrollo y Commits

```bash
# Realizar cambios en el código
# Agregar archivos modificados
git add .

# Hacer commit con convención establecida según tu ticket:

# Para Jorge (remover botón):
git commit -m "feat: remueve botón de crear reminders de la interfaz"

# Para Nils (cambiar logo):
git commit -m "feat: actualiza logo del proyecto con nuevo diseño"

# Para Luis (mantenimiento categorías):
git commit -m "feat: implementa CRUD para mantenimiento de categorías"

# Para Anco (error filtro fechas):
git commit -m "fix: corrige error al filtrar recordatorios por fechas"

# Para Moises (documentación):
git commit -m "docs: agrega guía completa de Gitflow al README"

# Subir cambios a tu rama
git push origin nombre-de-tu-rama
```

#### 4. Crear Pull Request

Una vez completado el desarrollo:

1. **Subir todos los commits finales**
```bash
git push origin nombre-de-tu-rama
```

2. **Ir a GitHub y crear Pull Request**
   - Base: `develop` ← Compare: `tu-rama`
   - **Títulos descriptivos según el ticket:**
     - **Jorge**: `feat: Remueve botón de crear reminders de la interfaz principal`
     - **Nils**: `feat: Actualiza logo del proyecto con nuevo diseño`
     - **Luis**: `feat: Implementa CRUD para mantenimiento de categorías`
     - **Anco**: `fix: Corrige error al filtrar recordatorios por fechas`
     - **Moises**: `docs: Agrega guía completa de Gitflow al README`
   
   - **Plantilla de descripción (básica):**
   ```markdown
   ## ¿Qué cambios hice?
   [Explica brevemente qué modificaste o agregaste]

   ## ¿Funciona correctamente?
   - [ ] Sí, probé la funcionalidad en mi computadora
   - [ ] No hay errores en la consola del navegador

   ## Notas para el revisor
   [Si hay algo especial que el revisor deba saber o revisar]
   ```

   - Asignar a **Moises** como revisor

3. **Esperar revisión y aprobación**


#### 5. Cuando el Pull Request es Rechazado

**Pasos para el desarrollador:**

```bash
# Hacer los cambios solicitados en tu rama
git add .
git commit -m "fix: corrige observaciones del code review"

# Subir los cambios
git push origin nombre-de-tu-rama

# El Pull Request se actualiza automáticamente
# Comentar en GitHub que los cambios están listos
```

#### 6. Resolución de Conflictos

**Si hay conflictos al hacer merge:**

```bash
# Actualizar tu rama con los últimos cambios de develop
git checkout tu-rama
git pull origin develop

# Resolver conflictos manualmente en los archivos
# Después de resolver:
git add .
git commit -m "fix: resuelve conflictos con develop"
git push origin tu-rama
```

#### 7. Hotfixes (Errores Críticos en Producción)

```bash
# Crear hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/descripcion-error

# Hacer el fix
git add .
git commit -m "fix: corrige error crítico en producción"

# Subir y crear PR hacia main Y develop
git push origin hotfix/descripcion-error
```

#### 8. Releases (Preparar Nueva Versión)

```bash
# Crear rama release desde develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Hacer ajustes finales, actualizar versiones
git add .
git commit -m "chore: prepara release v1.2.0"

# Hacer PR hacia main y develop
git push origin release/v1.2.0
```

### Checklist para Desarrolladores

Antes de crear un Pull Request, verifica:

- [ ] Tu código está en la rama correcta (`feature/`, `fix/`, etc.)
- [ ] Los commits siguen la convención establecida
- [ ] El código funciona correctamente en local
- [ ] No hay conflictos con `develop`
- [ ] La descripción del PR es clara y detallada
- [ ] Has probado tu funcionalidad

### Reglas Importantes

1. **NUNCA** hacer push directo a `main` o `develop`
2. **SIEMPRE** crear Pull Request para cualquier cambio
4. Mantener las ramas actualizadas con `develop`
5. Borrar ramas feature después del merge exitoso