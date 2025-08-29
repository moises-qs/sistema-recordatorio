<script setup>
import { ref, computed } from 'vue';
import { useReminders } from './composables/useReminders';
import { groupByDate } from './utils/dateHelpers';
import ReminderCard from './components/ReminderCard.vue';
import AddReminderModal from './components/AddReminderModal.vue';
import FilterBar from './components/FilterBar.vue';
import FilterBarMobile from './components/FilterBarMobile.vue';
import QuickStats from './components/QuickStats.vue';
import QuickStatsMobile from './components/QuickStatsMobile.vue';
import EmptyState from './components/EmptyState.vue';
import OptionsMenu from './components/OptionsMenu.vue';
import { NotificationManager } from './utils/notifications';

const {
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
  clearCompleted
} = useReminders();

const showModal = ref(false);
const editingReminder = ref(null);
const currentView = ref('all'); // 'all' | 'upcoming'

const groupedReminders = computed(() => {
  return groupByDate(filteredReminders.value);
});

const handleAddReminder = (data) => {
  if (editingReminder.value) {
    updateReminder(editingReminder.value.id, data);
    editingReminder.value = null;
  } else {
    const newReminder = addReminder(data);
    // Schedule browser notification if permissions granted
    if ('Notification' in window && Notification.permission === 'granted') {
      NotificationManager.scheduleReminder(newReminder);
    }
  }
  showModal.value = false;
};

const handleEditReminder = (reminder) => {
  editingReminder.value = reminder;
  showModal.value = true;
};

const handleDeleteReminder = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este recordatorio?')) {
    deleteReminder(id);
  }
};

const openAddModal = () => {
  editingReminder.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingReminder.value = null;
};

const getCurrentViewLabel = computed(() => {
  return currentView.value === 'upcoming' ? 'Próximos 7 días' : 'Todos los recordatorios';
});

const currentReminders = computed(() => {
  return currentView.value === 'upcoming' ? upcomingReminders.value : filteredReminders.value;
});

const handleClearCompleted = () => {
  clearCompleted();
};

const handleImportReminders = (importedReminders) => {
  importedReminders.forEach(reminder => {
    addReminder(reminder);
  });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo & Title -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex items-center justify-center">
              <img 
                src="/recordatorio.svg" 
                alt="EduReminder Logo" 
                class="w-10 h-10"
              />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">EduReminder</h1>
              <p class="text-sm text-gray-500">Gestiona tus recordatorios académicos</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- View Toggle -->
            <div class="hidden sm:flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                @click="currentView = 'all'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  currentView === 'all'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Todos
              </button>
              <button
                @click="currentView = 'upcoming'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  currentView === 'upcoming'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Próximos
              </button>
            </div>

            <!-- Options Menu (Desktop only) -->
            <div class="hidden md:block">
              <OptionsMenu 
                :stats="stats" 
                :reminders="reminders"
                @clearCompleted="handleClearCompleted"
                @importReminders="handleImportReminders"
              />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-6 pb-20">
      <!-- Quick Stats - Desktop -->
      <div class="mb-6 hidden md:block">
        <QuickStats :stats="stats" />
      </div>

      <!-- Quick Stats - Mobile -->
      <div class="mb-6 md:hidden">
        <QuickStatsMobile :stats="stats" />
      </div>

      <!-- Filter Bar - Desktop -->
      <div v-if="currentView === 'all'" class="mb-6 hidden md:block">
        <FilterBar
          v-model:searchQuery="searchQuery"
          v-model:selectedCategory="selectedCategory"
          v-model:selectedFilter="selectedFilter"
          v-model:showOnlyPending="showOnlyPending"
        />
      </div>

      <!-- Filter Bar - Mobile -->
      <div v-if="currentView === 'all'" class="mb-6 md:hidden">
        <FilterBarMobile
          v-model:searchQuery="searchQuery"
          v-model:selectedCategory="selectedCategory"
          v-model:selectedFilter="selectedFilter"
          v-model:showOnlyPending="showOnlyPending"
        />
      </div>

      <!-- Content -->
      <div class="space-y-6">
        <!-- View Title -->
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ getCurrentViewLabel }}
            <span v-if="currentReminders.length > 0" class="text-gray-500 text-base font-normal ml-2">
              ({{ currentReminders.length }})
            </span>
          </h2>

          <!-- Mobile View Toggle -->
          <div class="sm:hidden flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              @click="currentView = 'all'"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                currentView === 'all'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600'
              ]"
            >
              Todos
            </button>
            <button
              @click="currentView = 'upcoming'"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                currentView === 'upcoming'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600'
              ]"
            >
              Próximos
            </button>
          </div>
        </div>

        <!-- Reminders List -->
        <div v-if="currentReminders.length > 0" class="space-y-6">
          <!-- Grouped by date (for all view) -->
          <div v-if="currentView === 'all'" v-for="(reminders, dateGroup) in groupedReminders" :key="dateGroup" class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-700 px-2 flex items-center gap-2">
              <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
              {{ dateGroup }}
              <span class="text-gray-400 font-normal">({{ reminders.length }})</span>
            </h3>
            <div class="space-y-3">
              <ReminderCard
                v-for="reminder in reminders"
                :key="reminder.id"
                :reminder="reminder"
                @toggle="toggleComplete(reminder.id)"
                @edit="handleEditReminder(reminder)"
                @delete="handleDeleteReminder(reminder.id)"
                class="animate-in"
              />
            </div>
          </div>

          <!-- Simple list (for upcoming view) -->
          <div v-if="currentView === 'upcoming'" class="space-y-3">
            <ReminderCard
              v-for="reminder in currentReminders"
              :key="reminder.id"
              :reminder="reminder"
              @toggle="toggleComplete(reminder.id)"
              @edit="handleEditReminder(reminder)"
              @delete="handleDeleteReminder(reminder.id)"
              class="animate-in"
            />
          </div>
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else
          :title="currentView === 'upcoming' ? 'No hay recordatorios próximos' : 'No hay recordatorios'"
          :message="currentView === 'upcoming' 
            ? 'No tienes recordatorios programados para los próximos 7 días' 
            : 'Comienza creando tu primer recordatorio para mantenerte organizado'"
          @action="openAddModal"
        />
      </div>
    </main>

    <!-- Floating Action Button -->
    <Transition name="fab">
      <button
        v-show="!showModal"
        @click="openAddModal"
        class="fixed bottom-6 right-6 w-16 h-16 md:w-14 md:h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-[100] hover:scale-110 active:scale-95 shadow-colored"
      >
        <svg class="w-7 h-7 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </Transition>

    <!-- Add/Edit Modal -->
    <AddReminderModal
      :is-open="showModal"
      :edit-reminder="editingReminder"
      @close="closeModal"
      @submit="handleAddReminder"
    />
  </div>
</template>

<style scoped>
.fab-enter-active,
.fab-leave-active {
  transition: all 0.3s ease;
}

.fab-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.fab-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}
</style>
