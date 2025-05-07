import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useStationStore } from '@/stores/station'

describe('useStationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with null values', () => {
    const store = useStationStore()
    expect(store.selectedStationId).toBeNull()
    expect(store.stationValue).toBeNull()
  })

  it('sets a station correctly', () => {
    const store = useStationStore()
    const station = {
      id: '123',
      name: 'Test Station',
      bookings: [],
    }

    store.setStation(station)

    expect(store.selectedStationId).toBe('123')
    expect(store.stationValue).toEqual(station)
  })

  it('resets station correctly', () => {
    const store = useStationStore()
    const station = {
      id: '123',
      name: 'Test Station',
      bookings: [],
    }

    store.setStation(station)
    store.reset()

    expect(store.selectedStationId).toBeNull()
    expect(store.stationValue).toBeNull()
  })
})
