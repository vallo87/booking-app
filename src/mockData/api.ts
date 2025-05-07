import type { Station } from '@/types'
import { mockStations } from '@/mockData/stations'

// simulate a delay for the API call
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const fetchStations = async (): Promise<Station[] | null> => {
  await sleep(150)
  return mockStations || null
}
