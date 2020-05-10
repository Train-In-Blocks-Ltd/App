import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@okta/okta-vue'

import HomeComponent from '@/components/pages/Home'
import LoginComponent from '@/components/pages/Login'
import ProfileComponent from '@/components/pages/Account'
import UpdateComponent from '@/components/pages/AccountUpdate'
import LogoutComponent from '@/components/pages/Logout'
import ClientComponent from '@/components/pages/Client'
import NotFound from '@/components/pages/NotFound'
import ArchiveComponent from '@/components/pages/Archive'

import ClientProgrammes from '@/components/pages/_client/ClientProgrammes'
import ClientBlocks from '@/components/pages/_client/ClientBlocks'

Vue.use(Router)
Vue.use(Auth, {
  issuer: process.env.ISSUER + '/oauth2/default',
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.URL + '/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  autoRenew: false
})

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: HomeComponent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      component: LoginComponent
    },
    {
      path: '/logout',
      component: LogoutComponent
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/update-details',
      component: UpdateComponent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/account',
      component: ProfileComponent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/client/:name',
      component: ClientComponent,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          component: ClientProgrammes,
          name: 'programmes',
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'blocks/:id',
          component: ClientBlocks,
          name: 'blocks',
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/archive',
      component: ArchiveComponent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

const onAuthRequired = async (from, to, next) => {
  if (from.matched.some(record => record.meta.requiresAuth) && !(await Vue.prototype.$auth.isAuthenticated())) {
    // Navigate to custom login page
    next({ path: '/login' })
  } else {
    next()
  }
}

router.beforeEach(onAuthRequired)

export default router
