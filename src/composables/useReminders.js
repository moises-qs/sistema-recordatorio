import { ref, computed, watch } from 'vue';
import { storage } from '../utils/localStorage';
import { sortByDate, filterByDateRange, getUrgencyLevel } from '../utils/dateHelpers';

export function useReminders() {
  const reminders = ref([]);
  const searchQuery = ref('');
  const selectedFilter = ref('all');
  const selectedCategory = ref('all');
  const showOnlyPending = ref(true);

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

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(r => r.type === selectedCategory.value);
    }

    // Filter by completion status
    if (showOnlyPending.value) {
      filtered = filtered.filter(r => !r.completed);
    }

    // Filter by date range
    if (selectedFilter.value !== 'all') {
      const filterMap = {
        'today': 1,
        'week': 7,
        'month': 30
      };
      const days = filterMap[selectedFilter.value];
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
      !r.completed && getUrgencyLevel(r.date) === 'urgent'
    ).length;

    return { total, completed, pending, urgent };
  });

  // Initialize
  loadReminders();

  return {
    reminders,
    searchQuery,
    selectedFilter,
    selectedCategory,
    showOnlyPending,
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