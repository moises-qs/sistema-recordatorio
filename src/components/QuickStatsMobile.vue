<template>
   <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div class="grid grid-cols-2 gap-4">
         <!-- Pendientes -->
         <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 bg-amber-100 rounded-xl flex items-center justify-center">
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
         </div>

         <!-- Completados -->
         <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 bg-emerald-100 rounded-xl flex items-center justify-center">
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
         </div>
      </div>

      <!-- Urgentes Badge (solo si hay urgentes) -->
      <div v-if="stats.urgent > 0" class="mt-4 pt-3 border-t border-gray-100">
         <div class="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="text-sm font-medium text-red-700">
               {{ stats.urgent }} urgente{{ stats.urgent > 1 ? 's' : '' }}
            </span>
         </div>
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
   }
});

const pendingProgress = computed(() => {
   if (props.stats.total === 0) return 0;
   return Math.round((props.stats.pending / props.stats.total) * 100);
});

const completedProgress = computed(() => {
   if (props.stats.total === 0) return 0;
   return Math.round((props.stats.completed / props.stats.total) * 100);
});
</script>