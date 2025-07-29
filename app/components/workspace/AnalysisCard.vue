<template>
  <div 
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300"
    :class="{
      'border-red-200 bg-red-50': variant === 'danger',
      'border-yellow-200 bg-yellow-50': variant === 'warning',
      'animate-slide-up': !loading
    }"
    :style="{ animationDelay: `${delay}ms` }"
  >
    <!-- Card Header -->
    <div 
      class="flex items-center justify-between p-4 cursor-pointer"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center space-x-3">
        <div 
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          :class="{
            'bg-red-100': variant === 'danger',
            'bg-yellow-100': variant === 'warning', 
            'bg-mendalia-green/10': !variant
          }"
        >
          <Icon 
            :name="icon" 
            class="w-4 h-4"
            :class="{
              'text-red-600': variant === 'danger',
              'text-yellow-600': variant === 'warning',
              'text-mendalia-green': !variant
            }"
          />
        </div>
        <h3 
          class="font-heading font-semibold"
          :class="{
            'text-red-900': variant === 'danger',
            'text-yellow-900': variant === 'warning',
            'text-gray-900': !variant
          }"
        >
          {{ title }}
        </h3>
      </div>
      <div class="flex items-center space-x-2">
        <!-- Loading spinner -->
        <div v-if="loading" class="animate-spin">
          <Icon name="lucide:loader-2" class="w-4 h-4 text-gray-400" />
        </div>
        <!-- Expand/collapse icon -->
        <Icon 
          name="lucide:chevron-down" 
          class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="{ 'transform rotate-180': isExpanded }"
        />
      </div>
    </div>

    <!-- Card Content -->
    <div v-if="isExpanded && !loading" class="px-4 pb-4">
      <slot />
    </div>

    <!-- Loading Content -->
    <div v-if="loading" class="px-4 pb-4">
      <div class="animate-pulse space-y-2">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  delay: {
    type: Number,
    default: 0
  },
  variant: {
    type: String,
    validator: value => ['danger', 'warning'].includes(value) || !value
  }
})

// Card expanded state
const isExpanded = ref(true)
</script>