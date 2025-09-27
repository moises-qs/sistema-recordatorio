// CategoryRepository - Repositorio para operaciones complejas con categorías
import { Category } from '../models/Category.js'

export class CategoryRepository {
  constructor() {
    this.model = Category
  }

  /**
   * Busca una categoría por nombre exacto
   * @param {string} name - Nombre de la categoría
   * @returns {Category|null} - Categoría encontrada o null
   */
  findByName(name) {
    if (!name || typeof name !== 'string') {
      return null
    }

    const categories = this.model.all()
    return categories.find(cat => cat.name.toLowerCase() === name.toLowerCase()) || null
  }

  /**
   * Busca categorías por nombre parcial (búsqueda difusa)
   * @param {string} query - Texto a buscar
   * @returns {Array<Category>} - Array de categorías encontradas
   */
  searchByName(query) {
    if (!query || typeof query !== 'string') {
      return []
    }

    const searchTerm = query.toLowerCase().trim()
    const categories = this.model.all()

    return categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm) ||
      cat.description.toLowerCase().includes(searchTerm)
    )
  }

  /**
   * Obtiene categorías que están siendo usadas por recordatorios
   * @returns {Array<Category>} - Array de categorías en uso
   */
  findUsedCategories() {
    return this.model.all().filter(category => category.isUsed())
  }

  /**
   * Obtiene categorías que no están siendo usadas
   * @returns {Array<Category>} - Array de categorías sin uso
   */
  findUnusedCategories() {
    return this.model.all().filter(category => !category.isUsed())
  }

  /**
   * Crea una categoría con validación adicional
   * @param {Object} data - Datos de la categoría
   * @returns {Category} - Categoría creada
   * @throws {Error} - Si ya existe una categoría con el mismo nombre
   */
  createWithValidation(data) {
    if (!data || !data.name) {
      throw new Error('El nombre es requerido para crear una categoría')
    }

    // Verificar que no exista una categoría con el mismo nombre
    const existing = this.findByName(data.name)
    if (existing) {
      throw new Error(`Ya existe una categoría con el nombre: ${data.name}`)
    }

    const category = new Category(data)
    category.save()
    return category // Devolver la instancia, no el resultado de save()
  }

  /**
   * Actualiza una categoría con validaciones
   * @param {string} id - ID de la categoría
   * @param {Object} data - Nuevos datos
   * @returns {Category|null} - Categoría actualizada o null
   * @throws {Error} - Si el nuevo nombre ya existe en otra categoría
   */
  updateWithValidation(id, data) {
    const category = this.model.find(id)
    if (!category) {
      return null
    }

    // Si se está cambiando el nombre, verificar que no exista
    if (data.name && data.name !== category.name) {
      const existing = this.findByName(data.name)
      if (existing && existing.id !== id) {
        throw new Error(`Ya existe una categoría con el nombre: ${data.name}`)
      }
    }

    // Actualizar propiedades
    Object.keys(data).forEach(key => {
      if (key in category) {
        category[key] = data[key]
      }
    })

    return category.save()
  }

  /**
   * Elimina una categoría solo si no está en uso
   * @param {string} id - ID de la categoría
   * @returns {boolean} - true si se eliminó, false si no se pudo
   * @throws {Error} - Si la categoría está en uso
   */
  safeDelete(id) {
    const category = this.model.find(id)
    if (!category) {
      return false
    }

    if (category.isUsed()) {
      throw new Error(`No se puede eliminar la categoría '${category.name}' porque está en uso`)
    }

    return category.delete()
  }

  /**
   * Fuerza la eliminación de una categoría y actualiza recordatorios
   * @param {string} id - ID de la categoría
   * @param {string} replacementCategoryName - Nombre de categoría de reemplazo
   * @returns {boolean} - true si se eliminó
   */
  forceDelete(id, replacementCategoryName = 'General') {
    const category = this.model.find(id)
    if (!category) {
      return false
    }

    // Si está en uso, actualizar recordatorios
    if (category.isUsed()) {
      this._updateRemindersCategory(category.name, replacementCategoryName)
    }

    return category.delete()
  }

  /**
   * Crea múltiples categorías con validación
   * @param {Array} categoriesData - Array de datos de categorías
   * @returns {Array<Category>} - Array de categorías creadas
   * @throws {Error} - Si alguna validación falla
   */
  bulkCreate(categoriesData) {
    if (!Array.isArray(categoriesData)) {
      throw new Error('Se esperaba un array de datos de categorías')
    }

    const results = []
    const errors = []

    // Primero validar todos antes de crear cualquiera
    categoriesData.forEach((data, index) => {
      try {
        if (!data || !data.name) {
          errors.push(`Ítem ${index + 1}: El nombre es requerido`)
          return
        }

        // Verificar nombres duplicados en el lote
        const duplicateInBatch = categoriesData.slice(index + 1).some(otherData =>
          otherData && otherData.name && otherData.name.toLowerCase() === data.name.toLowerCase()
        )
        if (duplicateInBatch) {
          errors.push(`Ítem ${index + 1}: Nombre duplicado en el lote: ${data.name}`)
          return
        }

        // Verificar que no exista en la base de datos
        const existing = this.findByName(data.name)
        if (existing) {
          errors.push(`Ítem ${index + 1}: Ya existe una categoría con el nombre: ${data.name}`)
        }
      } catch (error) {
        errors.push(`Ítem ${index + 1}: ${error.message}`)
      }
    })

    if (errors.length > 0) {
      throw new Error(`Errores en creación masiva:\n${errors.join('\n')}`)
    }

    // Si no hay errores, crear todas las categorías
    categoriesData.forEach(data => {
      const category = new Category(data)
      category.save()
      results.push(category)
    })

    return results
  }

  /**
   * Obtiene estadísticas de categorías
   * @returns {Object} - Objeto con estadísticas
   */
  getStats() {
    const allCategories = this.model.all()
    const usedCategories = this.findUsedCategories()

    return {
      total: allCategories.length,
      used: usedCategories.length,
      unused: allCategories.length - usedCategories.length,
      usageByCategory: allCategories.map(cat => ({
        name: cat.name,
        count: cat.getRemindersCount(),
        percentage: this._calculateUsagePercentage(cat)
      }))
    }
  }

  /**
   * Obtiene categorías ordenadas por uso
   * @param {boolean} ascending - true para orden ascendente
   * @returns {Array<Category>} - Array de categorías ordenadas
   */
  getByUsage(ascending = false) {
    const categories = this.model.all()

    return categories.sort((a, b) => {
      const countA = a.getRemindersCount()
      const countB = b.getRemindersCount()

      return ascending ? countA - countB : countB - countA
    })
  }

  // Métodos privados

  /**
   * Actualiza la categoría de recordatorios
   * @param {string} oldCategoryName - Nombre anterior
   * @param {string} newCategoryName - Nombre nuevo
   * @private
   */
  _updateRemindersCategory(oldCategoryName, newCategoryName) {
    try {
      const reminders = JSON.parse(localStorage.getItem('app_reminders') || '[]')
      const updatedReminders = reminders.map(reminder => {
        if (reminder.category === oldCategoryName) {
          return { ...reminder, category: newCategoryName }
        }
        return reminder
      })
      localStorage.setItem('app_reminders', JSON.stringify(updatedReminders))
    } catch (error) {
      console.error('Error al actualizar categorías en recordatorios:', error)
    }
  }

  /**
   * Calcula el porcentaje de uso de una categoría
   * @param {Category} category - Categoría
   * @returns {number} - Porcentaje de uso
   * @private
   */
  _calculateUsagePercentage(category) {
    try {
      const reminders = JSON.parse(localStorage.getItem('app_reminders') || '[]')
      if (reminders.length === 0) return 0

      const categoryCount = category.getRemindersCount()
      return Math.round((categoryCount / reminders.length) * 100)
    } catch (error) {
      return 0
    }
  }
}