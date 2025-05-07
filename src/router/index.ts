import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('@/views/CalendarView.vue'),
    },
    {
      path: '/:stationId/booking/:bookingId?',
      name: 'Booking',
      component: () => import('@/views/BookingView.vue'),
      props: true,
    },
  ],
})

export default router
