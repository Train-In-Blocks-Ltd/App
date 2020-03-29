import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@okta/okta-vue'

import HomeComponent from '@/components/Home'
import LoginComponent from '@/components/Login'
import ProfileComponent from '@/components/Account'
import UpdateComponent from '@/components/AccountUpdate'
import LogoutComponent from '@/components/Logout'
import ClientComponent from '@/components/Client'

Vue.use(Router)
Vue.use(Auth, {
  issuer: 'https://dev-183252.okta.com/oauth2/default',
  clientId: '0oa3xeljtDMSTwJ3h4x6',
  redirectUri: 'https://app.traininblocks.com/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  autoRenew: true
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
      }
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
