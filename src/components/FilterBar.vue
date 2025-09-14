<template>
   <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
      <!-- Search Bar -->
      <div class="relative">
         <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
         </div>
         <input :value="searchQuery" type="text" placeholder="Buscar recordatorios..."
            class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            @input="$emit('update:searchQuery', $event.target.value)" />
         <button v-if="searchQuery" @click="clearSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
         </button>
      </div>

      <!-- Filter Pills -->
      <div class="flex flex-wrap gap-2">
         <!-- Category Filters -->
         <div class="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button v-for="category in categories" :key="category.value"
               @click="$emit('update:selectedCategory', category.value)" :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  selectedCategory === category.value
                     ? 'bg-white text-primary-600 shadow-sm'
                     : 'text-gray-600 hover:text-gray-900'
               ]">
               <span class="mr-1.5">{{ category.icon }}</span>
               {{ category.label }}
            </button>
         </div>

         <!-- Date Range Filter -->
         <div class="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button v-for="filter in dateFilters" :key="filter.value"
               @click="$emit('update:selectedFilter', filter.value)" :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  selectedFilter === filter.value
                     ? 'bg-white text-primary-600 shadow-sm'
                     : 'text-gray-600 hover:text-gray-900'
               ]">
               {{ filter.label }}
            </button>
         </div>
      </div>

      <!-- Active Filters Summary -->
      <div v-if="hasActiveFilters" class="flex items-center justify-between pt-2 border-t border-gray-100">
         <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Filtros activos:</span>
            <div class="flex flex-wrap gap-1">
               <span v-if="searchQuery"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                  Búsqueda: "{{ searchQuery }}"
               </span>
               <span v-if="selectedCategory !== 'all'"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                  {{ getCategoryLabel(selectedCategory) }}
               </span>
               <span v-if="selectedFilter !== 'all'"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                  {{ getFilterLabel(selectedFilter) }}
               </span>
            </div>
         </div>
         <button @click="clearAllFilters" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Limpiar todo
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
   }
});

const emit = defineEmits([
   'update:searchQuery',
   'update:selectedCategory',
   'update:selectedFilter'
]);

const categories = [
   { value: 'all', label: 'Todos', icon: '📋' },
   { value: 'exam', label: 'Exámenes', icon: '📚' },
   { value: 'task', label: 'Tareas', icon: '📝' },
   { value: 'presentation', label: 'Presentaciones', icon: '🎤' },
   { value: 'meeting', label: 'Reuniones', icon: '👥' }
];

const dateFilters = [
   { value: 'all', label: 'Todas las fechas' },
   { value: 'today', label: 'Hoy' },
   { value: 'week', label: 'Esta semana' },
   { value: 'month', label: 'Este mes' }
];

const hasActiveFilters = computed(() => {
   return props.searchQuery ||
      props.selectedCategory !== 'all' ||
      props.selectedFilter !== 'all';
});

const getCategoryLabel = (value) => {
   const category = categories.find(c => c.value === value);
   return category ? `${category.icon} ${category.label}` : '';
};

const getFilterLabel = (value) => {
   const filter = datefilters.find(f => f.value === value);
   return filter ? filter.label : '';
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