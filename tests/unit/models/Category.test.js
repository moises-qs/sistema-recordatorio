import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Category } from '../../../src/models/Category.js'

describe('Category - Modelo de Categorías (ORM)', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
  })

  afterEach(() => {
    // Limpiar localStorage después de cada test
    localStorage.clear()
  })

  describe('Creación y propiedades básicas', () => {
    it('debe crear una categoría con propiedades básicas', () => {
      const categoriaData = {
        name: 'Estudios',
        icon: '📚',
        color: '#3498db',
        description: 'Categoría para tareas académicas'
      }

      const categoria = new Category(categoriaData)

      expect(categoria.name).toBe('Estudios')
      expect(categoria.icon).toBe('📚')
      expect(categoria.color).toBe('#3498db')
      expect(categoria.description).toBe('Categoría para tareas académicas')
      expect(categoria.id).toBeDefined()
      expect(categoria.createdAt).toBeDefined()
      expect(categoria.updatedAt).toBeDefined()
    })

    it('debe asignar valores por defecto cuando no se proporcionan', () => {
      const categoria = new Category({ name: 'Trabajo' })

      expect(categoria.name).toBe('Trabajo')
      expect(categoria.icon).toBe('📁') // Icono por defecto
      expect(categoria.color).toBe('#95a5a6') // Color por defecto
      expect(categoria.description).toBe('')
    })

    it('debe generar ID único automáticamente', () => {
      const categoria1 = new Category({ name: 'Cat1' })
      const categoria2 = new Category({ name: 'Cat2' })

      expect(categoria1.id).toBeDefined()
      expect(categoria2.id).toBeDefined()
      expect(categoria1.id).not.toBe(categoria2.id)
    })
  })

  describe('Validación', () => {
    it('debe validar correctamente una categoría válida', () => {
      const categoria = new Category({
        name: 'Salud',
        icon: '🏥',
        color: '#e74c3c'
      })

      const resultado = categoria.validate()
      expect(resultado.isValid).toBe(true)
      expect(resultado.errors).toEqual([])
    })

    it('debe fallar validación sin nombre', () => {
      const categoria = new Category({
        icon: '📁',
        color: '#3498db'
      })

      const resultado = categoria.validate()
      expect(resultado.isValid).toBe(false)
      expect(resultado.errors).toContain('El nombre es requerido')
    })

    it('debe fallar validación con nombre demasiado corto', () => {
      const categoria = new Category({ name: 'A' })

      const resultado = categoria.validate()
      expect(resultado.isValid).toBe(false)
      expect(resultado.errors).toContain('El nombre debe tener al menos 2 caracteres')
    })

    it('debe fallar validación con color inválido', () => {
      const categoria = new Category({
        name: 'Categoría Test',
        color: 'rojo'
      })

      const resultado = categoria.validate()
      expect(resultado.isValid).toBe(false)
      expect(resultado.errors).toContain('El color debe ser un código hexadecimal válido')
    })
  })

  describe('Operaciones CRUD', () => {
    it('debe guardar una categoría nueva', () => {
      const categoria = new Category({
        name: 'Deportes',
        icon: '⚽',
        color: '#2ecc71'
      })

      const resultado = categoria.save()

      expect(resultado).toBeDefined()
      expect(resultado.id).toBe(categoria.id)
      expect(resultado.name).toBe('Deportes')
    })

    it('debe encontrar una categoría por ID', () => {
      const categoria = new Category({
        name: 'Música',
        icon: '🎵',
        color: '#9b59b6'
      })

      categoria.save()

      const encontrada = Category.find(categoria.id)
      expect(encontrada).not.toBeNull()
      expect(encontrada.name).toBe('Música')
      expect(encontrada.icon).toBe('🎵')
    })

    it('debe obtener todas las categorías', () => {
      const cat1 = new Category({ name: 'Cat1' })
      const cat2 = new Category({ name: 'Cat2' })

      cat1.save()
      cat2.save()

      const todas = Category.all()
      expect(todas).toHaveLength(2)
      expect(todas.map(c => c.name)).toContain('Cat1')
      expect(todas.map(c => c.name)).toContain('Cat2')
    })

    it('debe actualizar una categoría existente', () => {
      const categoria = new Category({ name: 'Original' })
      categoria.save()

      categoria.name = 'Actualizada'
      categoria.description = 'Nueva descripción'
      const actualizada = categoria.save()

      expect(actualizada.name).toBe('Actualizada')
      expect(actualizada.description).toBe('Nueva descripción')

      const verificacion = Category.find(categoria.id)
      expect(verificacion.name).toBe('Actualizada')
    })

    it('debe eliminar una categoría', () => {
      const categoria = new Category({ name: 'A Eliminar' })
      categoria.save()

      const eliminada = categoria.delete()
      expect(eliminada).toBe(true)

      const verificacion = Category.find(categoria.id)
      expect(verificacion).toBeNull()
    })
  })

  describe('Búsquedas y filtros', () => {
    beforeEach(() => {
      // Crear categorías de prueba
      const categorias = [
        { name: 'Estudios', icon: '📚', color: '#3498db' },
        { name: 'Trabajo', icon: '💼', color: '#e67e22' },
        { name: 'Personal', icon: '👤', color: '#2ecc71' }
      ]

      categorias.forEach(data => {
        const cat = new Category(data)
        cat.save()
      })
    })

    it('debe buscar categorías por nombre', () => {
      const resultado = Category.where({ name: 'Estudios' })
      expect(resultado).toHaveLength(1)
      expect(resultado[0].name).toBe('Estudios')
    })

    it('debe buscar por múltiples criterios', () => {
      const resultado = Category.where({
        icon: '💼',
        color: '#e67e22'
      })
      expect(resultado).toHaveLength(1)
      expect(resultado[0].name).toBe('Trabajo')
    })
  })
})