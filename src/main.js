import Vue from 'vue'
import './polyfills'
import App from './App'
import router from './router'
import VueQuill from 'vue-quill'
import 'quill/dist/quill.snow.css'

Vue.use(VueQuill)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
