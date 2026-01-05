import { createRouter, createWebHistory } from 'vue-router'
import Authoring from '../components/Authoring.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Authoring,
    },
    
  ],
})

export default router
