import type { Booking, Station } from '@/types'

import { mockStations } from '@/mockData/stations'

// simulate a delay for the API call
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const fetchStation = async (id: string): Promise<Station | null> => {
  await sleep(200)
  return mockStations.find((station) => station.id === id) || null
}

export const fetchStations = async (): Promise<Station[] | null> => {
  await sleep(150)
  return mockStations || null
}

export const fetchBookingByID = async (
  stationId: string,
  bookingId: string,
): Promise<Booking | undefined> => {
  await sleep(400)
  const station = await fetchStation(stationId)
  return station?.bookings.find((booking) => booking.id === bookingId)
}
