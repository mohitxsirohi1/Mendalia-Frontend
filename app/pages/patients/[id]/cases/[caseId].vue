<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="!patient || !currentCase" class="animate-pulse p-8">
      <div class="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
      <div class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div class="h-64 bg-gray-200 rounded"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
        </div>
        <div class="space-y-6">
          <div class="h-48 bg-gray-200 rounded"></div>
          <div class="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- AI Workspace -->
    <div v-else class="max-w-full">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Back Button -->
            <button 
              @click="navigateTo(`/patients/${patientId}`)"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Icon name="lucide:arrow-left" class="w-5 h-5" />
            </button>
            
            <!-- Case Info -->
            <div>
              <h1 class="text-xl font-heading font-semibold text-gray-900">
                {{ currentCase.title }}
              </h1>
              <div class="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                <span>{{ patient.name }}</span>
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{{ formatDate(currentCase.date) }}</span>
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span :class="getCaseStatusClass(currentCase.status)">
                  {{ currentCase.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
            <button class="btn-secondary text-sm">
              <Icon name="lucide:save" class="w-4 h-4 mr-2" />
              Save Draft
            </button>
            <button 
              @click="handleAnalyze"
              class="btn-primary text-sm"
              :disabled="isAnalyzing"
            >
              <Icon name="lucide:zap" class="w-4 h-4 mr-2" />
              {{ isAnalyzing ? 'Analyzing...' : 'Analyze' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Workspace -->
      <div class="grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-120px)]">
        <!-- Left Column - Input Workspace -->
        <div class="bg-white border-r border-gray-200 p-6 space-y-6">
          <div class="space-y-6">
            <!-- Notes Section -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <label class="block text-sm font-heading font-semibold text-gray-900">
                  Clinical Notes
                </label>
                <button 
                  @click="startDictation"
                  class="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  :class="{ 'animate-pulse-glow border-mendalia-green bg-mendalia-green/5': isDictating }"
                >
                  <Icon name="lucide:mic" class="w-4 h-4" :class="{ 'text-mendalia-green': isDictating }" />
                  <span :class="{ 'text-mendalia-green': isDictating }">
                    {{ isDictating ? 'Listening...' : 'Dictate' }}
                  </span>
                </button>
              </div>
              <textarea
                v-model="clinicalNotes"
                rows="12"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mendalia-green focus:border-transparent resize-none font-mono text-sm leading-relaxed"
                placeholder="Enter symptoms, observations, patient history, and clinical findings...

Example:
- Chief complaint: Chest pain, 3/10 severity
- History: 45M with HTN, presenting with substernal chest discomfort
- Physical exam: BP 140/90, HR 85, normal heart sounds
- Vital signs stable, no acute distress"
              ></textarea>
              <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>{{ clinicalNotes.length }} characters</span>
                <span>Supports markdown formatting</span>
              </div>
            </div>

            <!-- File Upload Section -->
            <div>
              <label class="block text-sm font-heading font-semibold text-gray-900 mb-4">
                Medical Documents
              </label>
              
              <!-- Upload Area -->
              <div 
                @dragover.prevent
                @drop="handleFileDrop"
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-mendalia-green hover:bg-mendalia-green/5 transition-colors duration-200"
                :class="{ 'border-mendalia-green bg-mendalia-green/5': isDragging }"
              >
                <Icon name="lucide:upload" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-600 mb-2">
                  Drop files here or 
                  <button 
                    @click="$refs.fileInput.click()"
                    class="text-mendalia-green hover:text-mendalia-green-dark underline"
                  >
                    browse
                  </button>
                </p>
                <p class="text-xs text-gray-500">
                  Supports PDF, JPG, PNG (Max 10MB each)
                </p>
                <input 
                  ref="fileInput"
                  type="file" 
                  multiple 
                  accept=".pdf,.jpg,.jpeg,.png"
                  @change="handleFileSelect"
                  class="hidden"
                >
              </div>

              <!-- Uploaded Files -->
              <div v-if="uploadedFiles.length > 0" class="mt-4 space-y-2">
                <div 
                  v-for="(file, index) in uploadedFiles" 
                  :key="index"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <Icon 
                      :name="getFileIcon(file.type)" 
                      class="w-5 h-5 text-gray-500" 
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                    </div>
                  </div>
                  <button 
                    @click="removeFile(index)"
                    class="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - AI Analysis -->
        <div class="bg-gray-50 p-6 overflow-y-auto">
          <!-- Analysis Header -->
          <div class="mb-6">
            <h2 class="text-lg font-heading font-semibold text-gray-900 mb-2">
              AI Clinical Analysis
            </h2>
            <p class="text-sm text-gray-600">
              {{ hasAnalyzed ? 'Analysis completed' : 'Click "Analyze" to get AI-powered clinical insights' }}
            </p>
          </div>

          <!-- Analysis Cards -->
          <div v-if="hasAnalyzed" class="space-y-4">
            <!-- Clinical Overview -->
            <AnalysisCard
              title="Clinical Overview"
              icon="lucide:stethoscope"
              :loading="analysisCards.overview.loading"
              :delay="0"
            >
              <div class="prose prose-sm max-w-none">
                <p class="text-gray-700 leading-relaxed">
                  Based on the clinical presentation, this appears to be a case involving 
                  {{ getPatientContext() }}. The symptoms and findings suggest a need for 
                  systematic evaluation and appropriate diagnostic workup.
                </p>
              </div>
            </AnalysisCard>

            <!-- Red Flags -->
            <AnalysisCard
              title="Red Flags"
              icon="lucide:alert-triangle"
              :loading="analysisCards.redFlags.loading"
              :delay="300"
              variant="danger"
            >
              <div class="space-y-2">
                <div class="flex items-center space-x-2 text-red-700">
                  <Icon name="lucide:alert-circle" class="w-4 h-4" />
                  <span class="font-medium">No immediate red flags identified</span>
                </div>
                <p class="text-red-600 text-sm">
                  Continue monitoring vital signs and symptom progression.
                </p>
              </div>
            </AnalysisCard>

            <!-- AI Risk Alerts -->
            <AnalysisCard
              title="AI Risk Alerts"
              icon="lucide:shield-alert"
              :loading="analysisCards.riskAlerts.loading"
              :delay="600"
              variant="warning"
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-yellow-800">Cardiovascular Risk</span>
                  <span class="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                    Moderate
                  </span>
                </div>
                <p class="text-yellow-700 text-sm">
                  Patient demographics and presentation suggest monitoring for cardiac events.
                </p>
              </div>
            </AnalysisCard>

            <!-- Differential Diagnoses -->
            <AnalysisCard
              title="Differential Diagnoses"
              icon="lucide:brain"
              :loading="analysisCards.differentials.loading"
              :delay="900"
            >
              <div class="space-y-3">
                <div v-for="(diagnosis, index) in mockDifferentials" :key="index" class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ diagnosis.condition }}</p>
                    <p class="text-sm text-gray-600">{{ diagnosis.description }}</p>
                  </div>
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {{ diagnosis.probability }}%
                  </span>
                </div>
              </div>
            </AnalysisCard>

            <!-- Suggested Investigations -->
            <AnalysisCard
              title="Suggested Investigations"
              icon="lucide:search"
              :loading="analysisCards.investigations.loading"
              :delay="1200"
            >
              <div class="space-y-2">
                <div v-for="investigation in mockInvestigations" :key="investigation" class="flex items-center space-x-2">
                  <input type="checkbox" class="rounded border-gray-300 text-mendalia-green focus:ring-mendalia-green">
                  <span class="text-gray-700">{{ investigation }}</span>
                </div>
              </div>
            </AnalysisCard>

            <!-- Suggested Actions -->
            <AnalysisCard
              title="Suggested Actions"
              icon="lucide:clipboard-check"
              :loading="analysisCards.actions.loading"
              :delay="1500"
            >
              <div class="space-y-2">
                <div v-for="action in mockActions" :key="action" class="flex items-center space-x-2">
                  <input type="checkbox" class="rounded border-gray-300 text-mendalia-green focus:ring-mendalia-green">
                  <span class="text-gray-700">{{ action }}</span>
                </div>
              </div>
            </AnalysisCard>
          </div>

          <!-- Placeholder when no analysis -->
          <div v-else class="text-center py-12">
            <Icon name="lucide:brain" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Ready for Analysis</h3>
            <p class="text-gray-500 mb-6">
              Add clinical notes and documents, then click "Analyze" to get AI-powered insights.
            </p>
            <button 
              @click="handleAnalyze"
              class="btn-primary"
              :disabled="!clinicalNotes.trim()"
            >
              <Icon name="lucide:zap" class="w-4 h-4 mr-2" />
              Start Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const patientsStore = usePatientsStore()

// Route params
const patientId = route.params.id
const caseId = route.params.caseId

// Get data
const patient = computed(() => patientsStore.getPatientById(patientId))
const currentCase = computed(() => patientsStore.getCaseById(patientId, caseId))

// Reactive data
const clinicalNotes = ref('')
const uploadedFiles = ref([])
const isDictating = ref(false)
const isDragging = ref(false)
const isAnalyzing = ref(false)
const hasAnalyzed = ref(false)

// Analysis cards state
const analysisCards = ref({
  overview: { loading: false },
  redFlags: { loading: false },
  riskAlerts: { loading: false },
  differentials: { loading: false },
  investigations: { loading: false },
  actions: { loading: false }
})

// Mock data for analysis
const mockDifferentials = ref([
  { condition: "Chest Pain - Cardiac", description: "Consider coronary artery disease", probability: 65 },
  { condition: "Gastroesophageal Reflux", description: "GI-related chest discomfort", probability: 25 },
  { condition: "Musculoskeletal Pain", description: "Chest wall strain or inflammation", probability: 10 }
])

const mockInvestigations = ref([
  "12-lead ECG",
  "Chest X-ray",
  "Basic Metabolic Panel",
  "Troponin levels",
  "Lipid profile"
])

const mockActions = ref([
  "Monitor vital signs q4h",
  "NPO until cleared",
  "Cardiology consultation",
  "Pain management as needed",
  "Patient education on symptoms"
])

// Methods
const handleAnalyze = async () => {
  if (!clinicalNotes.value.trim()) return
  
  isAnalyzing.value = true
  hasAnalyzed.value = true
  
  // Simulate loading sequence for each card
  const cards = ['overview', 'redFlags', 'riskAlerts', 'differentials', 'investigations', 'actions']
  
  for (let i = 0; i < cards.length; i++) {
    setTimeout(() => {
      analysisCards.value[cards[i]].loading = true
      
      setTimeout(() => {
        analysisCards.value[cards[i]].loading = false
      }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
    }, i * 300) // Stagger the start times
  }
  
  setTimeout(() => {
    isAnalyzing.value = false
  }, 2500)
}

const startDictation = () => {
  isDictating.value = true
  
  // Simulate dictation
  setTimeout(() => {
    const mockDictation = "Patient reports chest pain, onset 2 hours ago, non-radiating, 4 out of 10 severity. No shortness of breath or diaphoresis noted."
    clinicalNotes.value += (clinicalNotes.value ? '\n\n' : '') + mockDictation
    isDictating.value = false
  }, 3000)
}

const handleFileDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  processFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  processFiles(files)
}

const processFiles = (files) => {
  files.forEach(file => {
    if (file.size <= 10 * 1024 * 1024) { // 10MB limit
      uploadedFiles.value.push(file)
    }
  })
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

const getFileIcon = (type) => {
  if (type.includes('pdf')) return 'lucide:file-text'
  if (type.includes('image')) return 'lucide:image'
  return 'lucide:file'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getCaseStatusClass = (status) => {
  const baseClass = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
  switch (status) {
    case 'Active':
      return `${baseClass} bg-blue-100 text-blue-800`
    case 'Completed':
      return `${baseClass} bg-green-100 text-green-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const getPatientContext = () => {
  return `${patient.value?.age}-year-old ${patient.value?.sex.toLowerCase()} patient`
}

// Handle case where patient or case doesn't exist
watchEffect(() => {
  if (!patient.value || !currentCase.value) {
    console.warn(`Patient ${patientId} or case ${caseId} not found`)
  }
})

// Page meta
useHead(() => ({
  title: `${currentCase.value?.title || 'Case'} - ${patient.value?.name || 'Patient'} - Mendalia`,
  meta: [
    { name: 'description', content: 'AI-powered clinical consultation workspace' }
  ]
}))
</script>