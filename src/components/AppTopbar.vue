<template>
  <header class="bg-white p-4 flex items-center justify-start">
    <button @click="goBack" class="text-gray-600 focus:outline-none mr-4">
      <ChevronLeft class="w-6 h-6" />
    </button>
    <h1 class="text-xl font-bold text-gray-800">{{ pageTitle }}</h1>
  </header>
</template>
<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => {
  switch (route.name) {
    case 'Home':
      return 'Home'
    case 'Calendar':
      return 'Calendar'
    case 'Booking':
      return 'Booking'
    default:
      return ''
  }
})

function goBack() {
  window.history.back()
}
</script>
