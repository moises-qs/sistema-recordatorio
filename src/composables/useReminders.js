import { ref, computed, watch } from 'vue';
import { storage } from '../utils/localStorage';
import { sortByDate, filterByDateRange, getUrgencyLevel } from '../utils/dateHelpers';
import { DATE_FILTER_MAP, URGENCY_LEVELS } from '../config/constants';

export function useReminders() {
   const reminders = ref([]);
   const searchQuery = ref('');
   const selectedFilter = ref('all');
   const selectedCategory = ref('all');

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

   const filteredReminders = computed(() => {
      let filtered = [...reminders.value];

      if (searchQuery.value) {
         const query = searchQuery.value.toLowerCase();
         filtered = filtered.filter(r =>
            r.title.toLowerCase().includes(query) ||
            r.description?.toLowerCase().includes(query)
         );
      }

      if (selectedCategory.value !== 'all') {
         filtered = filtered.filter(r => r.type === selectedCategory.value);
      }

      if (selectedFilter.value !== 'all') {
         const days = DATE_FILTER_MAP[selectedFilter.value];
         if (days) {
            filtered = filterByDateRange(filtered, days);
         }
      }

      return sortByDate(filtered);
   });

   const upcomingReminders = computed(() => {
      return filterByDateRange(
         reminders.value.filter(r => !r.completed),
         7
      ).slice(0, 5);
   });

   const stats = computed(() => {
      const total = reminders.value.length;
      const completed = reminders.value.filter(r => r.completed).length;
      const pending = total - completed;
      const urgent = reminders.value.filter(r =>
         !r.completed && getUrgencyLevel(r.date) === URGENCY_LEVELS.URGENT
      ).length;

      return { total, completed, pending, urgent };
   });

   loadReminders();

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