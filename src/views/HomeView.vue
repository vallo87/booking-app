<template>
  <div class="flex flex-col justify-center items-center h-full text-center p-4">
    <img src="/caravan.jpeg" alt="Cartoon Caravan" class="max-w-lg w-full rounded-xl mb-6" />

    <h1 class="text-2xl md:text-3xl font-semibold mb-2">Welcome to Road Roadsurfer 🚐</h1>
    <p class="text-gray-600 mb-6 max-w-md">Manage all your campervan bookings in one place.</p>

    <RouterLink
      to="/calendar"
      class="flex items-center px-6 py-3 bg-cyan-700 text-white hover:bg-cyan-200 hover:text-black text-lg font-medium rounded-lg transition"
    >
      <Calendar class="w-6 h-6 mr-2" />
      <span>Go to Calendar</span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'
</script>
