import { ref } from 'vue';
import { Category } from '../models/Category.js';

export function useCategories() {
  const categories = ref([]);

  const loadCategories = () => {
    // Asegurar que existan las categorías por defecto
    Category.initializeDefaults();
    // Cargar todas las categorías del modelo
    categories.value = Category.all().map(cat => ({
      value: cat.name.toLowerCase().replace(/\s+/g, '-'), // Para compatibilidad
      label: cat.name,
      icon: cat.icon,
      id: cat.id,
      name: cat.name,
      color: cat.color,
      description: cat.description
    }));
  };

  const addCategory = (categoryData) => {
    // Crear nueva categoría usando el modelo Category
    const category = new Category({
      name: categoryData.label,
      icon: categoryData.icon,
      color: '#95a5a6', // Color por defecto
      description: `Categoría ${categoryData.label}`
    });
    category.save();
    loadCategories();
  };

  const updateCategory = (value, updates) => {
    // Buscar la categoría por value (slug) y actualizarla
    const category = Category.all().find(cat => 
      cat.name.toLowerCase().replace(/\s+/g, '-') === value
    );
    if (category) {
      category.name = updates.label;
      category.icon = updates.icon;
      category.save();
      loadCategories();
    }
  };

  const deleteCategory = (value) => {
    // Buscar y eliminar la categoría
    const category = Category.all().find(cat => 
      cat.name.toLowerCase().replace(/\s+/g, '-') === value
    );
    if (category) {
      category.delete();
      loadCategories();
    }
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
