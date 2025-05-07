<template>
  <div class="relative w-full max-w-md mx-auto">
    <div class="relative">
      <input
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700 pr-10"
        v-model="query"
        @input="onInput"
        @focus="open = true"
        @keydown="onKeyDown"
        :disabled="!!selectedStation"
        placeholder="Search for a station..."
      />
      <button
        v-if="selectedStation"
        @click="clear"
        class="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        ×
      </button>
    </div>

    <ul
      v-if="open && filteredStations.length > 0"
      class="absolute mt-1 w-full bg-white border border-gray-200 rounded-md z-50 max-h-64 overflow-y-auto"
    >
      <li
        v-for="(station, index) in filteredStations"
        :key="station.id"
        class="px-4 py-2 hover:bg-cyan-50 cursor-pointer transition-colors"
        :class="{ 'bg-cyan-100': index === highlightedIndex }"
        @click="select(station)"
      >
        {{ station.name }}
      </li>
    </ul>

    <div
      v-else-if="open && query.length >= 2"
      class="absolute mt-1 w-full bg-white border border-gray-200 rounded-md z-50 px-4 py-2 text-gray-500"
    >
      No stations found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchStations } from '@/mockData/api'
import { useStationStore } from '@/stores/station'
import type { Station } from '@/types'
import { useQuery } from '@tanstack/vue-query'
import { computed, onMounted, ref, watch } from 'vue'

const stationStore = useStationStore()
const query = ref('')
const open = ref(false)

const { data: stations } = useQuery({
  queryKey: ['stations'],
  queryFn: fetchStations,
  enabled: true,
})

const selectedStation = computed(() => stationStore.stationValue)

const filteredStations = computed(() => {
  if (!stations.value || query.value.length < 2) return []
  return stations.value.filter((s: Station) =>
    s.name.toLowerCase().includes(query.value.toLowerCase()),
  )
})

function onInput() {
  open.value = true
}

function select(station: Station) {
  query.value = station.name

  // Note: instead of using an event emit i prefer to use a store to
  stationStore.setStation(station)
  open.value = false
  highlightedIndex.value = -1
}

function clear() {
  stationStore.reset()
  query.value = ''
  open.value = false
  highlightedIndex.value = -1
}

// Keyboard navigation

const highlightedIndex = ref(-1)

watch(query, () => {
  highlightedIndex.value = -1
})

function onKeyDown(event: KeyboardEvent) {
  if (!open.value || filteredStations.value.length === 0) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (highlightedIndex.value < filteredStations.value.length - 1) {
      highlightedIndex.value++
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (highlightedIndex.value > 0) {
      highlightedIndex.value--
    }
  } else if (event.key === 'Enter' && highlightedIndex.value >= 0) {
    event.preventDefault()
    const station = filteredStations.value[highlightedIndex.value]
    select(station)
  }
}

// Lifecycle hooks

onMounted(() => {
  if (stationStore.stationValue) {
    query.value = stationStore.stationValue.name
  }
})
</script>
