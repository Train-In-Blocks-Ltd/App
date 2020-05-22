import Vue from 'vue'
import App from './App'
import router from './router'
import VueQuill from 'vue-quill'
import 'quill/dist/quill.snow.css'
import VueDragscroll from 'vue-dragscroll'
import VModal from 'vue-js-modal'

Vue.use(VueQuill)
Vue.use(VueDragscroll)
Vue.use(VModal)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
