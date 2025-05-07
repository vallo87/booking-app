import type { Station } from '@/types'
import { defineStore } from 'pinia'

export const useStationStore = defineStore('station', {
  state: () => ({
    selectedStationId: null as string | null,
    stationValue: null as Station | null,
  }),
  actions: {
    setStation(station: Station) {
      this.selectedStationId = station.id
      this.stationValue = station
    },
    reset() {
      this.stationValue = null
      this.selectedStationId = null
    },
  },
})
