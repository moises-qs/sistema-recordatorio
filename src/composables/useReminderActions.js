import { ref } from 'vue';
import { storage } from '../utils/localStorage';

export function useReminderActions() {
   const reminders = ref([]);

   const loadReminders = () => {
      reminders.value = storage.getReminders();
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
