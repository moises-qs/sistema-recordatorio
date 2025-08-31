<template>
   <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div v-for="stat in statsData" :key="stat.label"
         class="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200 group">
         <div class="flex items-center justify-between mb-2">
            <div :class="[
               'w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110',
               stat.bgColor
            ]">
               <svg v-if="stat.icon === 'total'" class="w-5 h-5" :class="stat.iconColor" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
               </svg>
               <svg v-else-if="stat.icon === 'pending'" class="w-5 h-5" :class="stat.iconColor" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <svg v-else-if="stat.icon === 'completed'" class="w-5 h-5" :class="stat.iconColor" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <svg v-else-if="stat.icon === 'urgent'" class="w-5 h-5" :class="stat.iconColor" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <span class="text-2xl font-bold transition-all duration-200" :class="stat.valueColor">
               {{ stat.value }}
            </span>
         </div>
         <p class="text-sm text-gray-600">{{ stat.label }}</p>
         <div class="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div :class="[
               'h-full transition-all duration-500',
               stat.progressColor
            ]" :style="{ width: `${stat.progress}%` }" />
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

const statsData = computed(() => [
   {
      label: 'Total',
      value: props.stats.total,
      icon: 'total',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-gray-900',
      progressColor: 'bg-blue-500',
      progress: 100
   },
   {
      label: 'Pendientes',
      value: props.stats.pending,
      icon: 'pending',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      valueColor: 'text-amber-700',
      progressColor: 'bg-amber-500',
      progress: props.stats.total ? (props.stats.pending / props.stats.total) * 100 : 0
   },
   {
      label: 'Completados',
      value: props.stats.completed,
      icon: 'completed',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700',
      progressColor: 'bg-emerald-500',
      progress: props.stats.total ? (props.stats.completed / props.stats.total) * 100 : 0
   },
   {
      label: 'Urgentes',
      value: props.stats.urgent,
      icon: 'urgent',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      valueColor: 'text-red-700',
      progressColor: 'bg-red-500',
      progress: props.stats.pending ? (props.stats.urgent / props.stats.pending) * 100 : 0
   }
]);
</script>