export class NotificationManager {

   static requestPermission() {
      if ('Notification' in window && Notification.permission === 'default') {
         return Notification.requestPermission();
      }
      return Promise.resolve(Notification.permission);
   }

   static showNotification(title, options = {}) {
      if ('Notification' in window && Notification.permission === 'granted') {
         const notification = new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options
         });

         setTimeout(() => notification.close(), 5000);
         return notification;
      }
   }

   static scheduleReminder(reminder) {
      const now = new Date();
      const reminderTime = new Date(reminder.date);
      const timeDiff = reminderTime.getTime() - now.getTime();

      if (timeDiff > 0) {
         setTimeout(() => {
            this.showNotification(`📚 ${reminder.title}`, {
               body: `Tu recordatorio programado para ahora`,
               tag: `reminder-${reminder.id}`,
               requireInteraction: true
            });
         }, timeDiff);
      }

      const oneHourBefore = timeDiff - (60 * 60 * 1000);
      if (oneHourBefore > 0) {
         setTimeout(() => {
            this.showNotification(`⏰ Recordatorio próximo`, {
               body: `${reminder.title} en 1 hora`,
               tag: `reminder-preview-${reminder.id}`
            });
         }, oneHourBefore);
      }
   }
}