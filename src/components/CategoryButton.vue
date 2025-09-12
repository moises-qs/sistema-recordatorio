<template>
  <button @click="$emit('open')" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 transition">
    <span>➕</span> Categorías
  </button>
</template>

<script setup>
// No logic needed, emits 'open' event
</script>

<style scoped>
</style>
