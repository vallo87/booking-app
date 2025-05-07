import { describe, expect, it, vi } from 'vitest'

import { mockStations } from '@/mockData/stations'
import router from '@/router'
import CalendarView from '@/views/CalendarView.vue'
import { createTestingPinia } from '@pinia/testing'
import { QueryClient, VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { format } from 'date-fns'

describe('CalendarView.vue', () => {
  const renderComponent = () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        station: {
          // for simplicity i'm using the same mock data for the store
          selectedStationId: mockStations[0].id,
          stationValue: mockStations[0],
        },
      },
    })

    const queryClient = new QueryClient()
    return mount(CalendarView, {
      global: {
        plugins: [pinia, router, [VueQueryPlugin, { queryClient } as VueQueryPluginOptions]],
        stubs: ['router-link'],
      },
    })
  }

  it('renders 7 day columns', () => {
    const wrapper = renderComponent()
    const columns = wrapper.findAll('.grid > div')
    expect(columns.length).toBe(7)
  })

  it('displays the correct week title', () => {
    const wrapper = renderComponent()
    const expectedWeek = format(new Date('2020-09-28'), 'dd MMM yyyy') // week of Oct 1st
    expect(wrapper.text()).toContain(`Week of ${expectedWeek}`)
  })

  it('navigates to next and previous weeks', async () => {
    const wrapper = renderComponent()

    const buttons = wrapper.findAll('button')

    const prevBtn = buttons.find((btn) => btn.text().includes('← Prev'))
    const nextBtn = buttons.find((btn) => btn.text().includes('Next →'))

    await nextBtn?.trigger('click')
    expect(wrapper.text()).toContain('Week of 05 Oct 2020')

    await prevBtn?.trigger('click')
    expect(wrapper.text()).toContain('Week of 28 Sep 2020')
  })

  it('renders booking for the day', async () => {
    const wrapper = renderComponent()

    expect(wrapper.text()).toContain('Alden Carter')
  })

  it('calls selectBooking on booking click', async () => {
    const wrapper = renderComponent()

    const spy = vi.spyOn(wrapper.vm as any, 'selectBooking')
    const bookingEl = wrapper.find('.link-to-booking')
    await bookingEl.trigger('click')
    expect(spy).toHaveBeenCalled()
  })
})
