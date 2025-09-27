import { describe, it, expect, beforeEach } from 'vitest'
import { PriorityManager } from '../../../src/utils/priorityManager.js'

describe('PriorityManager - Gestor de Prioridades', () => {
  let priorityManager

  beforeEach(() => {
    priorityManager = new PriorityManager()
  })

  describe('calculatePriority()', () => {
    it('debe retornar prioridad baja para un recordatorio básico', () => {
      const recordatorio = {
        id: '1',
        title: 'Estudiar para el examen de matemáticas',
        description: 'Sesión de estudio regular',
        dueDate: '2025-12-31',
        category: 'estudios',
        completed: false
      }

      const prioridad = priorityManager.calculatePriority(recordatorio)
      expect(prioridad).toBe('low')
    })

    it('debe retornar prioridad urgente para recordatorios con vencimiento en 1 día', () => {
      const mañana = new Date()
      mañana.setDate(mañana.getDate() + 1)

      const recordatorio = {
        id: '2',
        title: 'Entregar tarea de física',
        description: 'Fecha límite importante',
        dueDate: mañana.toISOString().split('T')[0],
        category: 'estudios',
        completed: false
      }

      const prioridad = priorityManager.calculatePriority(recordatorio)
      expect(prioridad).toBe('urgent')
    })

    it('debe retornar prioridad alta para recordatorios con vencimiento en 3 días', () => {
      const tresDias = new Date()
      tresDias.setDate(tresDias.getDate() + 3)

      const recordatorio = {
        id: '3',
        title: 'Preparar presentación del proyecto',
        description: 'Reunión de equipo',
        dueDate: tresDias.toISOString().split('T')[0],
        category: 'trabajo',
        completed: false
      }

      const prioridad = priorityManager.calculatePriority(recordatorio)
      expect(prioridad).toBe('high')
    })

    it('debe retornar prioridad media para recordatorios con vencimiento en 7 días', () => {
      const unaSemana = new Date()
      unaSemana.setDate(unaSemana.getDate() + 7)

      const recordatorio = {
        id: '4',
        title: 'Cita médica con el dentista',
        description: 'Control de rutina',
        dueDate: unaSemana.toISOString().split('T')[0],
        category: 'salud',
        completed: false
      }

      const prioridad = priorityManager.calculatePriority(recordatorio)
      expect(prioridad).toBe('medium')
    })

    describe('prioridad basada en categoría', () => {
      it('debe aumentar prioridad para categoría examen', () => {
        const recordatorio = {
          id: '5',
          title: 'Repasar apuntes de historia',
          description: 'Estudio regular',
          dueDate: '2025-12-31', // Futuro lejano - normalmente baja
          category: 'exam',
          completed: false
        }

        const prioridad = priorityManager.calculatePriority(recordatorio)
        expect(prioridad).toBe('medium') // Aumentada desde baja
      })

      it('debe aumentar prioridad para categoría urgente', () => {
        const recordatorio = {
          id: '6',
          title: 'Revisar documentos importantes',
          description: 'Tarea regular',
          dueDate: '2025-12-31', // Futuro lejano - normalmente baja
          category: 'urgent',
          completed: false
        }

        const prioridad = priorityManager.calculatePriority(recordatorio)
        expect(prioridad).toBe('urgent') // Aumentada desde baja a urgente
      })
    })

    describe('prioridad basada en palabras clave', () => {
      it('debe aumentar prioridad por palabra clave "urgente" en el título', () => {
        const recordatorio = {
          id: '7',
          title: 'Tarea urgente para completar',
          description: 'Tarea regular',
          dueDate: '2025-12-31', // Futuro lejano - normalmente baja
          category: 'estudios',
          completed: false
        }

        const prioridad = priorityManager.calculatePriority(recordatorio)
        expect(prioridad).toBe('high') // Aumentada desde baja
      })

      it('debe aumentar prioridad por palabra clave "importante" en el título', () => {
        const recordatorio = {
          id: '8',
          title: 'Preparación importante de reunión',
          description: 'Preparación regular',
          dueDate: '2025-12-31', // Futuro lejano - normalmente baja
          category: 'trabajo',
          completed: false
        }

        const prioridad = priorityManager.calculatePriority(recordatorio)
        expect(prioridad).toBe('medium') // Aumentada desde baja
      })

      it('debe combinar correctamente prioridades de fecha, categoría y palabras clave', () => {
        const mañana = new Date()
        mañana.setDate(mañana.getDate() + 1)

        const recordatorio = {
          id: '9',
          title: 'Preparación urgente para examen final',
          description: 'Tarea crítica',
          dueDate: mañana.toISOString().split('T')[0], // Mañana - urgente por fecha
          category: 'exam', // Aumento medio por categoría
          completed: false
        }

        const prioridad = priorityManager.calculatePriority(recordatorio)
        expect(prioridad).toBe('urgent') // Debe mantenerse urgente (más alto)
      })
    })
  })

  describe('getPriorityScore()', () => {
    it('debe retornar puntaje numérico para nivel de prioridad', () => {
      const recordatorio = {
        id: '1',
        title: 'Tarea de prueba',
        dueDate: '2025-12-31',
        category: 'estudios',
        completed: false
      }

      const puntaje = priorityManager.getPriorityScore(recordatorio)
      expect(puntaje).toBe(1) // prioridad baja = 1
    })
  })

  describe('updatePriorities()', () => {
    it('debe agregar campos de prioridad a todos los recordatorios', () => {
      const recordatorios = [
        {
          id: '1',
          title: 'Tarea regular de matemáticas',
          dueDate: '2025-12-31',
          category: 'estudios'
        },
        {
          id: '2',
          title: 'Tarea urgente de química',
          dueDate: '2025-12-31',
          category: 'urgent'
        }
      ]

      const actualizados = priorityManager.updatePriorities(recordatorios)

      expect(actualizados).toHaveLength(2)
      expect(actualizados[0]).toHaveProperty('priority', 'low')
      expect(actualizados[0]).toHaveProperty('priorityScore', 1)
      expect(actualizados[1]).toHaveProperty('priority', 'urgent') // categoría 'urgent' da +2 de aumento
      expect(actualizados[1]).toHaveProperty('priorityScore', 4)
    })

    it('debe manejar entrada no-array de forma elegante', () => {
      const resultado = priorityManager.updatePriorities(null)
      expect(resultado).toBe(null)
    })
  })
})