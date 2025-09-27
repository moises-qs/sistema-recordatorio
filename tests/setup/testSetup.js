/**
 * Configuración global para las pruebas
 * Se ejecuta antes de cada archivo de prueba
 */

// Mock de localStorage para el entorno de testing
class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key] || null
  }

  setItem(key, value) {
    this.store[key] = String(value)
  }

  removeItem(key) {
    delete this.store[key]
  }

  get length() {
    return Object.keys(this.store).length
  }

  key(index) {
    const keys = Object.keys(this.store)
    return keys[index] || null
  }
}

// Asignar mock global
global.localStorage = new LocalStorageMock()

// Mock de console.warn y console.error para pruebas más limpias
const originalWarn = console.warn
const originalError = console.error

console.warn = (...args) => {
  // Solo mostrar warnings que no sean de testing
  if (!args.some(arg => String(arg).includes('test') || String(arg).includes('mock'))) {
    originalWarn.apply(console, args)
  }
}

console.error = (...args) => {
  // Solo mostrar errores que no sean esperados en testing
  if (!args.some(arg => String(arg).includes('test') || String(arg).includes('mock'))) {
    originalError.apply(console, args)
  }
}

// Limpiar localStorage antes de cada test
beforeEach(() => {
  localStorage.clear()
})