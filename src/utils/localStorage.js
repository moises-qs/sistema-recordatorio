const STORAGE_KEY = 'edureminder_data';

/**
 * Objeto que maneja la persistencia de recordatorios en localStorage del navegador
 * @namespace storage
 */
export const storage = {
   /**
    * Recupera todos los recordatorios almacenados en localStorage
    * @returns {Array<Object>} Array de objetos recordatorio, array vacío si no hay datos o hay error
    * @example
    * const reminders = storage.getReminders();
    * console.log(reminders); // [{id: '1', title: 'Estudiar', ...}, ...]
    */
   getReminders() {
      try {
         const data = localStorage.getItem(STORAGE_KEY);
         return data ? JSON.parse(data) : [];
      } catch (error) {
         console.error('Error loading reminders:', error);
         return [];
      }
   },

   /**
    * Guarda un array de recordatorios en localStorage
    * @param {Array<Object>} reminders - Array de objetos recordatorio a guardar
    * @returns {boolean} true si se guardó exitosamente, false si hubo error
    * @example
    * const success = storage.saveReminders([{id: '1', title: 'Nuevo recordatorio'}]);
    * if (success) console.log('Guardado exitosamente');
    */
   saveReminders(reminders) {
      try {
         localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
         return true;
      } catch (error) {
         console.error('Error saving reminders:', error);
         return false;
      }
   },

   /**
    * Añade un nuevo recordatorio a la lista existente
    * @param {Object} reminder - Objeto recordatorio sin id, createdAt ni completed
    * @returns {Object} El recordatorio creado con todas las propiedades añadidas (id, createdAt, completed)
    * @example
    * const newReminder = storage.addReminder({
    *   title: 'Estudiar matemáticas',
    *   description: 'Capítulo 5',
    *   date: '2024-01-15T10:00:00',
    *   type: 'tarea'
    * });
    * console.log(newReminder.id); // "1703012345678"
    */
   addReminder(reminder) {
      const reminders = this.getReminders();
      const newReminder = {
         id: Date.now().toString(),
         ...reminder,
         createdAt: new Date().toISOString(),
         completed: false
      };
      reminders.push(newReminder);
      this.saveReminders(reminders);
      return newReminder;
   },

   /**
    * Actualiza un recordatorio existente con nuevos datos
    * @param {string} id - ID del recordatorio a actualizar
    * @param {Object} updates - Objeto con las propiedades a actualizar
    * @returns {Object|null} El recordatorio actualizado o null si no se encontró
    * @example
    * const updated = storage.updateReminder('123', {
    *   title: 'Nuevo título',
    *   description: 'Nueva descripción'
    * });
    * if (updated) console.log('Actualizado:', updated.title);
    */
   updateReminder(id, updates) {
      const reminders = this.getReminders();
      const index = reminders.findIndex(r => r.id === id);
      if (index !== -1) {
         reminders[index] = { ...reminders[index], ...updates };
         this.saveReminders(reminders);
         return reminders[index];
      }
      return null;
   },

   /**
    * Elimina un recordatorio por su ID
    * @param {string} id - ID del recordatorio a eliminar
    * @returns {Array<Object>} Array actualizado de recordatorios sin el elemento eliminado
    * @example
    * const remaining = storage.deleteReminder('123');
    * console.log('Recordatorios restantes:', remaining.length);
    */
   deleteReminder(id) {
      const reminders = this.getReminders();
      const filtered = reminders.filter(r => r.id !== id);
      this.saveReminders(filtered);
      return filtered;
   },

   /**
    * Alterna el estado de completado de un recordatorio
    * @param {string} id - ID del recordatorio a alternar
    * @returns {Object|null} El recordatorio actualizado con el estado cambiado o null si no se encontró
    * @example
    * const toggled = storage.toggleComplete('123');
    * if (toggled) {
    *   console.log('Estado:', toggled.completed ? 'Completado' : 'Pendiente');
    *   console.log('Completado en:', toggled.completedAt);
    * }
    */
   toggleComplete(id) {
      const reminders = this.getReminders();
      const reminder = reminders.find(r => r.id === id);
      if (reminder) {
         reminder.completed = !reminder.completed;
         reminder.completedAt = reminder.completed ? new Date().toISOString() : null;
         this.saveReminders(reminders);
         return reminder;
      }
      return null;
   },

   /**
    * Elimina todos los recordatorios marcados como completados
    * @returns {Array<Object>} Array de recordatorios activos (no completados)
    * @example
    * const activeReminders = storage.clearCompleted();
    * console.log('Recordatorios activos restantes:', activeReminders.length);
    */
   clearCompleted() {
      const reminders = this.getReminders();
      const active = reminders.filter(r => !r.completed);
      this.saveReminders(active);
      return active;
   }
};