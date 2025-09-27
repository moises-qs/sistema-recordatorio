export class PriorityManager {
  constructor() {
    this.priorityLevels = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1
    }

    this.categoryBoosts = {
      // Español
      urgente: 2,
      examen: 1,
      fecha_limite: 2,
      importante: 1,
      trabajo: 0,
      estudios: 0,
      salud: 0,
      personal: 0,
      // Inglés (para compatibilidad)
      urgent: 2,
      exam: 1,
      deadline: 2,
      important: 1,
      work: 0,
      study: 0,
      health: 0
    }

    this.urgentKeywords = [
      // Español
      'urgente', 'crítico', 'emergencia', 'inmediato', 'ahora', 'ya',
      // Inglés (para compatibilidad)
      'urgent', 'asap', 'critical', 'emergency'
    ]
    this.importantKeywords = [
      // Español
      'importante', 'prioridad', 'crucial', 'vital', 'clave', 'fundamental',
      // Inglés (para compatibilidad)
      'important', 'priority', 'crucial', 'vital'
    ]
  }

  calculatePriority(reminder) {
    let basePriority = this._getDateBasedPriority(reminder)
    let priorityScore = this.priorityLevels[basePriority]

    // Apply category boost
    priorityScore += this._getCategoryBoost(reminder.category)

    // Apply keyword boost
    priorityScore += this._getKeywordBoost(reminder.title)

    // Convert back to priority level
    return this._scoreToPriority(priorityScore)
  }

  _getDateBasedPriority(reminder) {
    if (!reminder.dueDate) {
      return 'low'
    }

    const now = new Date()
    const dueDate = new Date(reminder.dueDate)
    const daysDifference = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))

    if (daysDifference <= 1) {
      return 'urgent'
    } else if (daysDifference <= 3) {
      return 'high'
    } else if (daysDifference <= 7) {
      return 'medium'
    }

    return 'low'
  }

  _getCategoryBoost(category) {
    if (!category) return 0
    return this.categoryBoosts[category.toLowerCase()] || 0
  }

  _getKeywordBoost(title) {
    if (!title) return 0

    const titleLower = title.toLowerCase()

    // Check for urgent keywords (higher boost)
    for (const keyword of this.urgentKeywords) {
      if (titleLower.includes(keyword)) {
        return 2
      }
    }

    // Check for important keywords (medium boost)
    for (const keyword of this.importantKeywords) {
      if (titleLower.includes(keyword)) {
        return 1
      }
    }

    return 0
  }

  _scoreToPriority(score) {
    if (score >= 4) return 'urgent'
    if (score >= 3) return 'high'
    if (score >= 2) return 'medium'
    return 'low'
  }

  getPriorityScore(reminder) {
    const priority = this.calculatePriority(reminder)
    return this.priorityLevels[priority]
  }

  updatePriorities(reminders) {
    if (!Array.isArray(reminders)) {
      return reminders
    }

    return reminders.map(reminder => ({
      ...reminder,
      priority: this.calculatePriority(reminder),
      priorityScore: this.getPriorityScore(reminder)
    }))
  }
}