import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { CategoryRepository } from '../../src/repositories/CategoryRepository.js'
import { Category } from '../../src/models/Category.js'

describe('CategoryRepository - Tests de Integración', () => {
  let repository

  beforeEach(() => {
    // Limpiar localStorage y crear nueva instancia
    localStorage.clear()
    repository = new CategoryRepository()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Operaciones básicas con validación', () => {
    it('debe crear categorías con validación de nombres únicos', () => {
      const categoria1 = repository.createWithValidation({
        name: 'Estudios',
        icon: '📚',
        color: '#3498db'
      })

      expect(categoria1.name).toBe('Estudios')

      // Intentar crear otra con el mismo nombre debe fallar
      expect(() => {
        repository.createWithValidation({
          name: 'Estudios',
          icon: '📖',
          color: '#2ecc71'
        })
      }).toThrow('Ya existe una categoría con el nombre: Estudios')
    })

    it('debe actualizar categorías con validaciones', () => {
      const categoria = repository.createWithValidation({
        name: 'Original',
        color: '#e74c3c'
      })

      const actualizada = repository.updateWithValidation(categoria.id, {
        name: 'Actualizada',
        description: 'Nueva descripción'
      })

      expect(actualizada.name).toBe('Actualizada')
      expect(actualizada.description).toBe('Nueva descripción')
    })

    it('debe fallar al actualizar con nombre duplicado', () => {
      repository.createWithValidation({ name: 'Cat1' })
      const cat2 = repository.createWithValidation({ name: 'Cat2' })

      expect(() => {
        repository.updateWithValidation(cat2.id, { name: 'Cat1' })
      }).toThrow('Ya existe una categoría con el nombre: Cat1')
    })
  })

  describe('Búsquedas avanzadas', () => {
    beforeEach(() => {
      // Crear categorías de prueba
      const categorias = [
        { name: 'Estudios Universitarios', description: 'Tareas académicas' },
        { name: 'Trabajo Remoto', description: 'Actividades laborales' },
        { name: 'Salud Personal', description: 'Citas médicas y ejercicio' },
        { name: 'Estudio de Idiomas', description: 'Aprender inglés y francés' }
      ]

      categorias.forEach(data => repository.createWithValidation(data))
    })

    it('debe buscar por nombre exacto (case insensitive)', () => {
      const encontrada = repository.findByName('estudios universitarios')
      expect(encontrada).not.toBeNull()
      expect(encontrada.name).toBe('Estudios Universitarios')
    })

    it('debe hacer búsqueda difusa por nombre y descripción', () => {
      const resultados = repository.searchByName('estudio')
      expect(resultados).toHaveLength(2) // "Estudios Universitarios" y "Estudio de Idiomas"

      const nombres = resultados.map(r => r.name)
      expect(nombres).toContain('Estudios Universitarios')
      expect(nombres).toContain('Estudio de Idiomas')
    })

    it('debe buscar en descripciones', () => {
      const resultados = repository.searchByName('médicas')
      expect(resultados).toHaveLength(1)
      expect(resultados[0].name).toBe('Salud Personal')
    })
  })

  describe('Integración con recordatorios', () => {
    beforeEach(() => {
      // Crear categorías
      repository.createWithValidation({ name: 'Estudios' })
      repository.createWithValidation({ name: 'Trabajo' })
      repository.createWithValidation({ name: 'Sin Uso' })

      // Simular recordatorios en localStorage
      const recordatorios = [
        { id: '1', title: 'Tarea 1', category: 'Estudios' },
        { id: '2', title: 'Tarea 2', category: 'Estudios' },
        { id: '3', title: 'Reunión', category: 'Trabajo' }
      ]
      localStorage.setItem('app_reminders', JSON.stringify(recordatorios))
    })

    it('debe identificar categorías usadas y no usadas', () => {
      const usadas = repository.findUsedCategories()
      const noUsadas = repository.findUnusedCategories()

      expect(usadas).toHaveLength(2)
      expect(noUsadas).toHaveLength(1)

      const nombresUsadas = usadas.map(c => c.name)
      expect(nombresUsadas).toContain('Estudios')
      expect(nombresUsadas).toContain('Trabajo')

      expect(noUsadas[0].name).toBe('Sin Uso')
    })

    it('debe prevenir eliminación de categorías en uso', () => {
      const estudios = repository.findByName('Estudios')

      expect(() => {
        repository.safeDelete(estudios.id)
      }).toThrow("No se puede eliminar la categoría 'Estudios' porque está en uso")
    })

    it('debe permitir eliminación de categorías no usadas', () => {
      const sinUso = repository.findByName('Sin Uso')
      const eliminada = repository.safeDelete(sinUso.id)

      expect(eliminada).toBe(true)

      const verificacion = Category.find(sinUso.id)
      expect(verificacion).toBeNull()
    })

    it('debe forzar eliminación y actualizar recordatorios', () => {
      const estudios = repository.findByName('Estudios')

      // Forzar eliminación reemplazando con "General"
      const eliminada = repository.forceDelete(estudios.id, 'General')
      expect(eliminada).toBe(true)

      // Verificar que los recordatorios se actualizaron
      const recordatorios = JSON.parse(localStorage.getItem('app_reminders') || '[]')
      const recordatoriosEstudios = recordatorios.filter(r => r.category === 'Estudios')
      const recordatoriosGeneral = recordatorios.filter(r => r.category === 'General')

      expect(recordatoriosEstudios).toHaveLength(0)
      expect(recordatoriosGeneral).toHaveLength(2) // Los 2 que eran de "Estudios"
    })

    it('debe obtener estadísticas correctas', () => {
      const stats = repository.getStats()

      expect(stats.total).toBe(3)
      expect(stats.used).toBe(2)
      expect(stats.unused).toBe(1)

      const estudiosStats = stats.usageByCategory.find(s => s.name === 'Estudios')
      expect(estudiosStats.count).toBe(2)
      expect(estudiosStats.percentage).toBe(67) // 2 de 3 recordatorios = 67%

      const trabajoStats = stats.usageByCategory.find(s => s.name === 'Trabajo')
      expect(trabajoStats.count).toBe(1)
      expect(trabajoStats.percentage).toBe(33) // 1 de 3 recordatorios = 33%
    })

    it('debe ordenar categorías por uso', () => {
      const porUsoDesc = repository.getByUsage(false) // Descendente
      const porUsoAsc = repository.getByUsage(true)   // Ascendente

      expect(porUsoDesc[0].name).toBe('Estudios') // Más usada (2 recordatorios)
      expect(porUsoDesc[1].name).toBe('Trabajo')  // Mediana (1 recordatorio)
      expect(porUsoDesc[2].name).toBe('Sin Uso')  // Menos usada (0 recordatorios)

      expect(porUsoAsc[0].name).toBe('Sin Uso')
      expect(porUsoAsc[2].name).toBe('Estudios')
    })
  })

  describe('Operaciones masivas', () => {
    it('debe crear múltiples categorías exitosamente', () => {
      const datos = [
        { name: 'Cat1', color: '#e74c3c' },
        { name: 'Cat2', color: '#3498db' },
        { name: 'Cat3', color: '#2ecc71' }
      ]

      const creadas = repository.bulkCreate(datos)

      expect(creadas).toHaveLength(3)
      expect(creadas.map(c => c.name)).toEqual(['Cat1', 'Cat2', 'Cat3'])

      // Verificar que se guardaron en localStorage
      const todasLasCategorias = Category.all()
      expect(todasLasCategorias).toHaveLength(3)
    })

    it('debe fallar creación masiva si hay nombres duplicados', () => {
      const datos = [
        { name: 'Cat1', color: '#e74c3c' },
        { name: 'Cat1', color: '#3498db' }, // Nombre duplicado
        { name: 'Cat3', color: '#2ecc71' }
      ]

      expect(() => {
        repository.bulkCreate(datos)
      }).toThrow(/Errores en creación masiva/)

      // Verificar que no se creó ninguna
      const categorias = Category.all()
      expect(categorias).toHaveLength(0)
    })
  })

  describe('Manejo de errores y casos edge', () => {
    it('debe manejar búsquedas con parámetros inválidos', () => {
      expect(repository.findByName(null)).toBeNull()
      expect(repository.findByName('')).toBeNull()
      expect(repository.searchByName(null)).toEqual([])
      expect(repository.searchByName('')).toEqual([])
    })

    it('debe manejar operaciones con IDs inexistentes', () => {
      const resultado = repository.updateWithValidation('id-inexistente', { name: 'Nuevo' })
      expect(resultado).toBeNull()

      const eliminado = repository.safeDelete('id-inexistente')
      expect(eliminado).toBe(false)
    })

    it('debe manejar localStorage corrupto', () => {
      // Corromper datos de recordatorios
      localStorage.setItem('app_reminders', 'datos-corruptos')

      const categoria = repository.createWithValidation({ name: 'Test' })

      // Las operaciones deben seguir funcionando
      expect(categoria.getRemindersCount()).toBe(0)
      expect(categoria.isUsed()).toBe(false)

      const stats = repository.getStats()
      expect(stats.total).toBe(1)
      expect(stats.used).toBe(0)
    })
  })
})