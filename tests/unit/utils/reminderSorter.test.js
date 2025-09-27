import { describe, it, expect, beforeEach } from 'vitest'
import { ReminderSorter } from '../../../src/utils/reminderSorter.js'

describe('ReminderSorter - Ordenador de Recordatorios', () => {
  let reminderSorter

  beforeEach(() => {
    reminderSorter = new ReminderSorter()
  })

  describe('Iteración 1 - Ordenamiento básico por fecha', () => {
    it('debe ordenar recordatorios por fecha (más próximo primero)', () => {
      const hoy = new Date()
      const mañana = new Date(hoy)
      mañana.setDate(hoy.getDate() + 1)
      const pasadoMañana = new Date(hoy)
      pasadoMañana.setDate(hoy.getDate() + 2)

      const recordatorios = [
        {
          id: '3',
          title: 'Tarea para pasado mañana',
          dueDate: pasadoMañana.toISOString().split('T')[0],
          category: 'estudios'
        },
        {
          id: '1',
          title: 'Tarea para mañana',
          dueDate: mañana.toISOString().split('T')[0],
          category: 'estudios'
        },
        {
          id: '2',
          title: 'Tarea para hoy',
          dueDate: hoy.toISOString().split('T')[0],
          category: 'estudios'
        }
      ]

      const ordenados = reminderSorter.sortByDate(recordatorios, true)

      expect(ordenados).toHaveLength(3)
      expect(ordenados[0].id).toBe('2') // Hoy - más próximo
      expect(ordenados[1].id).toBe('1') // Mañana
      expect(ordenados[2].id).toBe('3') // Pasado mañana - más lejano
    })

    it('debe manejar recordatorios sin fecha', () => {
      const recordatorios = [
        {
          id: '1',
          title: 'Con fecha',
          dueDate: '2025-12-31',
          category: 'estudios'
        },
        {
          id: '2',
          title: 'Sin fecha',
          dueDate: null,
          category: 'estudios'
        }
      ]

      const ordenados = reminderSorter.sortByDate(recordatorios, true)

      expect(ordenados).toHaveLength(2)
      // Los sin fecha deben ir al final
      expect(ordenados[1].id).toBe('2')
    })

    it('debe permitir ordenamiento descendente', () => {
      const hoy = new Date()
      const mañana = new Date(hoy)
      mañana.setDate(hoy.getDate() + 1)

      const recordatorios = [
        {
          id: '1',
          title: 'Hoy',
          dueDate: hoy.toISOString().split('T')[0],
          category: 'estudios'
        },
        {
          id: '2',
          title: 'Mañana',
          dueDate: mañana.toISOString().split('T')[0],
          category: 'estudios'
        }
      ]

      const ordenados = reminderSorter.sortByDate(recordatorios, false)

      expect(ordenados[0].id).toBe('2') // Mañana primero (descendente)
      expect(ordenados[1].id).toBe('1') // Hoy segundo
    })
  })

  describe('Iteración 2 - Múltiples criterios de ordenamiento', () => {
    it('debe ordenar por múltiples criterios: fecha, prioridad, estado', () => {
      const hoy = new Date()
      const mañana = new Date(hoy)
      mañana.setDate(hoy.getDate() + 1)

      const recordatorios = [
        {
          id: '1',
          title: 'Tarea completada para hoy',
          dueDate: hoy.toISOString().split('T')[0],
          category: 'estudios',
          completed: true,
          priority: 'medium'
        },
        {
          id: '2',
          title: 'Tarea urgente para mañana',
          dueDate: mañana.toISOString().split('T')[0],
          category: 'urgent',
          completed: false,
          priority: 'urgent'
        },
        {
          id: '3',
          title: 'Tarea pendiente para hoy',
          dueDate: hoy.toISOString().split('T')[0],
          category: 'estudios',
          completed: false,
          priority: 'low'
        }
      ]

      const ordenados = reminderSorter.sortBy(recordatorios, ['date', 'status', 'priority'])

      expect(ordenados).toHaveLength(3)
      // Orden: fecha (más próxima), luego estado (pendientes primero), luego prioridad (mayor primero)
      expect(ordenados[0].id).toBe('3') // Hoy, pendiente, low
      expect(ordenados[1].id).toBe('1') // Hoy, completado, medium
      expect(ordenados[2].id).toBe('2') // Mañana, pendiente, urgent
    })

    it('debe ordenar solo por prioridad cuando se especifica', () => {
      const recordatorios = [
        {
          id: '1',
          title: 'Tarea baja prioridad',
          dueDate: '2025-12-31',
          priority: 'low'
        },
        {
          id: '2',
          title: 'Tarea alta prioridad',
          dueDate: '2025-12-31',
          priority: 'urgent'
        },
        {
          id: '3',
          title: 'Tarea media prioridad',
          dueDate: '2025-12-31',
          priority: 'medium'
        }
      ]

      const ordenados = reminderSorter.sortByPriority(recordatorios)

      expect(ordenados[0].id).toBe('2') // urgent primero
      expect(ordenados[1].id).toBe('3') // medium segundo
      expect(ordenados[2].id).toBe('1') // low último
    })

    it('debe manejar ordenamiento por categoría alfabéticamente', () => {
      const recordatorios = [
        {
          id: '1',
          title: 'Tarea de trabajo',
          category: 'trabajo',
          dueDate: '2025-12-31'
        },
        {
          id: '2',
          title: 'Tarea de estudios',
          category: 'estudios',
          dueDate: '2025-12-31'
        },
        {
          id: '3',
          title: 'Tarea de salud',
          category: 'salud',
          dueDate: '2025-12-31'
        }
      ]

      const ordenados = reminderSorter.sortBy(recordatorios, ['category'])

      expect(ordenados[0].id).toBe('2') // estudios (alfabéticamente primero)
      expect(ordenados[1].id).toBe('3') // salud
      expect(ordenados[2].id).toBe('1') // trabajo
    })
  })

  describe('Iteración 3 - Optimización y casos edge', () => {
    it('debe manejar arrays vacíos sin errores', () => {
      const ordenados = reminderSorter.sortBy([], ['date'])
      expect(ordenados).toEqual([])
    })

    it('debe manejar recordatorios con propiedades faltantes', () => {
      const recordatorios = [
        { id: '1', title: 'Solo título' },
        {
          id: '2',
          title: 'Completo',
          dueDate: '2025-12-31',
          priority: 'high',
          category: 'estudios',
          completed: false
        },
        { id: '3', dueDate: '2025-01-01' }
      ]

      const ordenados = reminderSorter.sortBy(recordatorios, ['date', 'priority'])
      expect(ordenados).toHaveLength(3)
      expect(ordenados[0].id).toBe('3') // Fecha más próxima
    })

    it('debe proporcionar función de comparación personalizada', () => {
      const recordatorios = [
        { id: '1', title: 'Z título', priority: 'low' },
        { id: '2', title: 'A título', priority: 'high' },
        { id: '3', title: 'M título', priority: 'medium' }
      ]

      // Ordenar alfabéticamente por título
      const ordenados = reminderSorter.customSort(recordatorios, (a, b) => {
        return a.title.localeCompare(b.title)
      })

      expect(ordenados[0].id).toBe('2') // A título
      expect(ordenados[1].id).toBe('3') // M título
      expect(ordenados[2].id).toBe('1') // Z título
    })

    it('debe mantener estabilidad en el ordenamiento', () => {
      const recordatorios = [
        { id: '1', title: 'Primer medium', priority: 'medium', order: 1 },
        { id: '2', title: 'Segundo medium', priority: 'medium', order: 2 },
        { id: '3', title: 'Tercer medium', priority: 'medium', order: 3 }
      ]

      const ordenados = reminderSorter.sortByPriority(recordatorios)

      // Debe mantener el orden original para elementos con la misma prioridad
      expect(ordenados[0].order).toBe(1)
      expect(ordenados[1].order).toBe(2)
      expect(ordenados[2].order).toBe(3)
    })

    it('debe manejar fechas en formatos diversos', () => {
      const hoy = new Date()
      const recordatorios = [
        {
          id: '1',
          title: 'Fecha ISO',
          dueDate: '2025-12-31T10:00:00.000Z'
        },
        {
          id: '2',
          title: 'Fecha simple',
          dueDate: hoy.toISOString().split('T')[0]
        },
        {
          id: '3',
          title: 'Fecha inválida',
          dueDate: 'fecha-inválida'
        }
      ]

      const ordenados = reminderSorter.sortByDate(recordatorios, true)
      expect(ordenados).toHaveLength(3)
      // Las fechas inválidas deben ir al final
      expect(ordenados[2].id).toBe('3')
    })
  })
})