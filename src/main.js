import Vue from 'vue'
import VModal from 'vue-js-modal'
import VueAnalytics from 'vue-analytics'
import axios from 'axios'
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'

import { InlineSvgPlugin } from 'vue-inline-svg'
import Skeleton from './components/Skeleton'
import RichEditor from './components/Editor'
import ResponsePopUp from './components/ResponsePopUp'
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
Vue.component('RichEditor', RichEditor)
Vue.component('ResponsePopUp', ResponsePopUp)

Vue.config.productionTip = false

Vue.mixin({
  methods: {

    // System

    will_body_scroll (state) {
      const body = document.getElementsByTagName('body')[0]
      state ? body.style.overflow = 'auto' : body.style.overflow = 'hidden'
    },

    // Protocol

    pull_protocols (sessionName, text, date) {
      const textNoHTML = text.replace(/<[^>]*>?/gm, '')
      const tempStore = []
      let m
      while ((m = this.regexExtract.exec(textNoHTML)) !== null) {
        if (m.index === this.regexExtract.lastIndex) {
          this.regexExtract.lastIndex++
        }
        m.forEach((match, groupIndex) => {
          if (groupIndex === 0) {
            tempStore.push(sessionName)
          } else if (groupIndex === 1 || groupIndex === 2) {
            tempStore.push(match)
            if (groupIndex === 2) {
              tempStore.push(date)
            }
          }
        })
      }
      if (tempStore !== null) {
        const tempArray = []
        for (let index = 0; index < tempStore.length; index += 4) {
          const dataPacket = tempStore.slice(index, index + 4)
          tempArray.push(dataPacket)
        }
        return tempArray
      }
    },

    // Date

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

    // Tidy

    sort_sessions (plan) {
      if (plan.sessions) {
        plan.sessions.sort((a, b) => {
          return new Date(a.date) - new Date(b.date)
        })
      }
    },
    remove_brackets_and_checkbox (dataIn) {
      return dataIn !== null ? dataIn.replace(/[[\]]/g, '').replace(/<input /gmi, '<input disabled ').replace('onclick="resize(this)"', '') : dataIn
    },
    proper_case (string) {
      const sentence = string.toLowerCase().split(' ')
      for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
      }
      return sentence.join(' ')
    },
    update_content (html) {
      let m
      const arr = []
      const updateIframeRegex = /<iframe.*?><\/iframe>/gmi
      const updateURLRegex = /src="(.*?)"/gmi
      while ((m = updateIframeRegex.exec(html)) !== null) {
        if (m.index === updateIframeRegex.lastIndex) {
          updateIframeRegex.lastIndex++
        }
        m.forEach((iframeMatch) => {
          const url = iframeMatch.match(updateURLRegex)[0].replace('src=', '').replace(/"/g, '')
          arr.push([iframeMatch, url])
        })
      }
      if (arr.length !== 0) {
        arr.forEach((item) => {
          html = html.replace(item[0], `<a href="${item[1]}" target="_blank">Watch video</a>`)
        })
      }
      return html
    },

    // Other

    accessible_colors (hex) {
      if (hex !== undefined) {
        hex = hex.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        const result = ((((r * 299) + (g * 587) + (b * 114)) / 1000) - 128) * -1000
        return `rgb(${result}, ${result}, ${result})`
      }
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
