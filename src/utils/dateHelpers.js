import { 
   DATE_TIME_CONFIG, 
   RELATIVE_DATE_LABELS,
   URGENCY_LEVELS,
   URGENCY_COLORS,
   URGENCY_LABELS 
} from '../config/constants.js';

/**
 * Formatea una fecha en un formato legible para el usuario en español
 * @param {string} dateString - La fecha en formato string que puede ser parseada por el constructor Date
 * @returns {string} Fecha formateada con texto relativo ('Hoy', 'Mañana') o fecha completa con hora
 * @example
 * formatDate('2024-01-01T15:30:00') // 'Hoy, 15:30' si es hoy
 * formatDate('2024-01-02T10:00:00') // 'Mañana, 10:00' si es mañana
 * formatDate('2024-01-05T14:00:00') // 'vie, 5 ene, 14:00'
 */
export const formatDate = (dateString) => {
   const date = new Date(dateString);
   const now = new Date();
   const tomorrow = new Date(now);
   tomorrow.setDate(tomorrow.getDate() + 1);

   const isToday = date.toDateString() === now.toDateString();
   const isTomorrow = date.toDateString() === tomorrow.toDateString();

   if (isToday) {
      return `${RELATIVE_DATE_LABELS.TODAY}, ${date.toLocaleTimeString(DATE_TIME_CONFIG.LOCALE, DATE_TIME_CONFIG.TIME_FORMAT)}`;
   }

   if (isTomorrow) {
      return `${RELATIVE_DATE_LABELS.TOMORROW}, ${date.toLocaleTimeString(DATE_TIME_CONFIG.LOCALE, DATE_TIME_CONFIG.TIME_FORMAT)}`;
   }

   return date.toLocaleDateString(DATE_TIME_CONFIG.LOCALE, DATE_TIME_CONFIG.DATE_FORMAT);
};

/**
 * Determina el nivel de urgencia de un recordatorio basado en el tiempo restante
 * @param {string} dateString - La fecha del recordatorio en formato string
 * @returns {string} Nivel de urgencia: 'overdue' (vencido), 'urgent' (≤24h), 'soon' (≤72h), 'normal' (>72h)
 * @example
 * getUrgencyLevel('2024-01-01T10:00:00') // 'overdue' si ya pasó
 * getUrgencyLevel('2024-01-02T10:00:00') // 'urgent' si es en las próximas 24h
 * getUrgencyLevel('2024-01-05T10:00:00') // 'normal' si es en más de 72h
 */
export const getUrgencyLevel = (dateString) => {
   const date = new Date(dateString);
   const now = new Date();
   const diffTime = date - now;
   const diffHours = diffTime / DATE_TIME_CONFIG.TIME_CONVERSIONS.MILLISECONDS_PER_HOUR;

   if (diffHours < 0) return URGENCY_LEVELS.OVERDUE;
   if (diffHours <= DATE_TIME_CONFIG.URGENCY_THRESHOLDS.URGENT_HOURS) return URGENCY_LEVELS.URGENT;
   if (diffHours <= DATE_TIME_CONFIG.URGENCY_THRESHOLDS.SOON_HOURS) return URGENCY_LEVELS.SOON;
   return URGENCY_LEVELS.NORMAL;
};

/**
 * Mapea un nivel de urgencia a un color específico para la interfaz de usuario
 * @param {string} urgencyLevel - El nivel de urgencia ('overdue', 'urgent', 'soon', 'normal')
 * @returns {string} Color asociado: 'danger', 'warning', 'info'
 * @example
 * getUrgencyColor('urgent') // 'danger'
 * getUrgencyColor('soon') // 'warning'
 * getUrgencyColor('normal') // 'info'
 */
export const getUrgencyColor = (urgencyLevel) => {
   return URGENCY_COLORS[urgencyLevel] || URGENCY_COLORS[URGENCY_LEVELS.NORMAL];
};

/**
 * Convierte un nivel de urgencia en una etiqueta legible en español
 * @param {string} urgencyLevel - El nivel de urgencia ('overdue', 'urgent', 'soon', 'normal')
 * @returns {string} Etiqueta en español: 'Vencido', 'Urgente', 'Próximo', 'Pendiente'
 * @example
 * getUrgencyLabel('urgent') // 'Urgente'
 * getUrgencyLabel('soon') // 'Próximo'
 * getUrgencyLabel('normal') // 'Pendiente'
 */
export const getUrgencyLabel = (urgencyLevel) => {
   return URGENCY_LABELS[urgencyLevel] || URGENCY_LABELS[URGENCY_LEVELS.NORMAL];
};

/**
 * Ordena un array de recordatorios por fecha y estado de completado
 * @param {Array<Object>} reminders - Array de objetos recordatorio con propiedades 'date' y 'completed'
 * @returns {Array<Object>} Nuevo array ordenado: recordatorios completados al final, el resto por fecha ascendente
 * @example
 * sortByDate([
 *   {id: 1, date: '2024-01-02', completed: false},
 *   {id: 2, date: '2024-01-01', completed: true}
 * ]) // [{id: 2, ...}, {id: 1, ...}] - completados al final
 */
export const sortByDate = (reminders) => {
   return [...reminders].sort((a, b) => {
      if (a.completed !== b.completed) {
         return a.completed ? 1 : -1;
      }
      return new Date(a.date) - new Date(b.date);
   });
};

/**
 * Filtra recordatorios que vencen dentro de un rango de días específico
 * @param {Array<Object>} reminders - Array de objetos recordatorio con propiedad 'date'
 * @param {number} days - Número de días hacia el futuro para filtrar
 * @returns {Array<Object>} Array filtrado con recordatorios que vencen entre hoy y los próximos N días
 * @example
 * filterByDateRange(reminders, 7) // Recordatorios de los próximos 7 días
 * filterByDateRange(reminders, 1) // Solo los de mañana
 */
export const filterByDateRange = (reminders, days) => {
   const now = new Date();
   const futureDate = new Date();
   futureDate.setDate(futureDate.getDate() + days);

   return reminders.filter(reminder => {
      const reminderDate = new Date(reminder.date);
      return reminderDate >= now && reminderDate <= futureDate;
   });
};

/**
 * Agrupa recordatorios por categorías de fecha relativas (Hoy, Mañana, Vencidos, etc.)
 * @param {Array<Object>} reminders - Array de objetos recordatorio con propiedad 'date'
 * @returns {Object} Objeto con claves de categorías de fecha y arrays de recordatorios como valores
 * @example
 * groupByDate(reminders) // {
 *   'Hoy': [...],
 *   'Mañana': [...],
 *   'Vencidos': [...],
 *   'lunes, 15 ene': [...]
 * }
 */
export const groupByDate = (reminders) => {
   const groups = {};
   const now = new Date();
   const tomorrow = new Date(now);
   tomorrow.setDate(tomorrow.getDate() + 1);

   reminders.forEach(reminder => {
      const date = new Date(reminder.date);
      let key;

      if (date.toDateString() === now.toDateString()) {
         key = RELATIVE_DATE_LABELS.TODAY;
      } else if (date.toDateString() === tomorrow.toDateString()) {
         key = RELATIVE_DATE_LABELS.TOMORROW;
      } else if (date < now) {
         key = RELATIVE_DATE_LABELS.OVERDUE;
      } else {
         key = date.toLocaleDateString(DATE_TIME_CONFIG.LOCALE, DATE_TIME_CONFIG.GROUP_DATE_FORMAT);
      }

      if (!groups[key]) {
         groups[key] = [];
      }
      groups[key].push(reminder);
   });

   return groups;
};