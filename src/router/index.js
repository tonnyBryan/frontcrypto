import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import LoginView from '@/components/auth/LoginView.vue'
import InscriptionView from '@/components/auth/InscriptionView.vue'
import MainView from '@/views/MainView.vue'
import NotFoundView from '@/views/404Page.vue'
import HomeView from '@/components/main/HomeView.vue'
import ProfilView from '@/components/main/ProfilView.vue'
import CryptoModel from '@/components/main/CryptoModel.vue'
import AchatCrypto from '@/components/main/AchatCrypto.vue'
import VenteCrypto from '@/components/main/VenteCrypto.vue'
import MainViewAdmin from '@/views/MainViewAdmin.vue'
import TransactionRequest from '@/components/main/TransactionRequest.vue'
import AppConfig from '@/components/main/AppConfig.vue'
import HistoryView from '@/components/main/HistoryView.vue'

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
      path: '/app/v1',
      name: 'accueil',
      component: MainView,
      redirect: '/app/v1/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'profil',
          name: 'profil',
          component: ProfilView,
        },
        {
          path: 'crypto',
          name: 'crypto',
          component: CryptoModel,
        },
        {
          path: 'achat',
          name: 'cryptoAchat',
          component: AchatCrypto,
        },
        {
          path: 'vente',
          name: 'cryptoVente',
          component: VenteCrypto,
        },
        {
          path: 'history',
          name: 'history',
          component: HistoryView,
        },
      ],
    },
    {
      path: '/app/backoffice',
      name: 'adminpage',
      component: MainViewAdmin,
      redirect: '/app/backoffice/request',
      children: [
        {
          path: 'request',
          name: 'request',
          component: TransactionRequest,
        },
        {
          path: 'config',
          name: 'config',
          component: AppConfig,
        }
      ]
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

export default router
