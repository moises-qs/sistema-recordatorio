import { ref } from 'vue';
import { categoryStorage } from '../utils/localStorage';

export function useCategories() {
  const categories = ref([]);

  const loadCategories = () => {
    categories.value = categoryStorage.getCategories();
  };

  const addCategory = (category) => {
    categoryStorage.addCategory(category);
    loadCategories();
  };

  const updateCategory = (value, updates) => {
    categoryStorage.updateCategory(value, updates);
    loadCategories();
  };

  const deleteCategory = (value) => {
    categoryStorage.deleteCategory(value);
    loadCategories();
  };

  // Inicializar
  loadCategories();

  return {
    categories,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
