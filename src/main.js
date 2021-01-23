import Vue from 'vue'
import VModal from 'vue-js-modal'
import VueAnalytics from 'vue-analytics'
import axios from 'axios'
import { InlineSvgPlugin } from 'vue-inline-svg'
import Skeleton from './components/Skeleton'
import App from './App'
import router from './router'

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
Vue.use(Skeleton)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
