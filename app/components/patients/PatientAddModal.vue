<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-heading font-semibold text-gray-900">Add New Patient</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Content -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="input-field"
            placeholder="Enter patient's full name"
          />
        </div>

        <!-- Age and Sex -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="age" class="block text-sm font-medium text-gray-700 mb-2">
              Age *
            </label>
            <input
              id="age"
              v-model.number="form.age"
              type="number"
              min="0"
              max="150"
              required
              class="input-field"
              placeholder="Age"
            />
          </div>
          <div>
            <label for="sex" class="block text-sm font-medium text-gray-700 mb-2">
              Sex *
            </label>
            <select id="sex" v-model="form.sex" required class="input-field">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <!-- Admission Date -->
        <div>
          <label for="admissionDate" class="block text-sm font-medium text-gray-700 mb-2">
            Admission Date *
          </label>
          <input
            id="admissionDate"
            v-model="form.admissionDate"
            type="date"
            required
            class="input-field"
          />
        </div>

        <!-- Assigned Doctor -->
        <div>
          <label for="assignedDoctor" class="block text-sm font-medium text-gray-700 mb-2">
            Assigned Doctor *
          </label>
          <select id="assignedDoctor" v-model="form.assignedDoctor" required class="input-field">
            <option value="">Select Doctor</option>
            <option v-for="doctor in doctors" :key="doctor" :value="doctor">
              {{ doctor }}
            </option>
          </select>
        </div>

        <!-- Case Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            Current Status *
          </label>
          <select id="status" v-model="form.status" required class="input-field">
            <option value="">Select Status</option>
            <option value="ICU">ICU</option>
            <option value="Stable">Stable</option>
            <option value="Discharged">Discharged</option>
          </select>
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
            Add Patient
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close', 'save'])

// Form data
const form = ref({
  name: '',
  age: '',
  sex: '',
  admissionDate: new Date().toISOString().split('T')[0],
  assignedDoctor: '',
  status: ''
})

// Mock doctors list - in real app this would come from store
const doctors = ref([
  'Dr. Michael Chen',
  'Dr. Lisa Anderson',
  'Dr. James Wilson', 
  'Dr. Sarah Kim',
  'Dr. Robert Taylor'
])

// Computed
const isFormValid = computed(() => {
  return form.value.name && 
         form.value.age && 
         form.value.sex && 
         form.value.admissionDate && 
         form.value.assignedDoctor && 
         form.value.status
})

// Methods
const handleSubmit = () => {
  if (isFormValid.value) {
    emit('save', { 
      ...form.value,
      lastConsultation: form.value.admissionDate  // Set last consultation to admission date
    })
    // Reset form
    form.value = {
      name: '',
      age: '',
      sex: '',
      admissionDate: new Date().toISOString().split('T')[0],
      assignedDoctor: '',
      status: ''
    }
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
</script>