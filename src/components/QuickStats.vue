<template>
   <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <button v-for="stat in statsData" :key="stat.label" @click="handleFilterClick(stat.filter)"
         :class="[
            'relative bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-200 group text-left',
            'hover:shadow-md hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2',
            activeFilter === stat.filter 
               ? 'ring-2 ring-offset-2 shadow-lg transform -translate-y-1' + ' ' + stat.colors.ring
               : 'hover:border-gray-200'
         ]">
         <div class="flex items-center justify-between mb-2">
            <div :class="[
               'w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110',
               stat.colors.bg
            ]">
               <svg v-if="stat.icon === 'total'" class="w-5 h-5" :class="stat.colors.icon" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
               </svg>
               <svg v-else-if="stat.icon === 'pending'" class="w-5 h-5" :class="stat.colors.icon" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <svg v-else-if="stat.icon === 'completed'" class="w-5 h-5" :class="stat.colors.icon" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <svg v-else-if="stat.icon === 'urgent'" class="w-5 h-5" :class="stat.colors.icon" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <span class="text-2xl font-bold transition-all duration-200" :class="stat.colors.value">
               {{ stat.value }}
            </span>
         </div>
         <p class="text-sm text-gray-600">{{ stat.label }}</p>
         <div class="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div :class="[
               'h-full transition-all duration-500',
               stat.colors.progress
            ]" :style="{ width: `${stat.progress}%` }" />
         </div>
         
         <!-- Indicador de filtro activo -->
         <div v-if="activeFilter === stat.filter" class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
      </button>
   </div>
</template>

<script setup>
import { computed } from 'vue';
import { STATS_CONFIG } from '../config/constants';

const props = defineProps({
   stats: {
      type: Object,
      required: true
   },
   activeFilter: {
      type: String,
      default: 'pending'
   }
});

const emit = defineEmits(['filter-change']);

/**
 * Maneja el clic en un botón de filtro
 * @param {string} filter - Tipo de filtro ('all', 'pending', 'completed', 'urgent')
 */
const handleFilterClick = (filter) => {
   emit('filter-change', filter);
};

const statsData = computed(() => STATS_CONFIG.map(config => ({
   ...config,
   value: props.stats[config.key],
   progress: calculateProgress(config.key, props.stats)
})));

/**
 * Calcula el porcentaje de progreso para cada estadística
 * @param {string} key - Clave de la estadística
 * @param {Object} stats - Objeto con todas las estadísticas
 * @returns {number} Porcentaje de progreso
 */
const calculateProgress = (key, stats) => {
   switch (key) {
      case 'pending':
         return stats.total ? (stats.pending / stats.total) * 100 : 0;
      case 'urgent':
         return stats.pending ? (stats.urgent / stats.pending) * 100 : 0;
      case 'completed':
         return stats.total ? (stats.completed / stats.total) * 100 : 0;
      case 'total':
         return 100;
      default:
         return 0;
   }
};
</script>