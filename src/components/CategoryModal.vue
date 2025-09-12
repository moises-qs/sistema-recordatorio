<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
      <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600" @click="$emit('close')">
        <span class="text-xl">&times;</span>
      </button>
      <h2 class="text-lg font-bold mb-4">Gestionar Categorías</h2>
      <form @submit.prevent="handleAdd">
        <div class="flex gap-2 mb-4 items-center">
          <input v-model="newCategory.label" type="text" placeholder="Nombre" class="flex-1 border rounded px-2 py-1" required />
          <IconPicker v-model="newCategory.icon" />
        </div>
        <button type="submit" class="bg-primary-500 text-white px-4 py-1 rounded hover:bg-primary-600">Agregar</button>
      </form>
      <ul class="mt-6 space-y-2">
        <li v-for="cat in categories" :key="cat.value" class="flex items-center gap-2 justify-between bg-gray-50 rounded px-3 py-2">
          <div class="flex items-center gap-2">
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </div>
          <div class="flex gap-1">
            <button @click="startEdit(cat)" class="icon-btn icon-btn-edit" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
              </svg>
            </button>
            <button @click="deleteCategory(cat.value)" class="icon-btn icon-btn-delete" title="Eliminar">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </li>
      </ul>
      <div v-if="editing" class="mt-4 p-3 bg-gray-100 rounded">
        <h3 class="font-semibold mb-2">Editar Categoría</h3>
        <form @submit.prevent="handleEdit">
          <div class="flex gap-2 mb-2 items-center">
            <input v-model="editCategory.label" type="text" class="flex-1 border rounded px-2 py-1" required />
            <IconPicker v-model="editCategory.icon" />
          </div>
          <button type="submit" class="bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 mr-2">Guardar</button>
          <button type="button" @click="cancelEdit" class="text-gray-500">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCategories } from '../composables/useCategories';
import IconPicker from './IconPicker.vue';

const props = defineProps({
  show: Boolean
});
const emit = defineEmits(['close']);

const { categories, addCategory, updateCategory, deleteCategory, loadCategories } = useCategories();

const newCategory = ref({ label: '', icon: '' });
const editing = ref(false);
const editCategory = ref({ value: '', label: '', icon: '' });

function handleAdd() {
  if (!newCategory.value.label.trim() || !newCategory.value.icon.trim()) return;
  const value = newCategory.value.label.toLowerCase().replace(/\s+/g, '-');
  addCategory({ value, label: newCategory.value.label, icon: newCategory.value.icon });
  newCategory.value = { label: '', icon: '' };
}

function startEdit(cat) {
  editing.value = true;
  editCategory.value = { ...cat };
}

function handleEdit() {
  updateCategory(editCategory.value.value, {
    label: editCategory.value.label,
    icon: editCategory.value.icon
  });
  editing.value = false;
}

function cancelEdit() {
  editing.value = false;
}

watch(() => props.show, (val) => {
  if (val) loadCategories();
});
</script>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 0.375rem;
  transition: background 0.2s, color 0.2s;
  border: none;
  outline: none;
  background: #f3f4f6; /* Fondo base más visible */
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.03);
}
.icon-btn-edit {
  color: #2563eb;
  background: #dbeafe;
}
.icon-btn-edit:hover {
  background: #2563eb;
  color: #fff;
}
.icon-btn-delete {
  color: #dc2626;
  background: #fee2e2;
}
.icon-btn-delete:hover {
  background: #dc2626;
  color: #fff;
}
</style>
