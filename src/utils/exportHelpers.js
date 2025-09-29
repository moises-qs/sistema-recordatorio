/**
 * Exporta una lista de recordatorios a un archivo JSON y lo descarga automáticamente
 * @param {Array<Object>} reminders - Array de objetos recordatorio a exportar
 * @returns {void} No retorna valor, inicia la descarga del archivo
 * @example
 * exportToJSON([
 *   {id: 1, title: 'Estudiar', date: '2024-01-01', completed: false}
 * ]); // Descarga archivo: edureminder-backup-2024-01-01.json
 */
export const exportToJSON = (reminders) => {
   const data = {
      exportDate: new Date().toISOString(),
      reminders: reminders,
      version: '1.0'
   };

   const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
   });

   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `edureminder-backup-${new Date().toISOString().split('T')[0]}.json`;
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   URL.revokeObjectURL(url);
};

/**
 * Exporta una lista de recordatorios a un archivo CSV y lo descarga automáticamente
 * @param {Array<Object>} reminders - Array de objetos recordatorio a exportar
 * @returns {void} No retorna valor, inicia la descarga del archivo CSV
 * @example
 * exportToCSV([
 *   {id: 1, title: 'Estudiar', description: 'Matemáticas', type: 'tarea', 
 *    date: '2024-01-01', completed: false, createdAt: '2024-01-01'}
 * ]); // Descarga archivo: edureminder-export-2024-01-01.csv
 */
export const exportToCSV = (reminders) => {
   const headers = ['ID', 'Título', 'Descripción', 'Categoría', 'Fecha', 'Completado', 'Fecha de creación'];
   const rows = reminders.map(reminder => [
      reminder.id,
      `"${reminder.title}"`,
      `"${reminder.description || ''}"`,
      reminder.category,
      reminder.date,
      reminder.completed ? 'Sí' : 'No',
      reminder.createdAt
   ]);

   const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `edureminder-export-${new Date().toISOString().split('T')[0]}.csv`;
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   URL.revokeObjectURL(url);
};

/**
 * Importa recordatorios desde un archivo JSON seleccionado por el usuario
 * @param {File} file - Objeto File del archivo JSON a importar
 * @returns {Promise<Array<Object>>} Promise que resuelve con el array de recordatorios importados
 * @throws {Error} Si el archivo tiene formato inválido o no se puede leer
 * @example
 * importFromJSON(fileInput.files[0])
 *   .then(reminders => console.log('Importados:', reminders))
 *   .catch(error => console.error('Error:', error.message));
 */
export const importFromJSON = (file) => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
         try {
            const data = JSON.parse(e.target.result);
            if (data.reminders && Array.isArray(data.reminders)) {
               resolve(data.reminders);
            } else {
               reject(new Error('Formato de archivo inválido'));
            }
         } catch (error) {
            reject(new Error('Error al leer el archivo JSON'));
         }
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(file);
   });
};