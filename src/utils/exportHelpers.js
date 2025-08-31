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

export const exportToCSV = (reminders) => {
   const headers = ['ID', 'Título', 'Descripción', 'Tipo', 'Fecha', 'Completado', 'Fecha de creación'];
   const rows = reminders.map(reminder => [
      reminder.id,
      `"${reminder.title}"`,
      `"${reminder.description || ''}"`,
      reminder.type,
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