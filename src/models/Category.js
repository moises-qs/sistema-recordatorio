// Category - Modelo específico para categorías de recordatorios
import { BaseModel } from './BaseModel.js'

export class Category extends BaseModel {
  constructor(data = {}) {
    super(data)

    // Propiedades específicas de Category
    this.name = data.name || ''
    this.icon = data.icon || '📁' // Icono por defecto
    this.color = data.color || '#95a5a6' // Color gris por defecto
    this.description = data.description || ''

    // Actualizar datos internos
    this._data = {
      ...this._data,
      name: this.name,
      icon: this.icon,
      color: this.color,
      description: this.description
    }
  }

  // Método de validación específico para categorías
  validate() {
    const errors = []

    // Validar nombre
    if (!this.name || this.name.trim() === '') {
      errors.push('El nombre es requerido')
    } else if (this.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres')
    } else if (this.name.length > 50) {
      errors.push('El nombre no puede exceder 50 caracteres')
    }

    // Validar color (debe ser hexadecimal)
    if (this.color && !this._isValidHexColor(this.color)) {
      errors.push('El color debe ser un código hexadecimal válido')
    }

    // Validar descripción
    if (this.description && this.description.length > 200) {
      errors.push('La descripción no puede exceder 200 caracteres')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Métodos específicos de Category

  /**
   * Obtiene el número de recordatorios que usan esta categoría
   * @returns {number} - Número de recordatorios
   */
  getRemindersCount() {
    try {
      const reminders = JSON.parse(localStorage.getItem('app_reminders') || '[]')
      return reminders.filter(reminder => reminder.category === this.name).length
    } catch (error) {
      console.warn('Error al obtener conteo de recordatorios:', error)
      return 0
    }
  }

  /**
   * Verifica si la categoría está siendo usada por algún recordatorio
   * @returns {boolean} - true si está en uso
   */
  isUsed() {
    return this.getRemindersCount() > 0
  }

  /**
   * Obtiene un objeto JSON con todas las propiedades
   * @returns {Object} - Objeto JSON
   */
  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      icon: this.icon,
      color: this.color,
      description: this.description
    }
  }

  /**
   * Guarda la categoría después de validar
   * @returns {Object} - Categoría guardada
   * @throws {Error} - Si la validación falla
   */
  save() {
    const validation = this.validate()
    if (!validation.isValid) {
      throw new Error(`Validación fallida: ${validation.errors.join(', ')}`)
    }

    // Actualizar datos internos antes de guardar
    this._data = {
      ...this._data,
      name: this.name,
      icon: this.icon,
      color: this.color,
      description: this.description
    }

    return super.save()
  }

  // Métodos estáticos

  /**
   * Obtiene la clave de almacenamiento para categorías
   * @returns {string} - Clave de localStorage
   */
  static getStorageKey() {
    return 'app_categories'
  }

  /**
   * Busca una categoría por nombre
   * @param {string} name - Nombre de la categoría
   * @returns {Category|null} - Categoría encontrada o null
   */
  static findByName(name) {
    const categories = this.all()
    return categories.find(cat => cat.name === name) || null
  }

  /**
   * Obtiene categorías que están siendo usadas
   * @returns {Array<Category>} - Array de categorías en uso
   */
  static getUsedCategories() {
    return this.all().filter(category => category.isUsed())
  }

  /**
   * Obtiene categorías que no están siendo usadas
   * @returns {Array<Category>} - Array de categorías sin uso
   */
  static getUnusedCategories() {
    return this.all().filter(category => !category.isUsed())
  }

  /**
   * Crea múltiples categorías de una vez
   * @param {Array} categoriesData - Array de datos de categorías
   * @returns {Array<Category>} - Array de categorías creadas
   */
  static bulkCreate(categoriesData) {
    return categoriesData.map(data => {
      const category = new Category(data)
      category.save()
      return category
    })
  }

  // Métodos privados

  /**
   * Valida si un color es hexadecimal válido
   * @param {string} color - Color a validar
   * @returns {boolean} - true si es válido
   * @private
   */
  _isValidHexColor(color) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexRegex.test(color)
  }
}