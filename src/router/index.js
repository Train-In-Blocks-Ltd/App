import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@okta/okta-vue'

import HomeComponent from '@/components/pages/Home'
import LoginComponent from '@/components/pages/Login'
import ProfileComponent from '@/components/pages/Account'
import LogoutComponent from '@/components/pages/Logout'
import ClientComponent from '@/components/pages/Client'
import NotFound from '@/components/pages/NotFound'
import ArchiveComponent from '@/components/pages/Archive'
import HelpComponent from '@/components/pages/Help'

import ClientBlocks from '@/components/pages/_client/ClientBlocks'
import ClientWorkouts from '@/components/pages/_client/ClientWorkouts'

import ClientUserComponent from '@/components/pages/clientUser/Home'
import ClientUserBlocks from '@/components/pages/clientUser/Block'

Vue.use(Router)
Vue.use(Auth, {
  issuer: process.env.ISSUER + '/oauth2/default',
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.CONTEXT === 'branch-deploy' ? 'https://dev.app.traininblocks.com/implicit/callback' : process.env.URL + '/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  autoRenew: false,
  onSessionExpired: async function () {
    await Vue.$auth.logout({postLogoutRedirectUri: process.env.URL + '/login'})
  }
})

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: HomeComponent,
      meta: {
        requiresAuth: true,
        requiresTrainer: true
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
      path: '/account',
      component: ProfileComponent,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/help',
      component: HelpComponent,
      meta: {
        requiresAuth: true,
        requiresTrainer: true
      }
    },
    {
      path: '/client/:client_id',
      component: ClientComponent,
      meta: {
        requiresAuth: true,
        requiresTrainer: true
      },
      children: [
        {
          path: '',
          component: ClientBlocks,
          name: 'blocks',
          meta: {
            requiresAuth: true,
            requiresTrainer: true
          }
        },
        {
          path: 'block/:id',
          component: ClientWorkouts,
          name: 'workouts',
          meta: {
            requiresAuth: true,
            requiresTrainer: true
          }
        }
      ]
    },
    {
      path: '/clientUser',
      component: ClientUserComponent,
      meta: {
        requiresAuth: true,
        requiresClient: true
      }
    },
    {
      path: '/clientUser/block/:id',
      component: ClientUserBlocks,
      meta: {
        requiresAuth: true,
        requiresClient: true
      }
    },
    {
      path: '/archive',
      component: ArchiveComponent,
      meta: {
        requiresAuth: true,
        requiresTrainer: true
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

const userType = async (from, to, next) => {
  let result
  if (!localStorage.getItem('claims')) {
    let claims = await Vue.prototype.$auth.getUser()
    if (claims !== undefined && claims !== null) {
      localStorage.setItem('claims', JSON.stringify(claims))
      result = claims
    } else {
      result = false
    }
  } else {
    if (localStorage.getItem('claims')) {
      result = JSON.parse(localStorage.getItem('claims'))
    } else {
      result = false
    }
  }
  if (result) {
    if (from.matched.some(record => record.meta.requiresTrainer)) {
      if (result.user_type === 'Admin') {
        next()
      } else if (result.user_type === 'Client') {
        // Navigate to Client Homepage
        next({ path: '/clientUser' })
      } else {
        next()
      }
    } else if (from.matched.some(record => record.meta.requiresClient)) {
      if (result.user_type === 'Admin') {
        next()
      } else if (result.user_type === 'Trainer') {
        // Navigate to Trainer Homepage
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
}

router.beforeEach(onAuthRequired)
router.beforeEach(userType)

export default router
