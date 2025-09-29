import { describe, it, expect } from 'vitest'
import { PriorityManager } from '../../src/utils/priorityManager.js'

describe('PriorityManager - calculatePriority (date-based)', () => {
  const pm = new PriorityManager()

  it('debería retornar "urgent" si la fecha es hoy', () => {
    const reminder = { dueDate: new Date().toISOString() }
    expect(pm.calculatePriority(reminder)).toBe('urgent')
  })

  it('debería retornar "high" si la fecha es en 2 días', () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    const reminder = { dueDate: futureDate }
    expect(pm.calculatePriority(reminder)).toBe('high')
  })

  it('debería retornar "low" si no hay fecha', () => {
    const reminder = { dueDate: null }
    expect(pm.calculatePriority(reminder)).toBe('low')
  })
})
