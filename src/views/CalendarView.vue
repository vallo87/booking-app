<template>
  <div class="p-4 max-w-7xl mx-auto text-slate-800">
    <!-- Autocomplete Selector -->
    <AppAutocomplete />

    <!-- Pagination -->
    <div class="flex flex-row justify-between items-center mt-6 mb-6 gap-3">
      <button
        @click="prevWeek"
        class="w-full md:w-auto px-4 py-2 border border-cyan-600 text-cyan-700 bg-white rounded-md hover:bg-cyan-50 transition cursor-pointer"
      >
        ← Prev
      </button>
      <h2 class="text-sm font-semibold text-center w-full md:flex-1">
        Week of {{ formatDate(startOfWeek) }}
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
            dropHoverDate?.getTime() === day.date.getTime() &&
            dropHoverDate?.getTime() === day.date.getTime() &&
            draggedBooking?.startDate !== format(day.date, 'yyyy-MM-dd')
              ? 'ring-2 ring-cyan-400 bg-cyan-50'
              : '',
          ]"
          @dragover.prevent
          @drop="onDrop(day.date)"
          @dragenter="onDragEnter(day.date)"
          @dragleave="onDragLeave(day.date)"
          class="relative"
        >
          <div class="font-semibold text-sm text-slate-700 mb-3">
            {{ formatDay(day.date) }}
          </div>

          <div
            v-if="dropHoverDate?.getTime() === day.date.getTime()"
            class="absolute inset-0 bg-cyan-50 opacity-40 border-2 border-dashed border-cyan-400 z-10"
          ></div>

          <!-- Bookings -->
          <div
            v-for="b in bookingsForDay(day.date)"
            :key="b.id"
            class="bg-cyan-700 text-white text-sm px-3 py-2 rounded-md mb-2 hover:bg-cyan-200 hover:text-black cursor-pointer transition"
            draggable="true"
            @dragstart="onDragStart(b)"
            @click="selectBooking(b)"
          >
            {{ b.customerName }}
          </div>

          <!-- Drop feedback message -->
          <div
            v-if="
              dropHoverDate?.getTime() === day.date.getTime() &&
              draggedBooking?.startDate !== format(day.date, 'yyyy-MM-dd')
            "
            class="bottom-0 left-0 right-0 bg-cyan-100 text-cyan-700 text-xs italic p-2 border-t border-cyan-300 rounded-md"
          >
            Drop here to reschedule
          </div>

          <!-- No bookings message -->
          <div
            v-else-if="bookingsForDay(day.date).length === 0"
            class="text-xs text-slate-400 italic"
          >
            No bookings
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppAutocomplete from '@/components/AppAutocomplete.vue'
import { rescheduleBookingAPI } from '@/mockData/api'
import { useStationStore } from '@/stores/station'
import type { Booking } from '@/types'
import { addDays, format, startOfWeek as getStartOfWeek } from 'date-fns'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const stationStore = useStationStore()
const currentWeekOffset = ref(0)

/******* Calendar *******/

// Starting from a meaningful date for the dataset
const baseDate = new Date('2020-10-01')

const startOfWeek = computed(() =>
  getStartOfWeek(addDays(baseDate, currentWeekOffset.value * 7), {
    weekStartsOn: 1,
  }),
)

const weekDays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: addDays(startOfWeek.value, i),
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

/******* Drag and Drop *******/

const draggedBooking = ref<Booking | null>(null)
const dropHoverDate = ref<Date | null>(null)

// for testing purposes
defineExpose({
  dropHoverDate,
})

function onDragStart(booking: Booking) {
  draggedBooking.value = booking
}

function onDrop(newDate: Date) {
  if (!draggedBooking.value) return
  reschedule(draggedBooking.value, newDate)
  draggedBooking.value = null
  dropHoverDate.value = null
}

function onDragEnter(date: Date) {
  dropHoverDate.value = date
}

function onDragLeave(date: Date) {
  if (dropHoverDate.value?.getTime() === date.getTime()) {
    dropHoverDate.value = null
  }
}

/******* Drag and Drop *******/

function reschedule(booking: Booking, newDate: Date) {
  const newDateStr = format(newDate, 'yyyy-MM-dd')

  const updatedBooking = { ...booking }
  updatedBooking.startDate = newDateStr

  const station = stationStore.stationValue
  if (!station) return

  const index = station.bookings.findIndex((b) => b.id === booking.id)
  if (index !== -1) {
    station.bookings[index] = updatedBooking
    stationStore.setStation({ ...station })
  }

  // simulate API call
  rescheduleBookingAPI(station.id, booking.id, newDateStr)
}

const router = useRouter()

function selectBooking(booking: Booking) {
  if (!stationStore.selectedStationId) return
  router.push(`/${stationStore.selectedStationId}/booking/${booking.id}`)
}
</script>
