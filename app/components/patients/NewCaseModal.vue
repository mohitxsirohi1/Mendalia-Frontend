<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-heading font-semibold text-gray-900">Create New Case</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <!-- Patient Info -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-mendalia-green/10 rounded-lg flex items-center justify-center">
            <span class="text-mendalia-green font-medium text-sm">
              {{ patient?.name.split(' ').map(n => n[0]).join('') }}
            </span>
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ patient?.name }}</p>
            <p class="text-sm text-gray-500">{{ patient?.age }}{{ patient?.sex === 'Male' ? 'M' : 'F' }} • {{ patient?.id }}</p>
          </div>
        </div>
      </div>

      <!-- Modal Content -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Case Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Case Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Chest Pain Assessment, Follow-up Visit"
          />
        </div>

        <!-- Case Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Brief Description *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            required
            class="input-field resize-none"
            placeholder="Brief description of the case or chief complaint"
          ></textarea>
        </div>

        <!-- Case Type -->
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
            Case Type
          </label>
          <select id="type" v-model="form.type" class="input-field">
            <option value="Initial Assessment">Initial Assessment</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Emergency">Emergency</option>
            <option value="Routine Check">Routine Check</option>
            <option value="Specialist Consultation">Specialist Consultation</option>
          </select>
        </div>

        <!-- Priority Level -->
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </label>
          <select id="priority" v-model="form.priority" class="input-field">
            <option value="Low">Low Priority</option>
            <option value="Normal" selected>Normal Priority</option>
            <option value="High">High Priority</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Initial Notes
            <span class="text-gray-500 font-normal">(Optional)</span>
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="2"
            class="input-field resize-none"
            placeholder="Any preliminary notes or observations"
          ></textarea>
        </div>

        <!-- Modal Actions -->
        <div class="flex items-center justify-end space-x-3 pt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="!isFormValid"
          >
            <Icon name="lucide:plus" class="w-4 h-4 mr-2 inline" />
            Create Case
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  patient: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

// Form data
const form = ref({
  title: '',
  description: '',
  type: 'Initial Assessment',
  priority: 'Normal',
  notes: ''
})

// Computed
const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.description.trim()
})

// Methods
const handleSubmit = () => {
  if (isFormValid.value) {
    emit('save', { ...form.value })
  }
}

// Close modal on escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      emit('close')
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Auto-focus on title field
nextTick(() => {
  const titleInput = document.getElementById('title')
  if (titleInput) {
    titleInput.focus()
  }
})
</script>