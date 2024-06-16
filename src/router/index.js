import { createRouter, createWebHistory } from 'vue-router'
import FornecedorView from '../views/FornecedorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/desafio',
      name: 'desafio',
      component: FornecedorView
    },    
  ]
})

export default router
