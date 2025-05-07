import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import AppAutocomplete from '@/components/AppAutocomplete.vue'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import { createTestingPinia } from '@pinia/testing'
// Ensure you use your actual fetchStations and data source
import { useStationStore } from '@/stores/station'

const { fetchStations } = await import('@/mockData/api')

vi.mock('@/mockData/api', async () => ({
  fetchStations: vi.fn().mockResolvedValue([{ id: '1', name: 'Berlin' }]), // for simplicity i'm reusing the same mock data
}))

describe('AppAutocomplete.vue - Integration', () => {
  let wrapper: ReturnType<typeof mount>
  let store: ReturnType<typeof useStationStore>

  const mountComponent = async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    })

    const queryClient = new QueryClient()

    wrapper = mount(AppAutocomplete, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient } as VueQueryPluginOptions]],
      },
    })

    store = useStationStore()
    await flushPromises()
  }

  beforeEach(async () => {
    await mountComponent()
    store.reset()
  })

  it('renders stations after typing and clicking', async () => {
    const allStations = await fetchStations()
    const input = wrapper.get('input')
    await input.setValue('Ber')
    await input.trigger('input')
    await flushPromises()

    const matches = allStations!.filter((s) => s.name.toLowerCase().includes('Ber'.toLowerCase()))

    if (matches.length) {
      const listItems = wrapper.findAll('li')
      expect(listItems.length).toBe(matches.length)
      expect(listItems[0].text()).toBe(matches[0].name)
    } else {
      expect(wrapper.text()).toContain('No stations found.')
    }
  })

  it('selects a station and updates store', async () => {
    const input = wrapper.get('input')

    // Use at least 2 characters to trigger filtering
    await input.setValue('Ber')
    await input.trigger('input')

    await flushPromises()
    await wrapper.vm.$nextTick()

    const listItems = wrapper.findAll('li')
    expect(listItems.length).toBeGreaterThan(0)

    const firstItem = listItems[0]
    await firstItem.trigger('click')

    expect(store.stationValue).toBeTruthy()
    expect(store.stationValue?.name).toBe(firstItem.text())
    expect((input.element as HTMLInputElement).value).toBe(firstItem.text())
  })

  it('disables input if store has selected station', async () => {
    const stations = await fetchStations()
    store.setStation(stations![0])

    await flushPromises()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$forceUpdate()

    const input = wrapper.get('input')
    expect((input.element as HTMLInputElement).disabled).toBe(true)
  })

  it('clears selected station when clicking ×', async () => {
    const stations = await fetchStations()
    store.setStation(stations![0])

    await wrapper.vm.$nextTick()

    const clearButton = wrapper.find('button')
    expect(clearButton.exists()).toBe(true)
    await clearButton.trigger('click')

    expect(store.stationValue).toBeNull()
    expect(store.selectedStationId).toBeNull()
  })
})
