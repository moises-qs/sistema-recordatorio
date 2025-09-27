// BaseModel - Clase base para todos los modelos del ORM
import { SimpleORM } from '../orm/SimpleORM.js'

export class BaseModel {
  constructor(data = {}) {
    // Inicializar propiedades del modelo
    this.id = data.id || this._generateId()
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()

    // Almacenar datos del modelo
    this._data = { ...data }
    this._originalData = { ...data }
    this._isDirty = false

    // Configurar ORM
    this._orm = new SimpleORM(this.constructor.getStorageKey())
  }

  // Métodos de instancia
  save() {
    this.updatedAt = new Date().toISOString()
    this._data.updatedAt = this.updatedAt

    if (this._data.id) {
      // Actualizar registro existente
      return this._orm.update(this._data.id, this.toJSON())
    } else {
      // Crear nuevo registro
      this._data.id = this.id
      return this._orm.create(this.toJSON())
    }
  }

  delete() {
    if (!this._data.id) {
      throw new Error('No se puede eliminar un modelo sin ID')
    }
    return this._orm.delete(this._data.id)
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...this._data
    }
  }

  // Métodos para verificar cambios
  isDirty() {
    return this._isDirty || JSON.stringify(this._data) !== JSON.stringify(this._originalData)
  }

  markClean() {
    this._originalData = { ...this._data }
    this._isDirty = false
  }

  // Métodos estáticos (deben ser sobrescritos)
  static getStorageKey() {
    throw new Error('getStorageKey() debe ser implementado en la clase hija')
  }

  static find(id) {
    const orm = new SimpleORM(this.getStorageKey())
    const data = orm.find(id)
    return data ? new this(data) : null
  }

  static all() {
    const orm = new SimpleORM(this.getStorageKey())
    const allData = orm.all()
    return allData.map(data => new this(data))
  }

  static where(conditions) {
    const orm = new SimpleORM(this.getStorageKey())
    const results = orm.where(conditions)
    return results.map(data => new this(data))
  }

  static create(data) {
    const instance = new this(data)
    instance.save()
    return instance
  }

  // Método privado para generar IDs únicos
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}