import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import LoginView from '@/components/auth/LoginView.vue'
import InscriptionView from '@/components/auth/InscriptionView.vue'
import MainView from '@/views/MainView.vue'
import NotFoundView from '@/views/404Page.vue'
import HomeView from '@/components/main/HomeView.vue'
import ProfilView from '@/components/main/ProfilView.vue'
import CryptoModel from '@/components/main/CryptoModel.vue'

// modification Voahary
import AchatCrypto from '@/components/main/AchatCrypto.vue'
import VenteCrypto from '@/components/main/VenteCrypto.vue'
import UserCrypto from '@/components/main/UserCrypto.vue'
import TransactionCrypto from '@/components/main/TransactionCrypto.vue'
// end of modification import Voahary


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
          path: 'profil',
          name: 'profil',
          component: ProfilView,
        },
        {
          path: 'crypto',
          name: 'crypto',
          component: CryptoModel,
        },
      ],
    }, 
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView,
    },

    // modification Voahary

    { path: '/achat', name: 'AchatCrypto', component: AchatCrypto },
    { path: '/vente', name: 'VenteCrypto', component: VenteCrypto },
    { path: '/user-crypto', name: 'UserCrypto', component: UserCrypto },
    { path: '/crypto-transaction', name: 'CryptoTransaction', component: TransactionCrypto },

    // End of modification chemin Voahary
  ],
})

export default router
