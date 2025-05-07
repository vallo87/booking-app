<template>
  <div class="flex h-screen">
    <div class="flex-1 flex flex-col overflow-y-hidden">
      <TopBar />
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopBar from '@/components/AppTopbar.vue'

import '@/assets/main.css'
</script>
