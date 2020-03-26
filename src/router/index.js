import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@okta/okta-vue'

import HomeComponent from '@/components/Home'
import LoginComponent from '@/components/Login'
import ProfileComponent from '@/components/Account'

Vue.use(Router)
Vue.use(Auth, {
  issuer: 'https://dev-183252.okta.com/oauth2/default',
  clientId: '0oa3xeljtDMSTwJ3h4x6',
  redirectUri: 'https://app.traininblocks.com/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
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
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/account',
      component: ProfileComponent,
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
