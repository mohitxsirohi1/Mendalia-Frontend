<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="!patient" class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
      <div class="space-y-4">
        <div class="h-32 bg-gray-200 rounded"></div>
        <div class="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Patient Profile -->
    <div v-else>
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div class="flex items-center space-x-4 mb-4 lg:mb-0">
          <!-- Back Button -->
          <button 
            @click="$router.back()"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Icon name="lucide:arrow-left" class="w-5 h-5" />
          </button>
          
          <!-- Patient Avatar -->
          <div class="w-16 h-16 bg-mendalia-green/10 rounded-xl flex items-center justify-center">
            <span class="text-mendalia-green font-heading font-bold text-lg">
              {{ patient.name.split(' ').map(n => n[0]).join('') }}
            </span>
          </div>
          
          <!-- Patient Info -->
          <div>
            <h1 class="text-3xl font-heading font-bold text-gray-900">{{ patient.name }}</h1>
            <div class="flex items-center space-x-4 text-gray-600 mt-1">
              <span>{{ patient.age }} years old, {{ patient.sex }}</span>
              <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>ID: {{ patient.id }}</span>
              <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span :class="getStatusClass(patient.status)">
                {{ patient.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-3">
          <button 
            @click="showNewCaseModal = true"
            class="btn-primary"
          >
            <Icon name="lucide:plus" class="w-4 h-4 mr-2 inline" />
            New Case
          </button>
          <button class="btn-secondary">
            <Icon name="lucide:edit" class="w-4 h-4 mr-2 inline" />
            Edit Patient
          </button>
        </div>
      </div>

      <!-- Patient Details Card -->
      <div class="grid lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-2">
          <!-- Case History -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-heading font-semibold text-gray-900">Case History</h2>
              <span class="text-sm text-gray-500">{{ patient.cases.length }} consultation{{ patient.cases.length !== 1 ? 's' : '' }}</span>
            </div>
            
            <!-- Cases List -->
            <div v-if="patient.cases.length > 0" class="space-y-4">
              <div 
                v-for="caseItem in patient.cases" 
                :key="caseItem.id"
                class="medical-card cursor-pointer group"
                @click="navigateToCase(caseItem.id)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="font-semibold text-gray-900 group-hover:text-mendalia-green transition-colors duration-200">
                        {{ caseItem.title }}
                      </h3>
                      <span :class="getCaseStatusClass(caseItem.status)">
                        {{ caseItem.status }}
                      </span>
                    </div>
                    <p class="text-gray-600 text-sm mb-3">{{ caseItem.description }}</p>
                    <div class="flex items-center space-x-4 text-xs text-gray-500">
                      <span class="flex items-center">
                        <Icon name="lucide:calendar" class="w-3 h-3 mr-1" />
                        {{ formatDate(caseItem.date) }}
                      </span>
                      <span class="flex items-center">
                        <Icon name="lucide:user-md" class="w-3 h-3 mr-1" />
                        {{ patient.assignedDoctor }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Icon name="lucide:arrow-right" class="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <Icon name="lucide:file-text" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">No cases yet</h3>
              <p class="text-gray-500 mb-4">Start the first consultation for this patient</p>
              <button 
                @click="showNewCaseModal = true"
                class="btn-primary"
              >
                <Icon name="lucide:plus" class="w-4 h-4 mr-2 inline" />
                Create First Case
              </button>
            </div>
          </div>
        </div>

        <!-- Patient Info Sidebar -->
        <div class="space-y-6">
          <!-- Basic Information -->
          <div class="card">
            <h3 class="font-heading font-semibold text-gray-900 mb-4">Patient Information</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Age:</span>
                <span class="font-medium">{{ patient.age }} years</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Sex:</span>
                <span class="font-medium">{{ patient.sex }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Patient ID:</span>
                <span class="font-medium">{{ patient.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Admission Date:</span>
                <span class="font-medium">{{ formatDate(patient.admissionDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Assigned Doctor:</span>
                <span class="font-medium">{{ patient.assignedDoctor }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Current Status:</span>
                <span :class="getStatusClass(patient.status)">{{ patient.status }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="card">
            <h3 class="font-heading font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Cases:</span>
                <span class="font-bold text-mendalia-green">{{ patient.cases.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Active Cases:</span>
                <span class="font-bold text-blue-600">{{ activeCasesCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Visit:</span>
                <span class="font-medium">{{ formatDate(patient.lastConsultation) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Case Modal -->
    <NewCaseModal 
      v-if="showNewCaseModal"
      :patient="patient"
      @close="showNewCaseModal = false"
      @save="handleCreateCase"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const patientsStore = usePatientsStore()

// Get patient data
const patientId = route.params.id
const patient = computed(() => patientsStore.getPatientById(patientId))

// Reactive data
const showNewCaseModal = ref(false)

// Computed properties
const activeCasesCount = computed(() => {
  return patient.value?.cases.filter(c => c.status === 'Active').length || 0
})

// Methods
const navigateToCase = (caseId) => {
  navigateTo(`/patients/${patientId}/cases/${caseId}`)
}

const handleCreateCase = (caseData) => {
  const newCase = patientsStore.addCase(patientId, caseData)
  showNewCaseModal.value = false
  // Navigate to the new case
  navigateTo(`/patients/${patientId}/cases/${newCase.id}`)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getStatusClass = (status) => {
  const baseClass = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
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

const getCaseStatusClass = (status) => {
  const baseClass = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
  switch (status) {
    case 'Active':
      return `${baseClass} bg-blue-100 text-blue-800`
    case 'Completed':
      return `${baseClass} bg-green-100 text-green-800`
    case 'On Hold':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

// Handle case where patient doesn't exist
watchEffect(() => {
  if (!patient.value) {
    // Could redirect to patients page or show 404
    console.warn(`Patient with ID ${patientId} not found`)
  }
})

// Page meta
useHead(() => ({
  title: patient.value ? `${patient.value.name} - Mendalia` : 'Patient Profile - Mendalia',
  meta: [
    { name: 'description', content: 'Patient profile and case history management' }
  ]
}))
</script>