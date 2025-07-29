<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
        Welcome to
        <span class="text-mendalia-green">Mendalia</span>
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Your AI Co-pilot for clinical decision-making. Enhance consultations with intelligent analysis, 
        risk assessment, and evidence-based recommendations.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/patients" class="btn-primary px-8 py-4 text-lg">
          <Icon name="lucide:users" class="w-5 h-5 mr-2 inline" />
          View Patients
        </NuxtLink>
        <button class="btn-secondary px-8 py-4 text-lg">
          <Icon name="lucide:play-circle" class="w-5 h-5 mr-2 inline" />
          Watch Demo
        </button>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-3 gap-8 mb-16">
      <div class="card text-center">
        <div class="w-12 h-12 bg-mendalia-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:brain" class="w-6 h-6 text-mendalia-green" />
        </div>
        <h3 class="text-xl font-heading font-semibold mb-3">AI-Powered Analysis</h3>
        <p class="text-gray-600">
          Get instant clinical insights with differential diagnoses, risk assessments, and evidence-based recommendations.
        </p>
      </div>
      
      <div class="card text-center">
        <div class="w-12 h-12 bg-mendalia-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:shield-check" class="w-6 h-6 text-mendalia-green" />
        </div>
        <h3 class="text-xl font-heading font-semibold mb-3">Risk Detection</h3>
        <p class="text-gray-600">
          Early identification of red flags and potential complications to improve patient safety and outcomes.
        </p>
      </div>
      
      <div class="card text-center">
        <div class="w-12 h-12 bg-mendalia-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:clipboard-list" class="w-6 h-6 text-mendalia-green" />
        </div>
        <h3 class="text-xl font-heading font-semibold mb-3">Smart Documentation</h3>
        <p class="text-gray-600">
          Streamlined note-taking with voice dictation and intelligent suggestions for comprehensive documentation.
        </p>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-3xl font-heading font-bold text-mendalia-green mb-2">99.2%</div>
          <div class="text-gray-600 text-sm">Diagnostic Accuracy</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-heading font-bold text-mendalia-green mb-2">45%</div>
          <div class="text-gray-600 text-sm">Faster Consultations</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-heading font-bold text-mendalia-green mb-2">10K+</div>
          <div class="text-gray-600 text-sm">Cases Analyzed</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-heading font-bold text-mendalia-green mb-2">24/7</div>
          <div class="text-gray-600 text-sm">AI Support</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home page setup
useHead({
  title: 'Mendalia - AI Co-pilot for Doctors',
  meta: [
    { name: 'description', content: 'AI Co-pilot built for doctors to enhance clinical decision-making' }
  ]
})
</script>