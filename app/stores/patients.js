export const usePatientsStore = defineStore('patients', () => {
  // Mock patients data
  const patients = ref([
    {
      id: 'PT001',
      name: 'Sarah Johnson',
      age: 34,
      sex: 'Female',
      admissionDate: '2025-03-15',
      lastConsultation: '2025-03-20',
      status: 'Stable',
      assignedDoctor: 'Dr. Michael Chen',
      cases: [
        {
          id: 'CS001',
          title: 'Initial Assessment - Chest Pain',
          date: '2025-03-15',
          description: 'Patient presented with acute chest pain, ECG abnormalities',
          status: 'Completed'
        },
        {
          id: 'CS002',
          title: 'Follow-up - Cardiac Evaluation',
          date: '2025-03-20',
          description: 'Follow-up after cardiac catheterization',
          status: 'Active'
        }
      ]
    },
    {
      id: 'PT002',
      name: 'Robert Martinez',
      age: 67,
      sex: 'Male',
      admissionDate: '2025-03-18',
      lastConsultation: '2025-03-21',
      status: 'ICU',
      assignedDoctor: 'Dr. Lisa Anderson',
      cases: [
        {
          id: 'CS003',
          title: 'Acute Respiratory Distress',
          date: '2025-03-18',
          description: 'Severe respiratory symptoms, suspected pneumonia',
          status: 'Active'
        }
      ]
    },
    {
      id: 'PT003',
      name: 'Emily Davis',
      age: 28,
      sex: 'Female',
      admissionDate: '2025-03-12',
      lastConsultation: '2025-03-19',
      status: 'Discharged',
      assignedDoctor: 'Dr. James Wilson',
      cases: [
        {
          id: 'CS004',
          title: 'Routine Checkup - Pregnancy',
          date: '2025-03-12',
          description: '20-week prenatal checkup, normal development',
          status: 'Completed'
        },
        {
          id: 'CS005',
          title: 'Follow-up - Prenatal Care',
          date: '2025-03-19',
          description: '22-week follow-up, all parameters normal',
          status: 'Completed'
        }
      ]
    },
    {
      id: 'PT004',
      name: 'David Thompson',
      age: 45,
      sex: 'Male',
      admissionDate: '2025-03-21',
      lastConsultation: '2025-03-21',
      status: 'Stable',
      assignedDoctor: 'Dr. Michael Chen',
      cases: [
        {
          id: 'CS006',
          title: 'Diabetes Management',
          date: '2025-03-21',
          description: 'Type 2 diabetes review, medication adjustment',
          status: 'Active'
        }
      ]
    }
  ])

  const doctors = ref([
    'Dr. Michael Chen',
    'Dr. Lisa Anderson', 
    'Dr. James Wilson',
    'Dr. Sarah Kim',
    'Dr. Robert Taylor'
  ])

  // Actions
  const getPatientById = (id) => {
    return patients.value.find(patient => patient.id === id)
  }

  const getCaseById = (patientId, caseId) => {
    const patient = getPatientById(patientId)
    return patient?.cases.find(caseItem => caseItem.id === caseId)
  }

  const addPatient = (patientData) => {
    const newPatient = {
      id: `PT${String(patients.value.length + 1).padStart(3, '0')}`,
      ...patientData,
      cases: []
    }
    patients.value.push(newPatient)
    return newPatient
  }

  const addCase = (patientId, caseData) => {
    const patient = getPatientById(patientId)
    if (patient) {
      const newCase = {
        id: `CS${String(Math.random()).substr(2, 3)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Active',
        ...caseData
      }
      patient.cases.push(newCase)
      patient.lastConsultation = newCase.date
      return newCase
    }
  }

  const updateCase = (patientId, caseId, updates) => {
    const patient = getPatientById(patientId)
    if (patient) {
      const caseIndex = patient.cases.findIndex(c => c.id === caseId)
      if (caseIndex !== -1) {
        patient.cases[caseIndex] = { ...patient.cases[caseIndex], ...updates }
        return patient.cases[caseIndex]
      }
    }
  }

  return {
    patients: readonly(patients),
    doctors: readonly(doctors),
    getPatientById,
    getCaseById,
    addPatient,
    addCase,
    updateCase
  }
})