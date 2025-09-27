// SimpleORM - Motor ORM minimalista para localStorage
export class SimpleORM {
  constructor(storageKey) {
    if (!storageKey) {
      throw new Error('Se requiere una clave de almacenamiento (storageKey)')
    }
    this.storageKey = storageKey
  }

  // Operaciones básicas CRUD

  /**
   * Buscar un registro por ID
   * @param {string} id - ID del registro
   * @returns {Object|null} - Registro encontrado o null
   */
  find(id) {
    const data = this._getData()
    return data.find(item => item.id === id) || null
  }

  /**
   * Crear un nuevo registro
   * @param {Object} data - Datos del registro
   * @returns {Object} - Registro creado
   */
  create(data) {
    if (!data.id) {
      data.id = this._generateId()
    }

    const currentData = this._getData()

    // Verificar que no exista ya un registro con el mismo ID
    if (currentData.find(item => item.id === data.id)) {
      throw new Error(`Ya existe un registro con ID: ${data.id}`)
    }

    const newRecord = {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    }

    currentData.push(newRecord)
    this._saveData(currentData)

    return newRecord
  }

  /**
   * Actualizar un registro existente
   * @param {string} id - ID del registro
   * @param {Object} data - Nuevos datos
   * @returns {Object|null} - Registro actualizado o null
   */
  update(id, data) {
    const currentData = this._getData()
    const index = currentData.findIndex(item => item.id === id)

    if (index === -1) {
      return null
    }

    const updatedRecord = {
      ...currentData[index],
      ...data,
      id, // Preservar ID original
      updatedAt: new Date().toISOString()
    }

    currentData[index] = updatedRecord
    this._saveData(currentData)

    return updatedRecord
  }

  /**
   * Eliminar un registro
   * @param {string} id - ID del registro
   * @returns {boolean} - true si se eliminó, false si no se encontró
   */
  delete(id) {
    const currentData = this._getData()
    const index = currentData.findIndex(item => item.id === id)

    if (index === -1) {
      return false
    }

    currentData.splice(index, 1)
    this._saveData(currentData)

    return true
  }

  /**
   * Obtener todos los registros
   * @returns {Array} - Array de registros
   */
  all() {
    return this._getData()
  }

  /**
   * Buscar registros que cumplan condiciones
   * @param {Object} conditions - Condiciones de búsqueda
   * @returns {Array} - Array de registros que cumplen las condiciones
   */
  where(conditions) {
    const data = this._getData()

    return data.filter(item => {
      return Object.keys(conditions).every(key => {
        const condition = conditions[key]
        const value = item[key]

        // Soporte para diferentes tipos de condiciones
        if (typeof condition === 'function') {
          return condition(value)
        } else if (condition instanceof RegExp) {
          return condition.test(String(value))
        } else {
          return value === condition
        }
      })
    })
  }

  /**
   * Contar registros
   * @param {Object} conditions - Condiciones opcionales
   * @returns {number} - Número de registros
   */
  count(conditions = {}) {
    if (Object.keys(conditions).length === 0) {
      return this._getData().length
    }
    return this.where(conditions).length
  }

  /**
   * Verificar si existe un registro
   * @param {Object} conditions - Condiciones de búsqueda
   * @returns {boolean} - true si existe al menos un registro
   */
  exists(conditions) {
    return this.where(conditions).length > 0
  }

  // Métodos privados

  /**
   * Obtener datos del localStorage
   * @returns {Array} - Array de registros
   * @private
   */
  _getData() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.warn(`Error al leer datos de ${this.storageKey}:`, error)
      return []
    }
  }

  /**
   * Guardar datos en localStorage
   * @param {Array} data - Array de registros
   * @private
   */
  _saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error(`Error al guardar datos en ${this.storageKey}:`, error)
      throw new Error(`No se pudieron guardar los datos: ${error.message}`)
    }
  }

  /**
   * Generar ID único
   * @returns {string} - ID único
   * @private
   */
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}