/**
 * Funciones auxiliares para las pruebas
 */

/**
 * Crea un recordatorio de prueba con datos válidos
 * @param {Object} overrides - Propiedades a sobrescribir
 * @returns {Object} Recordatorio de prueba
 */
export function createTestReminder(overrides = {}) {
  return {
    id: Math.random().toString(36).substring(2, 9),
    title: 'Test Reminder',
    description: 'Test description',
    dueDate: new Date().toISOString(),
    category: 'test',
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }
}

/**
 * Crea múltiples recordatorios de prueba
 * @param {number} count - Cantidad de recordatorios a crear
 * @param {Object} baseData - Datos base para todos los recordatorios
 * @returns {Array} Array de recordatorios de prueba
 */
export function createTestReminders(count = 3, baseData = {}) {
  return Array.from({ length: count }, (_, index) =>
    createTestReminder({
      title: `Test Reminder ${index + 1}`,
      ...baseData
    })
  )
}

/**
 * Simula una demora asíncrona
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que se resuelve después del tiempo especificado
 */
export function delay(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Verifica que un objeto tenga la estructura de un recordatorio válido
 * @param {Object} reminder - Objeto a verificar
 * @returns {boolean} True si tiene la estructura correcta
 */
export function isValidReminderStructure(reminder) {
  const requiredFields = ['id', 'title', 'dueDate', 'category', 'completed', 'createdAt']
  return requiredFields.every(field => reminder.hasOwnProperty(field))
}

/**
 * Obtiene el estado actual del localStorage como objeto
 * @returns {Object} Contenido actual del localStorage
 */
export function getLocalStorageSnapshot() {
  const snapshot = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    snapshot[key] = localStorage.getItem(key)
  }
  return snapshot
}