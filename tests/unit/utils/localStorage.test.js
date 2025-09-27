/**
 * Pruebas unitarias para src/utils/localStorage.js
 * Valida las operaciones CRUD para recordatorios en localStorage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storage } from '../../../src/utils/localStorage.js'
import { createTestReminder, createTestReminders, isValidReminderStructure } from '../../helpers/testHelpers.js'

describe('localStorage.js - Storage Operations', () => {

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
  })

  describe('getReminders()', () => {
    it('debe retornar array vacío cuando no hay datos en localStorage', () => {
      const result = storage.getReminders()

      expect(result).toEqual([])
      expect(Array.isArray(result)).toBe(true)
    })

    it('debe retornar los recordatorios almacenados correctamente', () => {
      const testReminders = createTestReminders(2)
      localStorage.setItem('edureminder_data', JSON.stringify(testReminders))

      const result = storage.getReminders()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(testReminders[0])
      expect(result[1]).toEqual(testReminders[1])
    })

    it('debe manejar JSON inválido y retornar array vacío', () => {
      localStorage.setItem('edureminder_data', 'invalid json data')

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = storage.getReminders()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('debe manejar datos null en localStorage', () => {
      localStorage.setItem('edureminder_data', 'null')

      const result = storage.getReminders()

      expect(result).toEqual([])
    })
  })

  describe('saveReminders()', () => {
    it('debe guardar recordatorios correctamente', () => {
      const testReminders = createTestReminders(3)

      const result = storage.saveReminders(testReminders)

      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()

      // Verificar que se guardó en localStorage
      const savedData = JSON.parse(localStorage.getItem('edureminder_data'))
      expect(savedData).toHaveLength(3)
      expect(savedData[0]).toEqual(testReminders[0])
    })

    it('debe retornar error cuando el input no es un array', () => {
      const result = storage.saveReminders('not an array')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Los datos deben ser un array de recordatorios')
      expect(result.errorType).toBe('INVALID_INPUT')
    })

    it('debe retornar error cuando el input es null', () => {
      const result = storage.saveReminders(null)

      expect(result.success).toBe(false)
      expect(result.errorType).toBe('INVALID_INPUT')
    })

    it('debe retornar error cuando el input es undefined', () => {
      const result = storage.saveReminders(undefined)

      expect(result.success).toBe(false)
      expect(result.errorType).toBe('INVALID_INPUT')
    })

    it('debe manejar array vacío correctamente', () => {
      const result = storage.saveReminders([])

      expect(result.success).toBe(true)

      const savedData = JSON.parse(localStorage.getItem('edureminder_data'))
      expect(savedData).toEqual([])
    })

    it('debe detectar datos demasiado grandes (simulando límite)', () => {
      // Crear un objeto grande para simular exceso de tamaño
      const hugeReminder = createTestReminder({
        description: 'x'.repeat(5000000) // Descripción de 5MB
      })

      const result = storage.saveReminders([hugeReminder])

      expect(result.success).toBe(false)
      expect(result.errorType).toBe('SIZE_EXCEEDED')
      expect(result.error).toContain('exceden el límite')
    })

    it('debe manejar objetos con referencias circulares', () => {
      const circularObj = { name: 'test' }
      circularObj.self = circularObj // Referencia circular

      const result = storage.saveReminders([circularObj])

      expect(result.success).toBe(false)
      expect(result.errorType).toBe('JSON_ERROR')
    })
  })

  describe('Integración getReminders() + saveReminders()', () => {
    it('debe mantener la integridad de los datos en el ciclo completo', () => {
      const originalReminders = createTestReminders(5)

      // Guardar
      const saveResult = storage.saveReminders(originalReminders)
      expect(saveResult.success).toBe(true)

      // Recuperar
      const retrievedReminders = storage.getReminders()

      expect(retrievedReminders).toHaveLength(5)
      expect(retrievedReminders).toEqual(originalReminders)

      // Verificar estructura de cada recordatorio
      retrievedReminders.forEach(reminder => {
        expect(isValidReminderStructure(reminder)).toBe(true)
      })
    })

    it('debe preservar tipos de datos en recordatorios', () => {
      const testReminder = createTestReminder({
        completed: false,
        priority: 'high',
        dueDate: '2024-12-31T23:59:59.000Z',
        tags: ['important', 'work']
      })

      storage.saveReminders([testReminder])
      const retrieved = storage.getReminders()[0]

      expect(typeof retrieved.completed).toBe('boolean')
      expect(typeof retrieved.priority).toBe('string')
      expect(typeof retrieved.dueDate).toBe('string')
      expect(Array.isArray(retrieved.tags)).toBe(true)
    })

    it('debe manejar múltiples operaciones consecutivas', () => {
      // Primera operación
      const batch1 = createTestReminders(2, { category: 'trabajo' })
      storage.saveReminders(batch1)

      // Segunda operación
      const batch2 = createTestReminders(3, { category: 'personal' })
      storage.saveReminders(batch2)

      // Verificar que la segunda operación sobrescribió la primera
      const final = storage.getReminders()
      expect(final).toHaveLength(3)
      expect(final.every(r => r.category === 'personal')).toBe(true)
    })
  })

  describe('Casos edge y manejo de errores', () => {
    it('debe manejar localStorage deshabilitado', () => {
      // Simular localStorage no disponible
      const originalLocalStorage = global.localStorage
      global.localStorage = undefined

      const result = storage.saveReminders([createTestReminder()])

      expect(result.success).toBe(false)
      expect(result.errorType).toBe('NOT_SUPPORTED')

      // Restaurar localStorage
      global.localStorage = originalLocalStorage
    })

    it('debe manejar QuotaExceededError', () => {
      // Mock de localStorage que lanza QuotaExceededError
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        const error = new Error('Quota exceeded')
        error.name = 'QuotaExceededError'
        throw error
      })

      const result = storage.saveReminders([createTestReminder()])

      expect(result.success).toBe(false)
      expect(result.errorType).toBe('QUOTA_EXCEEDED')
      expect(result.error).toContain('Espacio de almacenamiento insuficiente')

      // Restaurar
      localStorage.setItem = originalSetItem
    })

    it('debe manejar SecurityError', () => {
      // Mock de localStorage que lanza SecurityError
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        const error = new Error('Security error')
        error.name = 'SecurityError'
        throw error
      })

      const result = storage.saveReminders([createTestReminder()])

      expect(result.success).toBe(false)
      expect(result.errorType).toBe('ACCESS_DENIED')
      expect(result.error).toContain('Acceso denegado')

      // Restaurar
      localStorage.setItem = originalSetItem
    })

    it('debe validar la integridad después de guardar', () => {
      // Test más simple - verificar que funciona la verificación normal
      const testData = [createTestReminder()]

      const result = storage.saveReminders(testData)

      // Debe guardar correctamente en condiciones normales
      expect(result.success).toBe(true)

      // Verificar que los datos están realmente guardados
      const savedData = storage.getReminders()
      expect(savedData).toEqual(testData)
    })
  })
})