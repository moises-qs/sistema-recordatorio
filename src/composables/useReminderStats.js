import { computed } from 'vue';
import { getUrgencyLevel } from '../utils/dateHelpers';
import { URGENCY_LEVELS } from '../config/constants';

export function useReminderStats(reminders) {
   const stats = computed(() => {
      const total = reminders.value.length;
      const completed = reminders.value.filter(r => r.completed).length;
      const pending = total - completed;
      const urgent = reminders.value.filter(r =>
         !r.completed && getUrgencyLevel(r.date) === URGENCY_LEVELS.URGENT
      ).length;

      return { total, completed, pending, urgent };
   });

   return {
      stats
   };
}
