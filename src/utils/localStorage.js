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
    * Guarda un array de recordatorios en localStorage con manejo completo de errores
    * @param {Array<Object>} reminders - Array de objetos recordatorio a guardar
    * @returns {{success: boolean, error?: string, errorType?: string}} Objeto con resultado y detalles del error si aplica
    * @example
    * const result = storage.saveReminders([{id: '1', title: 'Nuevo recordatorio'}]);
    * if (result.success) {
    *   console.log('Guardado exitosamente');
    * } else {
    *   console.error('Error:', result.error, 'Tipo:', result.errorType);
    * }
    */
   saveReminders(reminders) {
      try {
         // Validación de datos de entrada
         if (!Array.isArray(reminders)) {
            return {
               success: false,
               error: 'Los datos deben ser un array de recordatorios',
               errorType: 'INVALID_INPUT'
            };
         }

         // Verificar que localStorage esté disponible
         if (typeof Storage === 'undefined') {
            return {
               success: false,
               error: 'localStorage no está disponible en este navegador',
               errorType: 'NOT_SUPPORTED'
            };
         }

         // Intentar serializar los datos para detectar errores de JSON
         const jsonData = JSON.stringify(reminders);

         // Verificar el tamaño de los datos (localStorage tiene límite ~5-10MB)
         const dataSize = new Blob([jsonData]).size;
         if (dataSize > 5000000) { // 5MB
            return {
               success: false,
               error: 'Los datos exceden el límite de almacenamiento (5MB)',
               errorType: 'SIZE_EXCEEDED'
            };
         }

         // Intentar guardar en localStorage
         localStorage.setItem(STORAGE_KEY, jsonData);

         // Verificar que se guardó correctamente
         const savedData = localStorage.getItem(STORAGE_KEY);
         if (!savedData || savedData !== jsonData) {
            return {
               success: false,
               error: 'Error de verificación: los datos no se guardaron correctamente',
               errorType: 'VERIFICATION_FAILED'
            };
         }

         return { success: true };

      } catch (error) {
         // Manejo específico de errores de localStorage
         if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            return {
               success: false,
               error: 'Espacio de almacenamiento insuficiente. Elimina algunos recordatorios o limpia el cache del navegador',
               errorType: 'QUOTA_EXCEEDED'
            };
         }

         if (error.name === 'SecurityError') {
            return {
               success: false,
               error: 'Acceso denegado al almacenamiento local. Verifica la configuración de privacidad del navegador',
               errorType: 'ACCESS_DENIED'
            };
         }

         if (error.name === 'InvalidStateError') {
            return {
               success: false,
               error: 'localStorage está deshabilitado o no disponible',
               errorType: 'STORAGE_DISABLED'
            };
         }

         // Error genérico para cualquier otro caso
         console.error('Error al guardar recordatorios:', error);
         return {
            success: false,
            error: 'Error al guardar el recordatorio',
            errorType: 'UNKNOWN_ERROR'
         };
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
      
      const result = this.saveReminders(reminders);
      if (!result.success) {
         console.error('Error al añadir recordatorio:', result.error);
         throw new Error(result.error);
      }
      
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
         
         const result = this.saveReminders(reminders);
         if (!result.success) {
            console.error('Error al actualizar recordatorio:', result.error);
            throw new Error(result.error);
         }
         
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
      
      const result = this.saveReminders(filtered);
      if (!result.success) {
         console.error('Error al eliminar recordatorio:', result.error);
         throw new Error(result.error);
      }
      
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
         
         const result = this.saveReminders(reminders);
         if (!result.success) {
            console.error('Error al cambiar estado del recordatorio:', result.error);
            throw new Error(result.error);
         }
         
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
      
      const result = this.saveReminders(active);
      if (!result.success) {
         console.error('Error al limpiar recordatorios completados:', result.error);
         throw new Error(result.error);
      }
      
      return active;
   }
};