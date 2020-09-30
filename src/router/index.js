import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@okta/okta-vue'

import HomeComponent from '@/pages/Home'
import LoginComponent from '@/pages/Login'
import ProfileComponent from '@/pages/Account'
import LogoutComponent from '@/pages/Logout'
import NotFound from '@/pages/NotFound'
import ArchiveComponent from '@/pages/Archive'
import TemplateComponent from '@/pages/Templates'

import ClientComponent from '@/pages/_client/Home'
import ClientPlans from '@/pages/_client/Plans'
import ClientSessions from '@/pages/_client/Sessions'

import ClientUserComponent from '@/pages/_clientUser/Home'
import ClientUserPlans from '@/pages/_clientUser/Plans'

Vue.use(Router)
Vue.use(Auth, {
  issuer: process.env.ISSUER + '/oauth2/default',
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.NODE_ENV === 'production' ? 'https://' + window.location.host + '/implicit/callback' : 'http://' + window.location.host + '/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  autoRenew: false,
  onSessionExpired: async function () {
    await Vue.$auth.logout({postLogoutRedirectUri: process.env.NODE_ENV === 'production' ? 'https://' + window.location.host + '/implicit/callback' : 'http://' + window.location.host + '/implicit/callback'})
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
      path: '/templates',
      component: TemplateComponent,
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
          component: ClientPlans,
          name: 'plans',
          meta: {
            requiresAuth: true,
            requiresTrainer: true
          }
        },
        {
          path: 'plan/:id',
          component: ClientSessions,
          name: 'sessions',
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
      path: '/clientUser/plan/:id',
      component: ClientUserPlans,
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
  ],
  scrollBehavior () {
    document.querySelector('#main').scrollTop = 0
  }
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
