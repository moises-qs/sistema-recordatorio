// Iteración 2: Múltiples criterios de ordenamiento
// Enfoque: Algoritmo más complejo, múltiples campos de ordenamiento

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
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1

      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)

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
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1

    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)

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
}