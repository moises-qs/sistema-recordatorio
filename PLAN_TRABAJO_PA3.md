# Plan de Trabajo - PA3: Aplicación de Conceptos Avanzados

## Resumen del Proyecto
**EduReminder** - Sistema de recordatorios educativos desarrollado en Vue.js 3

---

## 1. Diseño de Pruebas Unitarias

### ¿Qué son las Pruebas Unitarias?
Las pruebas unitarias son pruebas automatizadas que verifican el funcionamiento correcto de unidades individuales de código (funciones, métodos, clases) de forma aislada. Su objetivo es garantizar que cada componente funcione según las especificaciones.

### ¿Para qué sirven?
- **Detección temprana de errores**: Identifican bugs antes de que lleguen a producción
- **Documentación viva**: Actúan como documentación ejecutable del comportamiento esperado
- **Facilitan refactoring**: Permiten modificar código con confianza
- **Mejoran la calidad**: Fuerzan a escribir código más modular y testeable

### ¿Cómo se hacen?
1. Se escribe una función de prueba que llama al código a testear
2. Se proporcionan datos de entrada conocidos
3. Se verifica que la salida coincida con el resultado esperado
4. Se usan frameworks de testing como Jest, Vitest, Mocha, etc.

### Implementación en EduReminder

#### Archivo objetivo:
**`src/utils/localStorage.js`** - Operaciones CRUD para recordatorios

#### Funciones a testear:
- `getReminders()` - Recuperar recordatorios del localStorage
- `saveReminders()` - Guardar array de recordatorios
- `addReminder()` - Agregar un nuevo recordatorio
- `updateReminder()` - Actualizar recordatorio existente
- `deleteReminder()` - Eliminar recordatorio por ID

#### Estructura de archivos:
```
tests/
├── unit/
│   └── utils/
│       └── localStorage.test.js
└── setup/
    └── testSetup.js
```

#### Herramientas:
- **Vitest** - Framework de testing para proyectos Vite
- **jsdom** - Simular entorno DOM para localStorage

#### Paso a paso:
1. **Instalar dependencias**: `npm install -D vitest jsdom`
2. **Configurar Vitest**: Crear `vitest.config.js`
3. **Crear setup de pruebas**: Mock de localStorage
4. **Escribir tests**: Para cada función CRUD
5. **Ejecutar pruebas**: `npm run test`

---

## 2. Aplicación de TDD (Test-Driven Development)

### ¿Qué es TDD?
TDD es una metodología de desarrollo donde se escriben las pruebas ANTES que el código de producción. Sigue el ciclo "Red-Green-Refactor".

### ¿Para qué sirve?
- **Diseño guiado por pruebas**: Las pruebas definen la API y comportamiento
- **Mayor cobertura**: Garantiza que todo el código está probado
- **Menos bugs**: Al escribir pruebas primero, se piensa en casos edge
- **Mejor diseño**: Fuerza a escribir código más modular y desacoplado

### ¿Cómo se hace?
1. **RED**: Escribir una prueba que falle (no existe el código aún)
2. **GREEN**: Escribir el mínimo código necesario para que pase la prueba
3. **REFACTOR**: Mejorar el código manteniendo las pruebas verdes
4. Repetir el ciclo para cada nueva funcionalidad

### Implementación en EduReminder

#### Nueva funcionalidad: Sistema de Prioridades

#### ¿Qué implementaremos?
Un sistema que asigne automáticamente prioridades a los recordatorios basado en:
- Proximidad de la fecha límite
- Categoría del recordatorio
- Palabras clave en el título (urgente, importante, etc.)

#### Estructura de archivos:
```
src/
├── utils/
│   └── priorityManager.js
tests/
├── unit/
│   └── utils/
│       └── priorityManager.test.js
```

#### Paso a paso TDD:
1. **Escribir primer test** (RED): Test para calcular prioridad básica
2. **Implementar función mínima** (GREEN): Retornar prioridad hardcodeada
3. **Refactorizar** (REFACTOR): Mejorar implementación
4. **Segundo test** (RED): Test para prioridad por fecha
5. **Implementar lógica de fecha** (GREEN): Agregar cálculo de fecha
6. **Refactorizar** (REFACTOR): Optimizar código
7. **Repetir** para categorías y palabras clave

#### API a implementar:
```javascript
// src/utils/priorityManager.js
export class PriorityManager {
  calculatePriority(reminder) // Retorna: 'low', 'medium', 'high', 'urgent'
  getPriorityScore(reminder)   // Retorna: número 1-10
  updatePriorities(reminders)  // Actualiza array completo
}
```

---

## 3. Resolución de Problemas con Katas TDD

### ¿Qué son las Katas TDD?
Las katas son ejercicios de programación que se resuelven repetidamente para practicar técnicas de desarrollo. En TDD, se usan para dominar el ciclo Red-Green-Refactor.

### ¿Para qué sirven?
- **Práctica deliberada**: Mejoran habilidades de programación
- **Muscle memory**: Automatizan el proceso de TDD
- **Exploración de soluciones**: Permiten probar diferentes enfoques
- **Mejora continua**: Cada iteración refina la solución

### ¿Cómo se hacen?
1. **Elegir un problema específico**: Algoritmo o funcionalidad concreta
2. **Aplicar TDD estricto**: Escribir tests primero, código después
3. **Iterar múltiples veces**: Cada vez mejorando la implementación
4. **Reflexionar**: Analizar qué se aprendió en cada iteración

### Implementación en EduReminder

#### Kata: Algoritmo de Ordenamiento de Recordatorios

#### Problema a resolver:
Crear una función que ordene recordatorios por múltiples criterios:
- Por fecha (más próximo primero)
- Por prioridad (más urgente primero)
- Por estado (pendientes antes que completados)
- Por categoría (alfabéticamente)

#### Estructura de archivos:
```
src/
├── utils/
│   └── reminderSorter.js
tests/
├── unit/
│   └── utils/
│       └── reminderSorter.test.js
└── katas/
    ├── iteration1/
    │   └── reminderSorter.v1.js
    ├── iteration2/
    │   └── reminderSorter.v2.js
    └── iteration3/
        └── reminderSorter.v3.js
```

#### Iteraciones planeadas:

**Iteración 1 - Implementación básica:**
- Ordenamiento simple por fecha
- Tests básicos
- Algoritmo straightforward

**Iteración 2 - Múltiples criterios:**
- Agregar prioridad y estado
- Tests más complejos
- Mejorar algoritmo

**Iteración 3 - Optimización:**
- Performance mejorada
- Casos edge cubiertos
- API más flexible

#### API a implementar:
```javascript
// src/utils/reminderSorter.js
export class ReminderSorter {
  sortBy(reminders, criteria)           // criteria: ['date', 'priority', 'status']
  sortByDate(reminders, ascending)      // Ordenar solo por fecha
  sortByPriority(reminders)            // Ordenar solo por prioridad
  customSort(reminders, compareFn)     // Función de comparación personalizada
}
```

---

## 4. Uso de ORM (Object-Relational Mapping)

### ¿Qué es un ORM?
Un ORM es una técnica que permite mapear datos entre sistemas incompatibles usando lenguajes de programación orientados a objetos. Abstrae las operaciones de base de datos en métodos de objetos.

### ¿Para qué sirve?
- **Abstracción**: Oculta la complejidad de las consultas SQL
- **Productividad**: Acelera el desarrollo con APIs intuitivas
- **Mantenibilidad**: Centraliza la lógica de datos
- **Seguridad**: Previene inyecciones SQL automáticamente
- **Portabilidad**: Facilita cambio entre diferentes bases de datos

### ¿Cómo se hace?
1. **Definir modelos**: Clases que representan entidades de datos
2. **Mapear relaciones**: Definir cómo se relacionan las entidades
3. **Crear repositorios**: Abstraer operaciones CRUD
4. **Usar consultas OOP**: Reemplazar SQL con métodos de objetos

### Implementación en EduReminder

#### Modelo a crear: Category

#### ¿Por qué solo Category?
Las categorías son entidades independientes con su propia lógica de negocio, mientras que los recordatorios ya tienen una implementación funcional que mantendremos.

#### Estructura de archivos:
```
src/
├── models/
│   ├── Category.js
│   └── BaseModel.js
├── orm/
│   ├── SimpleORM.js
│   └── Repository.js
└── repositories/
    └── CategoryRepository.js
```

#### Implementación paso a paso:

**1. BaseModel.js** - Clase base para todos los modelos:
```javascript
export class BaseModel {
  constructor(data = {}) {}
  save() {}
  delete() {}
  toJSON() {}
  static find(id) {}
  static all() {}
  static where(conditions) {}
}
```

**2. Category.js** - Modelo específico para categorías:
```javascript
export class Category extends BaseModel {
  constructor(data) {
    // name, icon, color, description
  }

  // Métodos específicos
  getRemindersCount() {}
  isUsed() {}
  validate() {}
}
```

**3. SimpleORM.js** - Motor ORM minimalista:
```javascript
export class SimpleORM {
  constructor(storageKey) {}

  // Operaciones básicas
  find(id) {}
  create(data) {}
  update(id, data) {}
  delete(id) {}
  where(conditions) {}
  all() {}
}
```

**4. CategoryRepository.js** - Repositorio para operaciones complejas:
```javascript
export class CategoryRepository {
  findByName(name) {}
  findUsedCategories() {}
  findUnusedCategories() {}
  createWithValidation(data) {}
  bulkCreate(categories) {}
}
```

#### Migración desde localStorage:
1. **Mantener compatibilidad**: El ORM leerá datos existentes
2. **Gradual adoption**: Migrar uso poco a poco
3. **Fallback**: Si falla ORM, usar localStorage directamente

---

## 5. Integración de Pruebas en el Flujo Ágil

### ¿Qué es la Integración de Pruebas?
Es la práctica de incorporar pruebas automatizadas en cada etapa del proceso de desarrollo, desde commits individuales hasta releases en producción.

### ¿Para qué sirve?
- **Feedback rápido**: Detectar problemas inmediatamente
- **Confianza en deploys**: Saber que el código funciona antes de publicar
- **Documentación actualizada**: Las pruebas reflejan el comportamiento actual
- **Colaboración mejorada**: Todo el equipo ve el estado de las pruebas

### ¿Cómo se hace?
1. **Pruebas locales**: Durante el desarrollo
2. **Pre-commit hooks**: Antes de cada commit
3. **CI/CD pipelines**: En cada push/merge
4. **Diferentes tipos**: Unit, integration, e2e
5. **Reportes**: Cobertura y métricas

### Implementación en EduReminder

#### Configuración completa del entorno:

#### Estructura final de pruebas:
```
tests/
├── unit/
│   ├── utils/
│   │   ├── localStorage.test.js
│   │   ├── priorityManager.test.js
│   │   └── reminderSorter.test.js
│   └── models/
│       └── Category.test.js
├── integration/
│   └── categoryRepository.test.js
├── setup/
│   ├── testSetup.js
│   └── mocks/
│       └── localStorage.mock.js
└── helpers/
    └── testHelpers.js
```

#### Archivos de configuración:

**vitest.config.js**:
```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup/testSetup.js'],
    coverage: {
      reporter: ['text', 'html', 'lcov']
    }
  }
})
```

**package.json** - Scripts agregados:
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

#### Paso a paso de implementación:

1. **Instalar dependencias**:
   ```bash
   npm install -D vitest jsdom @vitest/ui @vitest/coverage-v8
   ```

2. **Configurar Vitest**: Crear `vitest.config.js`

3. **Setup de pruebas**: Configurar mocks y helpers

4. **Escribir pruebas unitarias**: Para cada funcionalidad

5. **Pruebas de integración**: Para flujos completos

6. **Scripts de automatización**: En package.json

7. **Documentar proceso**: Para el equipo

---

## Cronograma Ajustado

### Fase 1: Pruebas Unitarias
- Setup de Vitest
- Tests para localStorage operations
- Documentar cobertura

### Fase 2: TDD - Sistema de Prioridades
- Implementar PriorityManager con TDD estricto
- Tests completos
- Integrar con componentes existentes

### Fase 3: Kata TDD - Algoritmo de Ordenamiento
- Iteración 1: Implementación básica
- Iteración 2: Múltiples criterios
- Iteración 3: Optimización final

### Fase 4: ORM - Modelo Category
- Crear BaseModel y SimpleORM
- Implementar Category model
- Migrar funcionalidad existente

### Fase 5: Integración Final
- Configurar scripts de testing
- Pruebas de integración
- Documentación de proceso

## Archivos que se crearán

### Nuevos archivos principales:
```
proyecto/
├── vitest.config.js
├── tests/                          [NUEVO DIRECTORIO]
├── src/utils/priorityManager.js     [NUEVO]
├── src/utils/reminderSorter.js      [NUEVO]
├── src/models/                      [NUEVO DIRECTORIO]
├── src/orm/                         [NUEVO DIRECTORIO]
└── src/repositories/                [NUEVO DIRECTORIO]
```

### Archivos modificados:
- `package.json` - Agregar scripts y dependencias de testing
- `src/composables/useCategories.js` - Migrar a usar ORM
- Componentes que usen prioridades y ordenamiento

---

## Notas Importantes
- **Enfoque en calidad sobre cantidad**: Mejor pocas funcionalidades bien implementadas
- **Documentación en código**: Cada función debe estar bien documentada
- **Tests como especificación**: Los tests deben ser legibles y explicar el comportamiento
- **Iteración continua**: Cada funcionalidad se refina en múltiples pasadas