import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import axios from 'axios'
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'

import { InlineSvgPlugin } from 'vue-inline-svg'
import Skeleton from './components/Skeleton'
import ResponsePopUp from './components/ResponsePopUp'
import ConfirmPopUp from './components/ConfirmPopUp'
import GlobalOverlay from './components/GlobalOverlay'
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
Vue.use(InlineSvgPlugin)

// Register component globally
Vue.component('Skeleton', Skeleton)
Vue.component('ResponsePopUp', ResponsePopUp)
Vue.component('ConfirmPopUp', ConfirmPopUp)
Vue.component('GlobalOverlay', GlobalOverlay)

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
      const REGEX_EXTRACT_EXERCISES = /\[\s*(.*?)\s*:\s*(.*?)\]/gi
      const HTML_REMOVED_TAGS = text.replace(/<[^>]*>?/gm, '')
      const TEMPORARY_STORE = []
      let finder
      while ((finder = REGEX_EXTRACT_EXERCISES.exec(HTML_REMOVED_TAGS)) !== null) {
        if (finder.index === REGEX_EXTRACT_EXERCISES.lastIndex) {
          REGEX_EXTRACT_EXERCISES.lastIndex++
        }
        finder.forEach((match, groupIndex) => {
          if (groupIndex === 0) {
            TEMPORARY_STORE.push(sessionName)
          } else if (groupIndex === 1 || groupIndex === 2) {
            TEMPORARY_STORE.push(match)
            if (groupIndex === 2) {
              TEMPORARY_STORE.push(date)
            }
          }
        })
      }
      if (TEMPORARY_STORE !== null) {
        const tempArray = []
        for (let index = 0; index < TEMPORARY_STORE.length; index += 4) {
          const dataPacket = TEMPORARY_STORE.slice(index, index + 4)
          tempArray.push(dataPacket)
        }
        return tempArray
      }
    },

    // HTML

    update_html (html, rmBrackets) {
      if (html === null) {
        return html
      }
      const regexIframe = /<iframe[^>]+src="([^"]+)"><\/iframe>/gi
      let m
      const arr1 = []
      // Finds all iframes
      while ((m = regexIframe.exec(html)) !== null) {
        if (m.index === regexIframe.lastIndex) {
          regexIframe.lastIndex++
        }
        const tempArray = []
        m.forEach((match, groupIndex) => {
          if (groupIndex === 1) {
            tempArray.push(match)
            arr1.push(tempArray)
          } else {
            tempArray.push(match)
          }
        })
      }
      // Removes iframes
      arr1.forEach((item) => {
        html = html.replace(item[0], `<a href="${item[1]}" rel="noopener noreferrer nofollow">Watch video</a>`)
      })
      html = rmBrackets ? html.replace(/[[\]]/g, '') : html
      return html.replace('onclick="resize(this)"', '').replace('contenteditable="true"', '')
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
    proper_case (string) {
      const sentence = string.toLowerCase().split(' ')
      for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
      }
      return sentence.join(' ')
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
