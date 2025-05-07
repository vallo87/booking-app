<template>
  <div class="p-8 max-w-xl mx-auto bg-white rounded-lg">
    <!-- Loading and Error States -->
    <div v-if="isLoading" class="text-center text-gray-500">
      <span class="animate-pulse">Loading...</span>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      <strong>Error:</strong> {{ error.message }}
    </div>

    <!-- Booking Details -->
    <div v-else>
      <h1 class="text-3xl font-semibold text-gray-800 mb-6">Booking Details</h1>

      <!-- Booking Information -->
      <div v-if="booking" class="space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-lg font-medium text-gray-700"><strong>Customer Name:</strong></p>
          <p class="text-lg text-gray-900">{{ booking.customerName }}</p>
        </div>

        <div class="flex justify-between items-center">
          <p class="text-lg font-medium text-gray-700"><strong>Start Date:</strong></p>
          <p class="text-lg text-gray-900">{{ new Date(booking.startDate).toLocaleString() }}</p>
        </div>

        <div class="flex justify-between items-center">
          <p class="text-lg font-medium text-gray-700"><strong>End Date:</strong></p>
          <p class="text-lg text-gray-900">{{ new Date(booking.endDate).toLocaleString() }}</p>
        </div>

        <div class="flex justify-between items-center">
          <p class="text-lg font-medium text-gray-700"><strong>Duration:</strong></p>
          <p class="text-lg text-gray-900">{{ duration }} days</p>
        </div>

        <div class="flex justify-between items-center">
          <p class="text-lg font-medium text-gray-700"><strong>Pickup-Return Station:</strong></p>
          <p class="text-lg text-gray-900">
            {{ getStationNameById(booking.pickupReturnStationId) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Back Button -->
    <div class="mt-8 text-center">
      <router-link
        to="/calendar"
        class="w-full md:w-auto px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-200 hover:text-black transition-all"
      >
        Back to Calendar
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchBookingByID, fetchStations } from '@/mockData/api'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

const props = defineProps<{ stationId: string; bookingId: string }>()
const { stationId, bookingId } = props

const { data: stations } = useQuery({
  queryKey: ['stations'],
  queryFn: fetchStations,
  enabled: true,
})

const {
  data: booking,
  isLoading,
  error,
} = useQuery({
  queryKey: ['#booking', stationId, bookingId],
  queryFn: () => fetchBookingByID(stationId, bookingId),
  enabled: !!stationId && !!bookingId,
})

const getStationNameById = (id: string) => {
  const station = stations.value?.find((s) => s.id === id)
  return station ? station.name : 'Unknown Station'
}
const duration = computed(() => {
  if (!booking.value) return 0
  const start = new Date(booking.value.startDate)
  const end = new Date(booking.value.endDate)
  const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  return diff
})
</script>
