/**
 * Clase para manejar notificaciones del navegador y recordatorios programados
 * @class NotificationManager
 */
export class NotificationManager {

   /**
    * Solicita permisos de notificación al usuario si aún no se han otorgado
    * @static
    * @returns {Promise<string>} Promise que resuelve con el estado del permiso: 'granted', 'denied', 'default'
    * @example
    * NotificationManager.requestPermission()
    *   .then(permission => {
    *     if (permission === 'granted') console.log('Notificaciones habilitadas');
    *   });
    */
   static requestPermission() {
      if ('Notification' in window && Notification.permission === 'default') {
         return Notification.requestPermission();
      }
      return Promise.resolve(Notification.permission);
   }

   /**
    * Muestra una notificación del navegador si los permisos están concedidos
    * @static
    * @param {string} title - Título de la notificación
    * @param {Object} [options={}] - Opciones adicionales para la notificación
    * @param {string} [options.body] - Cuerpo del mensaje de la notificación
    * @param {string} [options.icon] - URL del icono de la notificación
    * @param {string} [options.tag] - Tag único para identificar la notificación
    * @param {boolean} [options.requireInteraction] - Si requiere interacción del usuario para cerrarse
    * @returns {Notification|undefined} Instancia de la notificación creada o undefined si no se puede mostrar
    * @example
    * NotificationManager.showNotification('Recordatorio', {
    *   body: 'Es hora de estudiar',
    *   requireInteraction: true
    * });
    */
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

   /**
    * Programa notificaciones automáticas para un recordatorio específico
    * Crea dos notificaciones: una exacta en el momento del recordatorio y otra una hora antes
    * @static
    * @param {Object} reminder - Objeto recordatorio con propiedades id, title, date
    * @param {string} reminder.id - ID único del recordatorio
    * @param {string} reminder.title - Título del recordatorio
    * @param {string} reminder.date - Fecha y hora del recordatorio en formato ISO
    * @returns {void} No retorna valor, programa las notificaciones usando setTimeout
    * @example
    * NotificationManager.scheduleReminder({
    *   id: '123',
    *   title: 'Reunión importante',
    *   date: '2024-01-15T14:30:00'
    * });
    * // Programa notificación 1h antes y exacta en el momento
    */
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