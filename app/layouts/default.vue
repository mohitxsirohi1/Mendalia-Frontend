<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-mendalia-green rounded-lg flex items-center justify-center">
                <Icon name="lucide:stethoscope" class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-heading font-semibold text-gray-900">
                Mendalia
              </span>
            </NuxtLink>
          </div>
          
          <!-- Navigation Menu -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              to="/patients" 
              class="text-gray-700 hover:text-mendalia-green font-medium transition-colors duration-200"
              active-class="text-mendalia-green"
            >
              Patients
            </NuxtLink>
            <NuxtLink 
              to="/analytics" 
              class="text-gray-700 hover:text-mendalia-green font-medium transition-colors duration-200"
              active-class="text-mendalia-green"
            >
              Analytics
            </NuxtLink>
          </nav>
          
          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <Icon name="lucide:bell" class="w-5 h-5" />
            </button>
            <div class="w-8 h-8 bg-mendalia-green rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">DR</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
// Layout configuration
</script>