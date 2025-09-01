import { useReminderActions } from './useReminderActions';
import { useReminderFilters } from './useReminderFilters';
import { useReminderStats } from './useReminderStats';

export function useReminders() {
   // Composable para operaciones CRUD
   const {
      reminders,
      loadReminders,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleComplete,
      clearCompleted
   } = useReminderActions();

   // Composable para filtrado y búsqueda
   const {
      searchQuery,
      selectedFilter,
      selectedCategory,
      filteredReminders,
      upcomingReminders
   } = useReminderFilters(reminders);

   // Composable para estadísticas
   const {
      stats
   } = useReminderStats(reminders);

   return {
      reminders,
      searchQuery,
      selectedFilter,
      selectedCategory,
      filteredReminders,
      upcomingReminders,
      stats,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleComplete,
      clearCompleted,
      loadReminders
   };
}