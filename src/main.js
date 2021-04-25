import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import axios from 'axios'
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'

import { InlineSvgPlugin } from 'vue-inline-svg'
import Skeleton from './components/Skeleton'
import ResponsePopUp from './components/ResponsePopUp'
import ConfirmPopUp from './components/ConfirmPopUp'
import InputPopUp from './components/InputPopUp'
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
Vue.component('InputPopUp', InputPopUp)
Vue.component('GlobalOverlay', GlobalOverlay)

Vue.config.productionTip = false

Vue.mixin({
  methods: {

    // System

    will_body_scroll (state) {
      const BODY = document.getElementsByTagName('body')[0]
      state ? BODY.style.overflow = 'auto' : BODY.style.overflow = 'hidden'
    },

    // Protocol

    pull_protocols (sessionName, text, sessionDate) {
      const REGEX_EXTRACT_EXERCISES = /\[\s*(.*?)\s*:\s*(.*?)\]/gi
      const HTML_REMOVED_TAGS = text.replace(/<[^>]*>?/gm, '')
      const RETURN_PACKETS = []
      let finder
      while ((finder = REGEX_EXTRACT_EXERCISES.exec(HTML_REMOVED_TAGS)) !== null) {
        if (finder.index === REGEX_EXTRACT_EXERCISES.lastIndex) {
          REGEX_EXTRACT_EXERCISES.lastIndex++
        }
        const PACKET_BUILDER = {
          sessionName,
          sessionDate,
          exerciseName: null,
          exerciseProtocol: null
        }
        finder.forEach((match, groupIndex) => {
          if (groupIndex === 1) {
            PACKET_BUILDER.exerciseName = match
          } else if (groupIndex === 2) {
            PACKET_BUILDER.exerciseProtocol = match
          }
        })
        RETURN_PACKETS.push(PACKET_BUILDER)
      }
      return RETURN_PACKETS
    },

    // HTML

    update_html (html, rmBrackets) {
      if (html === null) {
        return html
      }
      const REGEX_IFRAME = /<iframe[^>]+src="([^"]+)"><\/iframe>/gi
      let m
      const TO_UPDATE_ARRAY = []
      // Finds all iframes
      while ((m = REGEX_IFRAME.exec(html)) !== null) {
        if (m.index === REGEX_IFRAME.lastIndex) {
          REGEX_IFRAME.lastIndex++
        }
        const MATCH_EXTRACT_COLLECTOR = []
        m.forEach((match, groupIndex) => {
          if (groupIndex === 1) {
            MATCH_EXTRACT_COLLECTOR.push(match)
            TO_UPDATE_ARRAY.push(MATCH_EXTRACT_COLLECTOR)
          } else {
            MATCH_EXTRACT_COLLECTOR.push(match)
          }
        })
      }
      // Removes iframes
      TO_UPDATE_ARRAY.forEach((item) => {
        html = html.replace(item[0], `<a href="${item[1]}" rel="noopener noreferrer nofollow">Watch video</a>`)
      })
      html = rmBrackets ? html.replace(/[[\]]/g, '') : html
      return html.replace('onclick="resize(this)"', '').replace(/contenteditable="true"/gi, '')
    },

    // Date

    today () {
      const DATE = new Date()
      const YEAR = DATE.getFullYear()
      const MONTH = String(DATE.getMonth() + 1).padStart(2, '0')
      const DAY = String(DATE.getDate()).padStart(2, '0')
      return `${YEAR}-${MONTH}-${DAY}`
    },
    day (date) {
      const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return WEEKDAY[new Date(date).getDay()]
    },
    add_days (date, days) {
      const DATE = new Date(date)
      DATE.setDate(DATE.getDate() + days)
      const YEAR = DATE.getFullYear()
      const MONTH = DATE.getMonth() + 1
      const DAY = DATE.getDate()
      return `${YEAR}-${MONTH}-${DAY}`
    },

    // Tidy

    sort_sessions (plan) {
      if (plan.sessions) {
        plan.sessions.sort((a, b) => {
          return new Date(a.date) - new Date(b.date)
        })
      }
      return plan
    },
    proper_case (string) {
      const SENTENCE = string.toLowerCase().split(' ')
      for (let i = 0; i < SENTENCE.length; i++) {
        SENTENCE[i] = SENTENCE[i][0].toUpperCase() + SENTENCE[i].slice(1)
      }
      return SENTENCE.join(' ')
    },

    // Other

    accessible_colors (hex) {
      if (hex !== undefined) {
        hex = hex.replace('#', '')
        const RED = parseInt(hex.substring(0, 2), 16)
        const GREEN = parseInt(hex.substring(2, 4), 16)
        const BLUE = parseInt(hex.substring(4, 6), 16)
        const RESULT = ((((RED * 299) + (GREEN * 587) + (BLUE * 114)) / 1000) - 128) * -1000
        return `rgb(${RESULT}, ${RESULT}, ${RESULT})`
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
