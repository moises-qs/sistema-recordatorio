<template>
   <div class="space-y-4">
      <!-- Search Bar -->
      <div class="relative">
         <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
         </div>
         <input :value="searchQuery" type="text" placeholder="Buscar recordatorios..."
            class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            @input="$emit('update:searchQuery', $event.target.value)" />
         <button v-if="searchQuery" @click="clearSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
         </button>
      </div>

      <!-- Category Filter - Horizontal Scroll -->
      <div class="relative">
         <div class="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
            <button v-for="category in categories" :key="category.value"
               @click="$emit('update:selectedCategory', category.value)" :class="[
                  'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  selectedCategory === category.value
                     ? 'bg-primary-500 text-white shadow-md'
                     : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
               ]">
               <span>{{ category.icon }}</span>
               {{ category.label }}
            </button>
         </div>
         <!-- Fade effect for scroll indication -->
         <div
            class="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none">
         </div>
      </div>

      <!-- Quick Filters -->
      <div class="flex flex-wrap gap-2">
         <button v-for="filter in quickFilters" :key="filter.value"
            @click="$emit('update:selectedFilter', filter.value)" :class="[
               'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
               selectedFilter === filter.value
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]">
            <svg v-if="filter.icon" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="filter.iconPath" />
            </svg>
            {{ filter.label }}
         </button>
      </div>

      <!-- Status Toggle -->
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
         <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span class="text-sm font-medium text-gray-700">
               {{ showOnlyPending ? 'Solo pendientes' : 'Todos los recordatorios' }}
            </span>
         </div>
         <button @click="$emit('update:showOnlyPending', !showOnlyPending)" :class="[
            'relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            showOnlyPending ? 'bg-primary-500' : 'bg-gray-200'
         ]">
            <span :class="[
               'inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200',
               showOnlyPending ? 'translate-x-6' : 'translate-x-1'
            ]" />
         </button>
      </div>

      <!-- Active Filters Summary -->
      <div v-if="hasActiveFilters" class="flex items-center justify-between pt-2 border-t border-gray-100">
         <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">Activos:</span>
            <div class="flex flex-wrap gap-1">
               <span v-if="searchQuery"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  "{{ searchQuery.substring(0, 10) }}{{ searchQuery.length > 10 ? '...' : '' }}"
               </span>
               <span v-if="selectedCategory !== 'all'"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {{ getCategoryLabel(selectedCategory) }}
               </span>
            </div>
         </div>
         <button @click="clearAllFilters" class="text-xs text-primary-600 hover:text-primary-700 font-medium">
            Limpiar
         </button>
      </div>
   </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
   searchQuery: {
      type: String,
      default: ''
   },
   selectedCategory: {
      type: String,
      default: 'all'
   },
   selectedFilter: {
      type: String,
      default: 'all'
   },
   showOnlyPending: {
      type: Boolean,
      default: true
   }
});

const emit = defineEmits([
   'update:searchQuery',
   'update:selectedCategory',
   'update:selectedFilter',
   'update:showOnlyPending'
]);

const categories = [
   { value: 'all', label: 'Todos', icon: '📋' },
   { value: 'exam', label: 'Exámenes', icon: '📚' },
   { value: 'task', label: 'Tareas', icon: '📝' },
   { value: 'presentation', label: 'Presentaciones', icon: '🎤' },
   { value: 'meeting', label: 'Reuniones', icon: '👥' }
];

const quickFilters = [
   {
      value: 'today',
      label: 'Hoy',
      icon: true,
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
   },
   {
      value: 'week',
      label: 'Esta semana',
      icon: true,
      iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
   },
   {
      value: 'all',
      label: 'Todas',
      icon: false
   }
];

const hasActiveFilters = computed(() => {
   return props.searchQuery ||
      props.selectedCategory !== 'all' ||
      props.selectedFilter !== 'all';
});

const getCategoryLabel = (value) => {
   const category = categories.find(c => c.value === value);
   return category ? category.label : '';
};

const clearSearch = () => {
   emit('update:searchQuery', '');
};

const clearAllFilters = () => {
   emit('update:searchQuery', '');
   emit('update:selectedCategory', 'all');
   emit('update:selectedFilter', 'all');
};
</script>

<style scoped>
.scrollbar-hide {
   -ms-overflow-style: none;
   scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
   display: none;
}
</style>