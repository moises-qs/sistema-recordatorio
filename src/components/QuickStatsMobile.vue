
<template>
   <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div class="grid grid-cols-2 gap-4">
         <!-- Pendientes -->
         <button @click="handleFilterClick('pending')"
            :class="[
               'relative text-center p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500',
               'hover:bg-amber-50 hover:scale-105 active:scale-95',
               activeFilter === 'pending' 
                  ? 'bg-amber-50 ring-2 ring-amber-500 ring-offset-2 shadow-lg transform scale-105' 
                  : 'hover:shadow-md'
            ]">
            <div class="w-12 h-12 mx-auto mb-2 bg-amber-100 rounded-xl flex items-center justify-center transition-transform duration-200">
               <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p class="text-2xl font-bold text-amber-700">{{ stats.pending }}</p>
            <p class="text-sm text-gray-600">Pendientes</p>
            <div class="mt-2 h-1 bg-gray-100 rounded-full">
               <div class="h-full bg-amber-500 rounded-full transition-all duration-500"
                  :style="{ width: `${pendingProgress}%` }" />
            </div>
            <!-- Indicador de filtro activo -->
            <div v-if="activeFilter === 'pending'" class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>
         </button>

         <!-- Completados -->
         <button @click="handleFilterClick('completed')"
            :class="[
               'relative text-center p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
               'hover:bg-emerald-50 hover:scale-105 active:scale-95',
               activeFilter === 'completed' 
                  ? 'bg-emerald-50 ring-2 ring-emerald-500 ring-offset-2 shadow-lg transform scale-105' 
                  : 'hover:shadow-md'
            ]">
            <div class="w-12 h-12 mx-auto mb-2 bg-emerald-100 rounded-xl flex items-center justify-center transition-transform duration-200">
               <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p class="text-2xl font-bold text-emerald-700">{{ stats.completed }}</p>
            <p class="text-sm text-gray-600">Completados</p>
            <div class="mt-2 h-1 bg-gray-100 rounded-full">
               <div class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  :style="{ width: `${completedProgress}%` }" />
            </div>
            <!-- Indicador de filtro activo -->
            <div v-if="activeFilter === 'completed'" class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
         </button>
      </div>

      <!-- Urgentes Badge (solo si hay urgentes) -->
      <div v-if="stats.urgent > 0" class="mt-4 pt-3 border-t border-gray-100">
         <button @click="handleFilterClick('urgent')"
            :class="[
               'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
               'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
               'hover:bg-red-100 active:scale-95',
               activeFilter === 'urgent' 
                  ? 'bg-red-100 border-2 border-red-500 shadow-lg' 
                  : 'bg-red-50 border border-red-200 hover:border-red-300'
            ]">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="text-sm font-medium text-red-700">
               {{ stats.urgent }} urgente{{ stats.urgent > 1 ? 's' : '' }}
            </span>
         </button>
      </div>

      <!-- Botón para mostrar todos -->
      <div class="mt-4 pt-3 border-t border-gray-100">
         <button @click="handleFilterClick('all')"
            :class="[
               'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
               'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
               'hover:bg-blue-50 active:scale-95',
               activeFilter === 'all' 
                  ? 'bg-blue-100 border-2 border-blue-500 shadow-lg' 
                  : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
            ]">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span class="text-sm font-medium text-blue-700">
               Ver todos ({{ stats.total }})
            </span>
         </button>
      </div>

      <!-- Mensaje motivacional -->
      <div v-if="stats.pending === 0 && stats.completed > 0" class="mt-4 pt-3 border-t border-gray-100">
         <div class="text-center">
            <span class="text-2xl">🎉</span>
            <p class="text-sm text-gray-600 mt-1">¡Todas las tareas completadas!</p>
         </div>
      </div>
   </div>
</template>

<script setup>
import { computed } from 'vue';

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

const pendingProgress = computed(() => {
   if (props.stats.total === 0) return 0;
   return Math.round((props.stats.pending / props.stats.total) * 100);
});

const completedProgress = computed(() => {
   if (props.stats.total === 0) return 0;
   return Math.round((props.stats.completed / props.stats.total) * 100);
});
</script>