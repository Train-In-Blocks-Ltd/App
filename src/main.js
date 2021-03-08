import Vue from 'vue'
import VModal from 'vue-js-modal'
import VueAnalytics from 'vue-analytics'
import axios from 'axios'
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'

import { InlineSvgPlugin } from 'vue-inline-svg'
import Skeleton from './components/Skeleton'
import App from './App'
import router from './router'

loadProgressBar()

Vue.prototype.$axios = axios

Vue.use(VueAnalytics, {
  id: 'UA-167770206-2',
  router,
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  },
  disabled: true
})
Vue.use(VModal)
Vue.use(InlineSvgPlugin)

// Register component globally
Vue.component('Skeleton', Skeleton)

Vue.config.productionTip = false

Vue.mixin({
  methods: {

    // Shared

    today () {
      const d = new Date()
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const dayDate = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${dayDate}`
    },
    day (date) {
      const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return weekday[new Date(date).getDay()]
    },

    // Organise

    sort_sessions (plan) {
      plan.sessions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
