// Iteración 1: Implementación básica de ordenamiento por fecha
// Enfoque: Algoritmo straightforward, solo ordenamiento por fecha

export class ReminderSorter {
  sortByDate(reminders, ascending = true) {
    if (!Array.isArray(reminders)) {
      return []
    }

    // Crear una copia para no mutar el array original
    const sortedReminders = [...reminders]

    return sortedReminders.sort((a, b) => {
      // Manejar recordatorios sin fecha (van al final)
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1

      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)

      if (ascending) {
        return dateA - dateB // Más próximo primero
      } else {
        return dateB - dateA // Más lejano primero
      }
    })
  }
}