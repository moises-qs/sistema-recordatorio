<template>
	<Teleport to="body">
		<Transition name="modal">
			<div v-if="isOpen" class="fixed inset-0 z-[150] overflow-y-auto" @click.self="close">
				<!-- Backdrop -->
				<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]" @click="close" />

				<!-- Modal -->
				<div class="relative min-h-screen flex items-end sm:items-center justify-center p-0 sm:p-4 z-[200]">
					<div
						class="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl transform transition-all animate-slide-up sm:animate-scale-in z-[201]"
						@click.stop>
						<!-- Header -->
						<div class="flex items-center justify-between p-6 border-b border-gray-100">
							<h2 class="text-xl font-bold text-gray-900">
								{{ editMode ? 'Editar Recordatorio' : 'Nuevo Recordatorio' }}
							</h2>
							<button @click="close" class="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
								<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<!-- Form -->
						<form @submit.prevent="handleSubmit" class="p-6 space-y-5">
							<!-- Title -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Título del recordatorio *
								</label>
								<input v-model="formData.title" type="text" required placeholder="Ej: Examen de Cálculo II"
									class="input-field" :class="{ 'ring-2 ring-red-500 border-red-500': errors.title }"
									@input="errors.title = ''" @blur="errors.title = validateTitle(formData.title)" />
								<p v-if="errors.title" class="mt-1 text-xs text-red-500">
									{{ errors.title }}
								</p>
								<p v-else class="mt-1 text-xs text-gray-500">
									Mínimo 3 caracteres, máximo 100 caracteres
								</p>
							</div>

							<!-- Description -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Descripción (opcional)
								</label>
								<textarea v-model="formData.description" rows="2" placeholder="Añade detalles importantes..."
									class="input-field resize-none" :class="{ 'ring-2 ring-red-500 border-red-500': errors.description }"
									@input="errors.description = ''" @blur="errors.description = validateDescription(formData.description)" />
								<div class="flex justify-between mt-1">
									<p v-if="errors.description" class="text-xs text-red-500">
										{{ errors.description }}
									</p>
									<p v-else class="text-xs text-gray-500">
										Máximo 500 caracteres
									</p>
									<p class="text-xs text-gray-400">
										{{ (formData.description || '').length }}/500
									</p>
								</div>
							</div>

							<!-- Type -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Tipo de recordatorio
								</label>
								<div class="grid grid-cols-2 gap-3">
									<button v-for="type in reminderTypes" :key="type.value" type="button"
										@click="formData.type = type.value" :class="[
											'flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200',
											formData.type === type.value
												? 'border-primary-500 bg-primary-50 text-primary-700'
												: 'border-gray-200 hover:border-gray-300 text-gray-600'
										]">
										<span class="text-lg">{{ type.icon }}</span>
										<span class="font-medium text-sm">{{ type.label }}</span>
									</button>
								</div>
							</div>

							<!-- Date and Time -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Fecha y hora *
								</label>
								<input v-model="formData.date" type="datetime-local" required :min="minDateTime"
									class="input-field" :class="{ 'ring-2 ring-red-500 border-red-500': errors.date }"
									@input="errors.date = ''" @blur="errors.date = validateDate(formData.date)" />
								<p v-if="errors.date" class="mt-1 text-xs text-red-500">
									{{ errors.date }}
								</p>
								<p v-else class="mt-1 text-xs text-gray-500">
									Debe ser al menos 1 minuto en el futuro
								</p>
							</div>

							<!-- Priority indicator -->
							<div v-if="urgencyInfo" class="p-4 rounded-xl" :class="urgencyInfo.bgClass">
								<div class="flex items-center gap-2">
									<svg class="w-5 h-5" :class="urgencyInfo.textClass" fill="none" stroke="currentColor"
										viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
									<span class="text-sm font-medium" :class="urgencyInfo.textClass">
										{{ urgencyInfo.message }}
									</span>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex gap-3 pt-2">
								<button type="button" @click="close" class="btn-secondary flex-1">
									Cancelar
								</button>
								<button type="submit" :disabled="!isFormValid"
									:class="[
										'btn-primary flex-1 transition-all duration-200',
										!isFormValid 
											? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' 
											: 'hover:shadow-lg transform hover:scale-[1.02]'
									]">
									{{ editMode ? 'Guardar' : 'Crear' }}
								</button>
							</div>
							
							<!-- Form validation summary -->
							<div v-if="Object.values(errors).some(error => error)" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
								<p class="text-sm text-red-700 font-medium mb-1">
									Por favor, corrige los siguientes errores:
								</p>
								<ul class="text-xs text-red-600 space-y-1">
									<li v-if="errors.title">• {{ errors.title }}</li>
									<li v-if="errors.description">• {{ errors.description }}</li>
									<li v-if="errors.date">• {{ errors.date }}</li>
								</ul>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { getUrgencyLevel } from '../utils/dateHelpers';

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false
	},
	editReminder: {
		type: Object,
		default: null
	}
});

const emit = defineEmits(['close', 'submit']);

const reminderTypes = [
	{ value: 'exam', label: 'Examen', icon: '📚' },
	{ value: 'task', label: 'Tarea', icon: '📝' },
	{ value: 'presentation', label: 'Presentación', icon: '🎤' },
	{ value: 'meeting', label: 'Reunión', icon: '👥' }
];

const formData = ref({
	title: '',
	description: '',
	type: 'task',
	date: ''
});

const errors = ref({
	title: '',
	description: '',
	date: ''
});

const editMode = computed(() => !!props.editReminder);

const minDateTime = computed(() => {
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	return now.toISOString().slice(0, 16);
});

const isFormValid = computed(() => {
	return validateTitle(formData.value.title) === '' && 
		   validateDate(formData.value.date) === '';
});

/**
 * Valida el título del recordatorio
 * @param {string} title - Título a validar
 * @returns {string} Mensaje de error o cadena vacía si es válido
 */
const validateTitle = (title) => {
	if (!title || typeof title !== 'string') {
		return 'El título es obligatorio';
	}
	
	const trimmedTitle = title.trim();
	
	if (trimmedTitle.length === 0) {
		return 'El título no puede estar vacío o contener solo espacios';
	}
	
	if (trimmedTitle.length < 3) {
		return 'El título debe tener al menos 3 caracteres';
	}
	
	if (trimmedTitle.length > 100) {
		return 'El título no puede exceder 100 caracteres';
	}
	
	// Verificar que no contenga solo caracteres especiales
	const hasAlphanumeric = /[a-zA-Z0-9]/.test(trimmedTitle);
	if (!hasAlphanumeric) {
		return 'El título debe contener al menos una letra o número';
	}
	
	return '';
};

/**
 * Valida la descripción del recordatorio
 * @param {string} description - Descripción a validar
 * @returns {string} Mensaje de error o cadena vacía si es válido
 */
const validateDescription = (description) => {
	if (!description) return '';
	
	const trimmedDescription = description.trim();
	
	if (trimmedDescription.length > 500) {
		return 'La descripción no puede exceder 500 caracteres';
	}
	
	return '';
};

/**
 * Valida la fecha del recordatorio
 * @param {string} date - Fecha a validar
 * @returns {string} Mensaje de error o cadena vacía si es válido
 */
const validateDate = (date) => {
	if (!date) {
		return 'La fecha y hora son obligatorias';
	}
	
	const selectedDate = new Date(date);
	const now = new Date();
	
	// Verificar que la fecha sea válida
	if (isNaN(selectedDate.getTime())) {
		return 'La fecha seleccionada no es válida';
	}
	
	// Verificar que la fecha sea futura (al menos 1 minuto)
	const oneMinuteFromNow = new Date(now.getTime() + 60000);
	if (selectedDate <= oneMinuteFromNow) {
		return 'La fecha debe ser al menos 1 minuto en el futuro';
	}
	
	// Verificar que la fecha no sea demasiado lejana (máximo 5 años)
	const fiveYearsFromNow = new Date();
	fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
	if (selectedDate > fiveYearsFromNow) {
		return 'La fecha no puede ser más de 5 años en el futuro';
	}
	
	return '';
};

/**
 * Valida todos los campos del formulario
 * @returns {boolean} true si todos los campos son válidos
 */
const validateForm = () => {
	const titleError = validateTitle(formData.value.title);
	const descriptionError = validateDescription(formData.value.description);
	const dateError = validateDate(formData.value.date);
	
	errors.value = {
		title: titleError,
		description: descriptionError,
		date: dateError
	};
	
	return !titleError && !descriptionError && !dateError;
};

const urgencyInfo = computed(() => {
	if (!formData.value.date) return null;

	const urgency = getUrgencyLevel(formData.value.date);

	const infoMap = {
		urgent: {
			message: 'Este recordatorio es urgente (menos de 24 horas)',
			bgClass: 'bg-red-50 border border-red-200',
			textClass: 'text-red-700'
		},
		soon: {
			message: 'Este recordatorio es próximo (menos de 3 días)',
			bgClass: 'bg-amber-50 border border-amber-200',
			textClass: 'text-amber-700'
		},
		normal: {
			message: 'Tienes tiempo suficiente para prepararte',
			bgClass: 'bg-blue-50 border border-blue-200',
			textClass: 'text-blue-700'
		}
	};

	return infoMap[urgency] || null;
});

const handleSubmit = () => {
	// Limpiar espacios en blanco al inicio y final
	formData.value.title = formData.value.title?.trim() || '';
	formData.value.description = formData.value.description?.trim() || '';
	
	// Validar formulario completo
	if (!validateForm()) {
		return;
	}
	
	// Si llegamos aquí, todos los campos son válidos
	emit('submit', { ...formData.value });
	close();
};

const close = () => {
	emit('close');
	resetForm();
};

const resetForm = () => {
	formData.value = {
		title: '',
		description: '',
		type: 'task',
		date: ''
	};
	errors.value = {
		title: '',
		description: '',
		date: ''
	};
};

// Watch for edit mode
watch(() => props.editReminder, (newVal) => {
	if (newVal) {
		formData.value = {
			title: newVal.title || '',
			description: newVal.description || '',
			type: newVal.type || 'task',
			date: newVal.date ? new Date(newVal.date).toISOString().slice(0, 16) : ''
		};
	} else {
		resetForm();
	}
}, { immediate: true });

// Set default date to next hour when opening for new reminder
watch(() => props.isOpen, (newVal) => {
	if (newVal && !editMode.value) {
		const nextHour = new Date();
		nextHour.setHours(nextHour.getHours() + 1);
		nextHour.setMinutes(0);
		nextHour.setSeconds(0);
		nextHour.setMinutes(nextHour.getMinutes() - nextHour.getTimezoneOffset());
		formData.value.date = nextHour.toISOString().slice(0, 16);
	}
});

// Validación en tiempo real para el título
watch(() => formData.value.title, (newVal) => {
	if (errors.value.title && newVal) {
		errors.value.title = validateTitle(newVal);
	}
});

// Validación en tiempo real para la descripción
watch(() => formData.value.description, (newVal) => {
	if (errors.value.description && newVal !== undefined) {
		errors.value.description = validateDescription(newVal);
	}
});

// Validación en tiempo real para la fecha
watch(() => formData.value.date, (newVal) => {
	if (errors.value.date && newVal) {
		errors.value.date = validateDate(newVal);
	}
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
	transition: transform 0.3s ease;
}

.modal-enter-from .relative {
	transform: translateY(100%);
}

.modal-leave-to .relative {
	transform: translateY(100%);
}

@media (min-width: 640px) {
	.modal-enter-from .relative {
		transform: scale(0.95) translateY(0);
	}

	.modal-leave-to .relative {
		transform: scale(0.95) translateY(0);
	}
}
</style>