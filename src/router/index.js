import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@okta/okta-vue'

const LoginComponent = () => import(/* webpackChunkName: "login" */ '@/pages/Login')
const ProfileComponent = () => import(/* webpackChunkName: "account" */ '@/pages/Account')
const LogoutComponent = () => import(/* webpackChunkName: "logout" */ '@/pages/Logout')
const NotFound = () => import(/* webpackChunkName: "notfound" */ '@/pages/NotFound')
const ArchiveComponent = () => import(/* webpackChunkName: "archive" */ '@/pages/Archive')
const TemplateComponent = () => import(/* webpackChunkName: "templates" */ '@/pages/Templates')
const PortfolioComponent = () => import(/* webpackChunkName: "portfolio" */ '@/pages/Portfolio')

const ClientComponent = () => import(/* webpackChunkName: "client.home" */ '@/pages/_client/Home')
const ClientPlans = () => import(/* webpackChunkName: "client.plans" */ '@/pages/_client/Plans')
const ClientSessions = () => import(/* webpackChunkName: "client.sessions" */ '@/pages/_client/Sessions')

const ClientUserComponent = () => import(/* webpackChunkName: "client-user.home" */ '@/pages/_clientUser/Home')
const ClientUserPlans = () => import(/* webpackChunkName: "client-user.plans" */ '@/pages/_clientUser/Plans')

const HomeComponent = () => import(/* webpackChunkName: "home" */ '@/pages/Home')

Vue.use(Router)
Vue.use(Auth, {
  issuer: process.env.ISSUER + '/oauth2/default',
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.NODE_ENV === 'production' ? 'https://' + window.location.host + '/implicit/callback' : 'http://' + window.location.host + '/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  autoRenew: false,
  async onSessionExpired () {
    await Vue.$auth.logout({ postLogoutRedirectUri: process.env.NODE_ENV === 'production' ? 'https://' + window.location.host + '/implicit/callback' : 'http://' + window.location.host + '/implicit/callback' })
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
      path: '/portfolio',
      component: PortfolioComponent,
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
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
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
    const claims = await Vue.prototype.$auth.getUser()
    if (claims !== undefined && claims !== null) {
      localStorage.setItem('claims', JSON.stringify(claims))
      result = claims
    } else {
      result = false
    }
  } else if (localStorage.getItem('claims')) {
    result = JSON.parse(localStorage.getItem('claims'))
  } else {
    result = false
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
