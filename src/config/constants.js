/**
 * Archivo de constantes centralizadas para el sistema de recordatorios
 * Organizado por categorías lógicas para facilitar el mantenimiento
 */

// ===========================
// CONFIGURACIÓN DE FECHA Y TIEMPO
// ===========================

export const DATE_TIME_CONFIG = {
   // Formatos de localización
   LOCALE: 'es-ES',
   TIME_FORMAT: { hour: '2-digit', minute: '2-digit' },
   DATE_FORMAT: {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
   },
   GROUP_DATE_FORMAT: {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
   },

   // Umbrales de tiempo (en horas)
   URGENCY_THRESHOLDS: {
      URGENT_HOURS: 24,
      SOON_HOURS: 72
   },

   // Conversiones de tiempo
   TIME_CONVERSIONS: {
      MILLISECONDS_PER_HOUR: 1000 * 60 * 60,
      MINUTES_PER_HOUR: 60,
      SECONDS_PER_MINUTE: 60,
      MILLISECONDS_PER_MINUTE: 1000 * 60
   }
};

// ===========================
// NIVELES DE URGENCIA
// ===========================

export const URGENCY_LEVELS = {
   OVERDUE: 'overdue',
   URGENT: 'urgent',
   SOON: 'soon',
   NORMAL: 'normal'
};

export const URGENCY_COLORS = {
   [URGENCY_LEVELS.OVERDUE]: 'danger',
   [URGENCY_LEVELS.URGENT]: 'danger',
   [URGENCY_LEVELS.SOON]: 'warning',
   [URGENCY_LEVELS.NORMAL]: 'info'
};

export const URGENCY_LABELS = {
   [URGENCY_LEVELS.OVERDUE]: 'Vencido',
   [URGENCY_LEVELS.URGENT]: 'Urgente',
   [URGENCY_LEVELS.SOON]: 'Próximo',
   [URGENCY_LEVELS.NORMAL]: 'Pendiente'
};

// ===========================
// ETIQUETAS DE FECHA RELATIVA
// ===========================

export const RELATIVE_DATE_LABELS = {
   TODAY: 'Hoy',
   TOMORROW: 'Mañana',
   OVERDUE: 'Vencidos'
};

// ===========================
// TIPOS DE RECORDATORIO
// ===========================

export const REMINDER_TYPES = [
   {
      value: 'exam',
      label: 'Examen',
      icon: '📚'
   },
   {
      value: 'task',
      label: 'Tarea',
      icon: '📝'
   },
   {
      value: 'presentation',
      label: 'Presentación',
      icon: '🎤'
   },
   {
      value: 'meeting',
      label: 'Reunión',
      icon: '👥'
   }
];

export const DEFAULT_REMINDER_TYPE = 'task';

// ===========================
// VALIDACIÓN DE FORMULARIOS
// ===========================

export const VALIDATION_RULES = {
   TITLE: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 100,
      REQUIRED: true,
      REGEX: /[a-zA-Z0-9]/  // Debe contener al menos una letra o número
   },

   DESCRIPTION: {
      MAX_LENGTH: 500,
      REQUIRED: false
   },

   DATE: {
      MIN_FUTURE_MINUTES: 1,
      MAX_FUTURE_YEARS: 5,
      REQUIRED: true
   }
};

// ===========================
// MENSAJES DE VALIDACIÓN
// ===========================

export const VALIDATION_MESSAGES = {
   TITLE: {
      REQUIRED: 'El título es obligatorio',
      EMPTY: 'El título no puede estar vacío o contener solo espacios',
      MIN_LENGTH: `El título debe tener al menos ${VALIDATION_RULES.TITLE.MIN_LENGTH} caracteres`,
      MAX_LENGTH: `El título no puede exceder ${VALIDATION_RULES.TITLE.MAX_LENGTH} caracteres`,
      INVALID_CHARS: 'El título debe contener al menos una letra o número'
   },

   DESCRIPTION: {
      MAX_LENGTH: `La descripción no puede exceder ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} caracteres`
   },

   DATE: {
      REQUIRED: 'La fecha y hora son obligatorias',
      INVALID: 'La fecha seleccionada no es válida',
      PAST: `La fecha debe ser al menos ${VALIDATION_RULES.DATE.MIN_FUTURE_MINUTES} minuto en el futuro`,
      TOO_FUTURE: `La fecha no puede ser más de ${VALIDATION_RULES.DATE.MAX_FUTURE_YEARS} años en el futuro`
   }
};

// ===========================
// INFORMACIÓN DE URGENCIA EN FORMULARIO
// ===========================

export const URGENCY_INFO_MAP = {
   [URGENCY_LEVELS.URGENT]: {
      message: 'Este recordatorio es urgente (menos de 24 horas)',
      bgClass: 'bg-red-50 border border-red-200',
      textClass: 'text-red-700'
   },
   [URGENCY_LEVELS.SOON]: {
      message: 'Este recordatorio es próximo (menos de 3 días)',
      bgClass: 'bg-amber-50 border border-amber-200',
      textClass: 'text-amber-700'
   },
   [URGENCY_LEVELS.NORMAL]: {
      message: 'Tienes tiempo suficiente para prepararte',
      bgClass: 'bg-blue-50 border border-blue-200',
      textClass: 'text-blue-700'
   }
};

// ===========================
// ETIQUETAS DE INTERFAZ
// ===========================

export const UI_LABELS = {
   MODAL: {
      NEW_TITLE: 'Nuevo Recordatorio',
      EDIT_TITLE: 'Editar Recordatorio',
      CANCEL: 'Cancelar',
      CREATE: 'Crear',
      SAVE: 'Guardar'
   },

   FORM: {
      TITLE_LABEL: 'Título del recordatorio *',
      TITLE_PLACEHOLDER: 'Ej: Examen de Cálculo II',
      TITLE_HELPER: `Mínimo ${VALIDATION_RULES.TITLE.MIN_LENGTH} caracteres, máximo ${VALIDATION_RULES.TITLE.MAX_LENGTH} caracteres`,

      DESCRIPTION_LABEL: 'Descripción (opcional)',
      DESCRIPTION_PLACEHOLDER: 'Añade detalles importantes...',
      DESCRIPTION_HELPER: `Máximo ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} caracteres`,

      TYPE_LABEL: 'Tipo de recordatorio',

      DATE_LABEL: 'Fecha y hora *',
      DATE_HELPER: `Debe ser al menos ${VALIDATION_RULES.DATE.MIN_FUTURE_MINUTES} minuto en el futuro`,

      VALIDATION_SUMMARY: 'Por favor, corrige los siguientes errores:'
   },

   STATS: {
      PENDING: 'Pendientes',
      URGENT: 'Urgentes',
      COMPLETED: 'Completados',
      TOTAL: 'Total'
   }
};

// ===========================
// CONFIGURACIÓN DE ESTADÍSTICAS
// ===========================

export const STATS_CONFIG = [
   {
      key: 'pending',
      label: UI_LABELS.STATS.PENDING,
      icon: 'pending',
      filter: 'pending',
      colors: {
         bg: 'bg-amber-100',
         icon: 'text-amber-600',
         value: 'text-amber-700',
         progress: 'bg-amber-500',
         ring: 'ring-amber-500'
      }
   },
   {
      key: 'urgent',
      label: UI_LABELS.STATS.URGENT,
      icon: 'urgent',
      filter: 'urgent',
      colors: {
         bg: 'bg-red-100',
         icon: 'text-red-600',
         value: 'text-red-700',
         progress: 'bg-red-500',
         ring: 'ring-red-500'
      }
   },
   {
      key: 'completed',
      label: UI_LABELS.STATS.COMPLETED,
      icon: 'completed',
      filter: 'completed',
      colors: {
         bg: 'bg-emerald-100',
         icon: 'text-emerald-600',
         value: 'text-emerald-700',
         progress: 'bg-emerald-500',
         ring: 'ring-emerald-500'
      }
   },
   {
      key: 'total',
      label: UI_LABELS.STATS.TOTAL,
      icon: 'total',
      filter: 'all',
      colors: {
         bg: 'bg-blue-100',
         icon: 'text-blue-600',
         value: 'text-gray-900',
         progress: 'bg-blue-500',
         ring: 'ring-blue-500'
      }
   }
];

// ===========================
// FILTROS DE FECHA
// ===========================

export const DATE_FILTER_MAP = {
   'today': 1,
   'week': 7,
   'month': 30
};

// ===========================
// CONFIGURACIÓN DE Z-INDEX
// ===========================

export const Z_INDEX = {
   MODAL_BACKDROP: 150,
   MODAL_CONTAINER: 200,
   MODAL_CONTENT: 201
};

// ===========================
// CONFIGURACIÓN DE ANIMACIONES
// ===========================

export const ANIMATION_DURATIONS = {
   MODAL_TRANSITION: '0.3s',
   BUTTON_HOVER: '200',
   CARD_HOVER: '200',
   PROGRESS_BAR: '500'
};

// ===========================
// CONFIGURACIÓN DEL MODAL
// ===========================

export const MODAL_CONFIG = {
   CLASSES: {
      BACKDROP: 'fixed inset-0 bg-black/50 backdrop-blur-sm',
      CONTAINER: 'relative min-h-screen flex items-end sm:items-center justify-center p-0 sm:p-4',
      CONTENT: 'relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl transform transition-all animate-slide-up sm:animate-scale-in'
   }
};
