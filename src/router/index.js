import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashBoard from '../views/DashBoard.vue'
import Users from '../views/Users.vue'
import Anexo from '../views/Anexo.vue'
import Empresas from '../views/Empresas.vue'
import Datastage from '../views/Datastage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoard
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/anexo30',
      name: 'anexo30',
      component: Anexo
    },
    {
      path: '/empresas',
      name: 'empresas',
      component: Empresas
    },
    {
      path: '/datastage',
      name: 'datastage',
      component: Datastage
    },
  ]
})

export default router
