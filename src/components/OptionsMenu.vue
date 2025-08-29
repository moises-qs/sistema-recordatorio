<template>
  <div class="relative">
    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        v-click-outside="closeMenu"
        class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
      >
        <!-- Statistics -->
        <div class="px-4 py-2 border-b border-gray-100">
          <p class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Estadísticas</p>
          <div class="text-sm text-gray-700">
            <p>Total: {{ stats.total }} recordatorios</p>
            <p>Pendientes: {{ stats.pending }}</p>
            <p>Completados: {{ stats.completed }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="py-1">
          <button
            @click="handleExportJSON"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
          >
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar como JSON
          </button>

          <button
            @click="handleExportCSV"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
          >
            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Exportar como CSV
          </button>

          <button
            @click="handleImport"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
          >
            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Importar datos
          </button>

          <div class="border-t border-gray-100 my-1"></div>

          <button
            @click="handleClearCompleted"
            :disabled="stats.completed === 0"
            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="stats.completed > 0 ? 'text-amber-600' : 'text-gray-400'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Limpiar completados ({{ stats.completed }})
          </button>

          <button
            @click="handleRequestNotifications"
            v-if="showNotificationOption"
            class="w-full px-4 py-2 text-left text-sm text-primary-600 hover:bg-primary-50 flex items-center gap-3 transition-colors duration-150"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 2a7 7 0 017 7c0 5.25-3 7.5-5.25 11h-3.5C8 16.5 5 14.25 5 9a7 7 0 017-7z" />
            </svg>
            Habilitar notificaciones
          </button>
        </div>

        <!-- Footer -->
        <div class="px-4 py-2 border-t border-gray-100">
          <p class="text-xs text-gray-400">
            EduReminder v1.0
          </p>
        </div>
      </div>
    </Transition>

    <!-- Hidden file input for import -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      @change="handleFileSelect"
      class="hidden"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { exportToJSON, exportToCSV, importFromJSON } from '../utils/exportHelpers';
import { NotificationManager } from '../utils/notifications';

const props = defineProps({
  stats: {
    type: Object,
    required: true
  },
  reminders: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['clearCompleted', 'importReminders']);

const isOpen = ref(false);
const fileInput = ref(null);

const showNotificationOption = computed(() => {
  return 'Notification' in window && Notification.permission !== 'granted';
});

const closeMenu = () => {
  isOpen.value = false;
};

const handleExportJSON = () => {
  exportToJSON(props.reminders);
  closeMenu();
};

const handleExportCSV = () => {
  exportToCSV(props.reminders);
  closeMenu();
};

const handleImport = () => {
  fileInput.value.click();
  closeMenu();
};

const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const importedReminders = await importFromJSON(file);
    
    if (confirm(`¿Importar ${importedReminders.length} recordatorios? Esto se agregará a tus datos existentes.`)) {
      emit('importReminders', importedReminders);
    }
  } catch (error) {
    alert(`Error al importar: ${error.message}`);
  } finally {
    event.target.value = '';
  }
};

const handleClearCompleted = () => {
  if (confirm(`¿Eliminar ${props.stats.completed} recordatorios completados?`)) {
    emit('clearCompleted');
    closeMenu();
  }
};

const handleRequestNotifications = async () => {
  try {
    const permission = await NotificationManager.requestPermission();
    if (permission === 'granted') {
      NotificationManager.showNotification('¡Notificaciones habilitadas!', {
        body: 'Ahora recibirás recordatorios cuando llegue el momento'
      });
    }
  } catch (error) {
    console.error('Error requesting notifications:', error);
  }
  closeMenu();
};

// Click outside directive
const clickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  }
};

// Register directive locally
const vClickOutside = clickOutside;
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>