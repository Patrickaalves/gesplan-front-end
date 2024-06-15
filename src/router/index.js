import { createRouter, createWebHistory } from 'vue-router'
import FornecedorView from '../views/FornecedorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FornecedorView
    },    
  ]
})

export default router
