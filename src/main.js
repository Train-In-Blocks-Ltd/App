import Vue from 'vue'
import App from './App'
import router from './router'
import VueQuill from 'vue-quill'
import 'quill/dist/quill.snow.css'
import VueDragscroll from 'vue-dragscroll'
import VModal from 'vue-js-modal'
import VueAnalytics from 'vue-analytics'
import VueInputAutowidth from 'vue-input-autowidth'
 
Vue.use(VueAnalytics, {
  id: 'UA-167770206-2',
  router,
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  },
  disabled: true
})
Vue.use(VueQuill)
Vue.use(VueDragscroll)
Vue.use(VModal)
Vue.use(VueInputAutowidth)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
