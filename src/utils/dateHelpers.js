export const formatDate = (dateString) => {
   const date = new Date(dateString);
   const now = new Date();
   const tomorrow = new Date(now);
   tomorrow.setDate(tomorrow.getDate() + 1);

   const isToday = date.toDateString() === now.toDateString();
   const isTomorrow = date.toDateString() === tomorrow.toDateString();

   if (isToday) {
      return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
   }

   if (isTomorrow) {
      return `Mañana, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
   }

   const options = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
   };

   return date.toLocaleDateString('es-ES', options);
};

export const getUrgencyLevel = (dateString) => {
   const date = new Date(dateString);
   const now = new Date();
   const diffTime = date - now;
   const diffHours = diffTime / (1000 * 60 * 60);

   if (diffHours < 0) return 'overdue';
   if (diffHours <= 24) return 'urgent';
   if (diffHours <= 72) return 'soon';
   return 'normal';
};

export const getUrgencyColor = (urgencyLevel) => {
   const colors = {
      overdue: 'danger',
      urgent: 'danger',
      soon: 'warning',
      normal: 'info'
   };
   return colors[urgencyLevel] || 'info';
};

export const getUrgencyLabel = (urgencyLevel) => {
   const labels = {
      overdue: 'Vencido',
      urgent: 'Urgente',
      soon: 'Próximo',
      normal: 'Pendiente'
   };
   return labels[urgencyLevel] || 'Pendiente';
};

export const sortByDate = (reminders) => {
   return [...reminders].sort((a, b) => {
      if (a.completed !== b.completed) {
         return a.completed ? 1 : -1;
      }
      return new Date(a.date) - new Date(b.date);
   });
};

export const filterByDateRange = (reminders, days) => {
   const now = new Date();
   const futureDate = new Date();
   futureDate.setDate(futureDate.getDate() + days);

   return reminders.filter(reminder => {
      const reminderDate = new Date(reminder.date);
      return reminderDate >= now && reminderDate <= futureDate;
   });
};

export const groupByDate = (reminders) => {
   const groups = {};
   const now = new Date();
   const tomorrow = new Date(now);
   tomorrow.setDate(tomorrow.getDate() + 1);

   reminders.forEach(reminder => {
      const date = new Date(reminder.date);
      let key;

      if (date.toDateString() === now.toDateString()) {
         key = 'Hoy';
      } else if (date.toDateString() === tomorrow.toDateString()) {
         key = 'Mañana';
      } else if (date < now) {
         key = 'Vencidos';
      } else {
         key = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
      }

      if (!groups[key]) {
         groups[key] = [];
      }
      groups[key].push(reminder);
   });

   return groups;
};