import { ref, computed } from 'vue';
import { sortByDate, filterByDateRange } from '../utils/dateHelpers';
import { DATE_FILTER_MAP } from '../config/constants';

export function useReminderFilters(reminders) {
   const searchQuery = ref('');
   const selectedFilter = ref('all');
   const selectedCategory = ref('all');

   const filteredReminders = computed(() => {
      let filtered = [...reminders.value];

      // Filtrar por texto de búsqueda
      if (searchQuery.value) {
         const query = searchQuery.value.toLowerCase();
         filtered = filtered.filter(r =>
            r.title.toLowerCase().includes(query) ||
            r.description?.toLowerCase().includes(query)
         );
      }

      // Filtrar por categoría
      if (selectedCategory.value !== 'all') {
         filtered = filtered.filter(r => r.type === selectedCategory.value);
      }

      // Filtrar por rango de fechas
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

   return {
      searchQuery,
      selectedFilter,
      selectedCategory,
      filteredReminders,
      upcomingReminders
   };
}
