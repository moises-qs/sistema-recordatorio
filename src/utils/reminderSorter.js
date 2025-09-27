// Implementación actual: Iteración 2 - Múltiples criterios de ordenamiento

export class ReminderSorter {
  constructor() {
    this.priorityOrder = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1
    }
  }

  sortByDate(reminders, ascending = true) {
    if (!Array.isArray(reminders)) {
      return []
    }

    const sortedReminders = [...reminders]

    return sortedReminders.sort((a, b) => {
      const dateA = this._parseDate(a.dueDate)
      const dateB = this._parseDate(b.dueDate)

      // Manejar fechas inválidas o nulas
      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1

      if (ascending) {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })
  }

  sortByPriority(reminders) {
    if (!Array.isArray(reminders)) {
      return []
    }

    const sortedReminders = [...reminders]

    return sortedReminders.sort((a, b) => {
      const priorityA = this.priorityOrder[a.priority] || 0
      const priorityB = this.priorityOrder[b.priority] || 0

      return priorityB - priorityA // Mayor prioridad primero
    })
  }

  sortBy(reminders, criteria) {
    if (!Array.isArray(reminders) || !Array.isArray(criteria)) {
      return []
    }

    const sortedReminders = [...reminders]

    return sortedReminders.sort((a, b) => {
      for (const criterion of criteria) {
        let comparison = 0

        switch (criterion) {
          case 'date':
            comparison = this._compareDates(a, b)
            break
          case 'priority':
            comparison = this._comparePriorities(a, b)
            break
          case 'status':
            comparison = this._compareStatus(a, b)
            break
          case 'category':
            comparison = this._compareCategories(a, b)
            break
        }

        if (comparison !== 0) {
          return comparison
        }
      }

      return 0
    })
  }

  _compareDates(a, b) {
    const dateA = this._parseDate(a.dueDate)
    const dateB = this._parseDate(b.dueDate)

    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1

    return dateA - dateB // Más próximo primero
  }

  _comparePriorities(a, b) {
    const priorityA = this.priorityOrder[a.priority] || 0
    const priorityB = this.priorityOrder[b.priority] || 0

    return priorityB - priorityA // Mayor prioridad primero
  }

  _compareStatus(a, b) {
    const completedA = a.completed || false
    const completedB = b.completed || false

    // Pendientes primero (false < true)
    if (completedA === completedB) return 0
    return completedA ? 1 : -1
  }

  _compareCategories(a, b) {
    const categoryA = (a.category || '').toLowerCase()
    const categoryB = (b.category || '').toLowerCase()

    return categoryA.localeCompare(categoryB) // Orden alfabético
  }

  // Iteración 3: Métodos adicionales y optimizaciones
  customSort(reminders, compareFn) {
    if (!Array.isArray(reminders) || typeof compareFn !== 'function') {
      return []
    }

    const sortedReminders = [...reminders]
    return sortedReminders.sort(compareFn)
  }

  _parseDate(dateStr) {
    if (!dateStr) return null

    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? null : date
  }
}