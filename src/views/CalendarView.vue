<template>
  <div class="p-4 max-w-7xl mx-auto text-slate-800">
    <!-- Pagination -->
    <div class="flex flex-row justify-between items-center mt-6 mb-6 gap-3">
      <button
        @click="prevWeek"
        class="w-full md:w-auto px-4 py-2 border border-cyan-600 text-cyan-700 bg-white rounded-md hover:bg-cyan-50 transition cursor-pointer"
      >
        ← Prev
      </button>
      <h2 class="text-sm font-semibold text-center w-full md:flex-1">
        Week of {{ formatDate(calStartOfWeek) }}
      </h2>
      <button
        @click="nextWeek"
        class="w-full md:w-auto px-4 py-2 border border-cyan-600 text-cyan-700 bg-white rounded-md hover:bg-cyan-50 transition cursor-pointer"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addDays, format, startOfWeek } from 'date-fns'
import { computed, ref } from 'vue'

const currentWeekOffset = ref(0)

const baseDate = new Date(Date.now())

const calStartOfWeek = computed(() =>
  startOfWeek(addDays(baseDate, currentWeekOffset.value * 7), {
    weekStartsOn: 1,
  }),
)

function prevWeek() {
  currentWeekOffset.value--
}
function nextWeek() {
  currentWeekOffset.value++
}
function formatDate(date: Date) {
  return format(date, 'dd MMM yyyy')
}
</script>

<style scoped></style>
