<template>
   <div :class="[
      'group relative overflow-hidden transition-all duration-300',
      'bg-white rounded-2xl border shadow-sm',
      'hover:shadow-lg hover:-translate-y-0.5',
      completed ? 'opacity-60 border-gray-100' : 'border-gray-100',
      urgencyClasses
   ]">
      <!-- Urgency indicator bar -->
      <div :class="[
         'absolute top-0 left-0 h-1 transition-all duration-300',
         urgencyBarColor,
         completed ? 'w-0' : 'w-full'
      ]" />

      <div class="p-5">
         <div class="flex items-start gap-4">
            <!-- Checkbox -->
            <div class="flex-shrink-0 pt-1">
               <button @click="$emit('toggle')" :class="[
                  'relative w-5 h-5 rounded-lg border-2 transition-all duration-200',
                  'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  completed
                     ? 'bg-primary-500 border-primary-500'
                     : 'bg-white border-gray-300 hover:border-primary-400'
               ]">
                  <svg v-if="completed" class="w-3 h-3 text-white absolute inset-0 m-auto animate-scale-in" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
               </button>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
               <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                     <!-- Title and Category -->
                     <div class="flex items-center gap-2 mb-1">
                        <span class="text-2xl">{{ categoryIcon }}</span>
                        <h3 :class="[
                           'font-semibold text-gray-900 transition-all duration-200',
                           completed && 'line-through text-gray-500'
                        ]">
                           {{ reminder.title }}
                        </h3>
                     </div>

                     <!-- Description -->
                     <p v-if="reminder.description" :class="[
                        'text-sm text-gray-600 mt-1 line-clamp-2',
                        completed && 'line-through'
                     ]">
                        {{ reminder.description }}
                     </p>

                     <!-- Date and Time -->
                     <div class="flex items-center gap-4 mt-3">
                        <div class="flex items-center gap-1.5 text-sm text-gray-500">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                 d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                           <span>{{ formattedDate }}</span>
                        </div>

                        <span v-if="!completed" :class="[
                           'badge',
                           `badge-${urgencyColor}`
                        ]">
                           {{ urgencyLabel }}
                        </span>
                     </div>
                  </div>

                  <!-- Actions -->
                  <div
                     class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                     <button @click="$emit('edit')"
                        class="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        title="Editar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                     </button>
                     <button @click="$emit('delete')"
                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Eliminar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- Completion animation overlay -->
      <transition name="fade">
         <div v-if="showCompletionAnimation"
            class="absolute inset-0 bg-primary-500/10 flex items-center justify-center pointer-events-none">
            <div class="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center animate-scale-in">
               <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
               </svg>
            </div>
         </div>
      </transition>
   </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatDate, getUrgencyLevel, getUrgencyColor, getUrgencyLabel } from '../utils/dateHelpers';

const props = defineProps({
   reminder: {
      type: Object,
      required: true
   }
});

const emit = defineEmits(['toggle', 'edit', 'delete']);

const showCompletionAnimation = ref(false);
const completed = computed(() => props.reminder.completed);

const categoryIcon = computed(() => {
   // Buscar la categoría por nombre para obtener su icono
   if (props.reminder.category) {
      // Para mantener compatibilidad, mapear nombres conocidos a iconos
      const iconMap = {
         'Examen': '📚',
         'Tarea': '📝',
         'Presentación': '🎤',
         'Reunión': '👥'
      };
      return iconMap[props.reminder.category] || '📌';
   }
   return '📌';
});

const formattedDate = computed(() => {
   return formatDate(props.reminder.date);
});

const urgencyLevel = computed(() => {
   if (completed.value) return 'normal';
   return getUrgencyLevel(props.reminder.date);
});

const urgencyColor = computed(() => {
   return getUrgencyColor(urgencyLevel.value);
});

const urgencyLabel = computed(() => {
   return getUrgencyLabel(urgencyLevel.value);
});

const urgencyClasses = computed(() => {
   if (completed.value) return '';

   const classes = {
      overdue: 'border-l-4 border-l-red-500',
      urgent: 'border-l-4 border-l-red-400',
      soon: 'border-l-4 border-l-amber-400',
      normal: ''
   };

   return classes[urgencyLevel.value] || '';
});

const urgencyBarColor = computed(() => {
   const colors = {
      overdue: 'bg-gradient-to-r from-red-500 to-red-400',
      urgent: 'bg-gradient-to-r from-red-400 to-orange-400',
      soon: 'bg-gradient-to-r from-amber-400 to-yellow-400',
      normal: 'bg-gradient-to-r from-blue-400 to-blue-300'
   };

   return colors[urgencyLevel.value] || colors.normal;
});

// Animation on completion
watch(completed, (newVal, oldVal) => {
   if (newVal && !oldVal) {
      showCompletionAnimation.value = true;
      setTimeout(() => {
         showCompletionAnimation.value = false;
      }, 600);
   }
});
</script>

<style scoped>
.line-clamp-2 {
   display: -webkit-box;
   -webkit-line-clamp: 2;
   line-clamp: 2;
   -webkit-box-orient: vertical;
   overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
}
</style>