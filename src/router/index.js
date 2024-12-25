import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import LoginView from '@/components/auth/LoginView.vue'
import InscriptionView from '@/components/auth/InscriptionView.vue'
import MainView from '@/views/MainView.vue'
import NotFoundView from '@/views/404Page.vue'
import HomeView from '@/components/main/HomeView.vue'
import CryptoChart from '@/components/main/CryptoChart.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/app/login',
    },
    {
      path: '/app',
      component: AuthView,
      redirect: '/app/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginView,
        },
        {
          path: 'inscription',
          name: 'inscription',
          component: InscriptionView,
        },
      ],
    },
    {
      path: '/app/accueil',
      name: 'accueil',
      component: MainView,
      redirect: '/app/accueil/v1',
      children: [
        {
          path: 'v1',
          name: 'v1',
          component: HomeView,
        },
        {
          path: 'chart',
          name: 'chart',
          component: CryptoChart,
        },
      ],
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

export default router
