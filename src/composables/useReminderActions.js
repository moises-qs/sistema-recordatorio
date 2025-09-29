import { ref } from 'vue';
import { storage } from '../utils/localStorage';

export function useReminderActions() {
   const reminders = ref([]);

   const loadReminders = () => {
      // Migrar recordatorios del campo 'type' a 'category' si es necesario
      migrateReminderTypes();
      reminders.value = storage.getReminders();
   };

   const migrateReminderTypes = () => {
      try {
         const storedReminders = storage.getReminders();
         let needsMigration = false;
         
         const migratedReminders = storedReminders.map(reminder => {
            // Si el recordatorio tiene 'type' pero no 'category', migrar
            if (reminder.type && !reminder.category) {
               needsMigration = true;
               // Mapear tipos antiguos a nombres de categorías
               const typeToCategory = {
                  'exam': 'Exámenes',
                  'task': 'Tareas',
                  'presentation': 'Presentaciones',
                  'meeting': 'Reuniones'
               };
               
               return {
                  ...reminder,
                  category: typeToCategory[reminder.type] || reminder.type,
                  // Mantener type por compatibilidad temporal
                  type: reminder.type
               };
            }
            return reminder;
         });
         
         if (needsMigration) {
            storage.saveReminders(migratedReminders);
            console.log('Migrados recordatorios de type a category');
         }
      } catch (error) {
         console.warn('Error en migración de recordatorios:', error);
      }
   };

   const addReminder = (reminderData) => {
      const newReminder = storage.addReminder(reminderData);
      loadReminders();
      return newReminder;
   };

   const updateReminder = (id, updates) => {
      storage.updateReminder(id, updates);
      loadReminders();
   };

   const deleteReminder = (id) => {
      storage.deleteReminder(id);
      loadReminders();
   };

   const toggleComplete = (id) => {
      storage.toggleComplete(id);
      loadReminders();
   };

   const clearCompleted = () => {
      storage.clearCompleted();
      loadReminders();
   };

   // Cargar recordatorios al inicializar
   loadReminders();

   return {
      reminders,
      loadReminders,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleComplete,
      clearCompleted
   };
}
