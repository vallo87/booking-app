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

    <!-- Calendar -->
    <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
      <div
        v-for="day in weekDays"
        :key="day.date.toString()"
        class="rounded-md border border-slate-200 bg-white p-4 flex flex-col md:h-100"
      >
        <div
          :class="[
            'rounded-md border border-slate-200 bg-white p-4 flex flex-col transition-colors',
          ]"
          class="relative"
        >
          <div class="font-semibold text-sm text-slate-700 mb-3">
            {{ formatDay(day.date) }}
          </div>

          <div
            v-for="b in bookingsForDay(day.date)"
            :key="b.id"
            class="bg-cyan-700 text-white text-sm px-3 py-2 rounded-md mb-2 hover:bg-cyan-200 hover:text-black cursor-pointer transition"
            @click="selectBooking(b)"
          >
            {{ b.customerName }}
          </div>

          <div v-if="bookingsForDay(day.date).length === 0" class="text-xs text-slate-400 italic">
            No bookings
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStationStore } from '@/stores/station'
import type { Booking } from '@/types'
import { addDays, format, startOfWeek } from 'date-fns'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const stationStore = useStationStore()
const currentWeekOffset = ref(0)

/******* Calendar *******/

// Starting from a meaningful date for the dataset
const baseDate = new Date('2020-10-01')

const calStartOfWeek = computed(() =>
  startOfWeek(addDays(baseDate, currentWeekOffset.value * 7), {
    weekStartsOn: 1,
  }),
)

const weekDays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: addDays(calStartOfWeek.value, i),
  }))
})

function prevWeek() {
  currentWeekOffset.value--
}
function nextWeek() {
  currentWeekOffset.value++
}

function formatDay(date: Date) {
  return format(date, 'EEE dd MMM')
}

function formatDate(date: Date) {
  return format(date, 'dd MMM yyyy')
}

function bookingsForDay(day: Date): Booking[] {
  const dayStr = format(day, 'yyyy-MM-dd')
  return (
    stationStore.stationValue?.bookings.filter(
      (b) =>
        format(new Date(b.startDate), 'yyyy-MM-dd') === dayStr ||
        format(new Date(b.endDate), 'yyyy-MM-dd') === dayStr,
    ) || []
  )
}

/******* Calendar *******/

const router = useRouter()

function selectBooking(booking: Booking) {
  if (!stationStore.selectedStationId) return
  router.push(`/${stationStore.selectedStationId}/booking/${booking.id}`)
}
</script>

<style scoped></style>
