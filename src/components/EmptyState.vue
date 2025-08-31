<template>
   <div class="flex flex-col items-center justify-center py-12 px-4">
      <div class="relative mb-6">
         <div
            class="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center animate-pulse-soft">
            <svg class="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
         </div>
         <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
            <span class="text-white text-lg">✨</span>
         </div>
      </div>

      <h3 class="text-xl font-bold text-gray-900 mb-2">
         {{ title }}
      </h3>

      <p class="text-gray-500 text-center max-w-sm mb-6">
         {{ message }}
      </p>

      <button v-if="showButton" @click="$emit('action')" class="btn-primary flex items-center gap-2">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
         </svg>
         {{ buttonText }}
      </button>
   </div>
</template>

<script setup>
defineProps({
   title: {
      type: String,
      default: 'No hay recordatorios'
   },
   message: {
      type: String,
      default: 'Comienza creando tu primer recordatorio para mantenerte organizado'
   },
   buttonText: {
      type: String,
      default: 'Crear recordatorio'
   },
   showButton: {
      type: Boolean,
      default: true
   }
});

defineEmits(['action']);
</script>