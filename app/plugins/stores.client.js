export default defineNuxtPlugin(() => {
  // Initialize Pinia stores on client side
  const patientsStore = usePatientsStore()
  
  return {
    provide: {
      patientsStore
    }
  }
})