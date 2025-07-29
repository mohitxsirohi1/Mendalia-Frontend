<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-heading font-bold text-gray-900">Patient Management</h1>
        <p class="text-gray-600 mt-1">Manage your patients and their consultation history</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="btn-primary mt-4 sm:mt-0"
      >
        <Icon name="lucide:plus" class="w-4 h-4 mr-2 inline" />
        Add Patient
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search patients by name, ID, or assigned doctor..."
              class="input-field pl-10"
            />
          </div>
        </div>
        <select v-model="statusFilter" class="input-field w-full sm:w-auto">
          <option value="">All Statuses</option>
          <option value="ICU">ICU</option>
          <option value="Stable">Stable</option>
          <option value="Discharged">Discharged</option>
        </select>
      </div>
    </div>

    <!-- Patients Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age/Sex
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Consultation
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Doctor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="patient in filteredPatients" 
              :key="patient.id"
              class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              @click="navigateToPatient(patient.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-mendalia-green/10 rounded-full flex items-center justify-center mr-4">
                    <span class="text-mendalia-green font-medium text-sm">
                      {{ patient.name.split(' ').map(n => n[0]).join('') }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ patient.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ patient.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ patient.age }}{{ patient.sex === 'Male' ? 'M' : 'F' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(patient.lastConsultation) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(patient.status)">
                  {{ patient.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ patient.assignedDoctor }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-mendalia-green hover:text-mendalia-green-dark mr-4">
                  <Icon name="lucide:eye" class="w-4 h-4" />
                </button>
                <button class="text-gray-400 hover:text-gray-600">
                  <Icon name="lucide:more-horizontal" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredPatients.length === 0" class="text-center py-12">
        <Icon name="lucide:users" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
        <p class="text-gray-500 mb-4">
          {{ searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first patient' }}
        </p>
        <button 
          v-if="!searchQuery"
          @click="showAddModal = true"
          class="btn-primary"
        >
          <Icon name="lucide:plus" class="w-4 h-4 mr-2 inline" />
          Add First Patient
        </button>
      </div>
    </div>

    <!-- Add Patient Modal -->
    <PatientAddModal 
      v-if="showAddModal"
      @close="showAddModal = false"
      @save="handleAddPatient"
    />
  </div>
</template>

<script setup>
// Get patients from store
const patientsStore = usePatientsStore()
const { patients } = storeToRefs(patientsStore)

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)

// Computed filtered patients
const filteredPatients = computed(() => {
  let filtered = patients.value || []
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.id.toLowerCase().includes(query) ||
      patient.assignedDoctor.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(patient => patient.status === statusFilter.value)
  }
  
  return filtered
})

// Methods
const navigateToPatient = (patientId) => {
  navigateTo(`/patients/${patientId}`)
}

const handleAddPatient = (patientData) => {
  patientsStore.addPatient(patientData)
  showAddModal.value = false
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getStatusClass = (status) => {
  const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  switch (status) {
    case 'ICU':
      return `${baseClass} bg-red-100 text-red-800`
    case 'Stable':
      return `${baseClass} bg-green-100 text-green-800`
    case 'Discharged':
      return `${baseClass} bg-gray-100 text-gray-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

// Page meta
useHead({
  title: 'Patients - Mendalia',
  meta: [
    { name: 'description', content: 'Manage your patients and their consultation history' }
  ]
})
</script>