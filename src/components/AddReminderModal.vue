<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[150] overflow-y-auto"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]" @click="close" />
        
        <!-- Modal -->
        <div class="relative min-h-screen flex items-end sm:items-center justify-center p-0 sm:p-4 z-[200]">
          <div
            class="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl transform transition-all animate-slide-up sm:animate-scale-in z-[201]"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 class="text-xl font-bold text-gray-900">
                {{ editMode ? 'Editar Recordatorio' : 'Nuevo Recordatorio' }}
              </h2>
              <button
                @click="close"
                class="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Título del recordatorio
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  placeholder="Ej: Examen de Cálculo II"
                  class="input-field"
                  :class="{ 'ring-2 ring-red-500': errors.title }"
                  @input="errors.title = false"
                />
                <p v-if="errors.title" class="mt-1 text-xs text-red-500">
                  El título es obligatorio
                </p>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  v-model="formData.description"
                  rows="2"
                  placeholder="Añade detalles importantes..."
                  class="input-field resize-none"
                />
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de recordatorio
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="type in reminderTypes"
                    :key="type.value"
                    type="button"
                    @click="formData.type = type.value"
                    :class="[
                      'flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200',
                      formData.type === type.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    ]"
                  >
                    <span class="text-lg">{{ type.icon }}</span>
                    <span class="font-medium text-sm">{{ type.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Date and Time -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y hora
                </label>
                <input
                  v-model="formData.date"
                  type="datetime-local"
                  required
                  :min="minDateTime"
                  class="input-field"
                  :class="{ 'ring-2 ring-red-500': errors.date }"
                  @input="errors.date = false"
                />
                <p v-if="errors.date" class="mt-1 text-xs text-red-500">
                  La fecha debe ser futura
                </p>
              </div>

              <!-- Priority indicator -->
              <div v-if="urgencyInfo" class="p-4 rounded-xl" :class="urgencyInfo.bgClass">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" :class="urgencyInfo.textClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span class="text-sm font-medium" :class="urgencyInfo.textClass">
                    {{ urgencyInfo.message }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="close"
                  class="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="!isFormValid"
                  class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ editMode ? 'Guardar' : 'Crear' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getUrgencyLevel } from '../utils/dateHelpers';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editReminder: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'submit']);

const reminderTypes = [
  { value: 'exam', label: 'Examen', icon: '📚' },
  { value: 'task', label: 'Tarea', icon: '📝' },
  { value: 'presentation', label: 'Presentación', icon: '🎤' },
  { value: 'meeting', label: 'Reunión', icon: '👥' }
];

const formData = ref({
  title: '',
  description: '',
  type: 'task',
  date: ''
});

const errors = ref({
  title: false,
  date: false
});

const editMode = computed(() => !!props.editReminder);

const minDateTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
});

const isFormValid = computed(() => {
  return formData.value.title && formData.value.date && new Date(formData.value.date) > new Date();
});

const urgencyInfo = computed(() => {
  if (!formData.value.date) return null;
  
  const urgency = getUrgencyLevel(formData.value.date);
  
  const infoMap = {
    urgent: {
      message: 'Este recordatorio es urgente (menos de 24 horas)',
      bgClass: 'bg-red-50 border border-red-200',
      textClass: 'text-red-700'
    },
    soon: {
      message: 'Este recordatorio es próximo (menos de 3 días)',
      bgClass: 'bg-amber-50 border border-amber-200',
      textClass: 'text-amber-700'
    },
    normal: {
      message: 'Tienes tiempo suficiente para prepararte',
      bgClass: 'bg-blue-50 border border-blue-200',
      textClass: 'text-blue-700'
    }
  };
  
  return infoMap[urgency] || null;
});

const handleSubmit = () => {
  // Validate
  if (!formData.value.title) {
    errors.value.title = true;
    return;
  }
  
  if (!formData.value.date || new Date(formData.value.date) <= new Date()) {
    errors.value.date = true;
    return;
  }
  
  emit('submit', { ...formData.value });
  close();
};

const close = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    type: 'task',
    date: ''
  };
  errors.value = {
    title: false,
    date: false
  };
};

// Watch for edit mode
watch(() => props.editReminder, (newVal) => {
  if (newVal) {
    formData.value = {
      title: newVal.title || '',
      description: newVal.description || '',
      type: newVal.type || 'task',
      date: newVal.date ? new Date(newVal.date).toISOString().slice(0, 16) : ''
    };
  } else {
    resetForm();
  }
}, { immediate: true });

// Set default date to next hour when opening for new reminder
watch(() => props.isOpen, (newVal) => {
  if (newVal && !editMode.value) {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    nextHour.setMinutes(nextHour.getMinutes() - nextHour.getTimezoneOffset());
    formData.value.date = nextHour.toISOString().slice(0, 16);
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative {
  transform: translateY(100%);
}

.modal-leave-to .relative {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from .relative {
    transform: scale(0.95) translateY(0);
  }
  
  .modal-leave-to .relative {
    transform: scale(0.95) translateY(0);
  }
}
</style>