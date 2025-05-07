import { describe, expect, it, vi } from 'vitest'

import CalendarView from '@/views/CalendarView.vue'
import { createTestingPinia } from '@pinia/testing'
import { format } from 'date-fns'
import { mount } from '@vue/test-utils'
import router from '@/router'

describe('CalendarView.vue', () => {
  const renderComponent = () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })

    return mount(CalendarView, {
      global: {
        plugins: [pinia, router],
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
})
