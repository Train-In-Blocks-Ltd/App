import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { deleteEmail, deleteEmailText, passChangeEmail, passChangeEmailText, feedbackEmail, feedbackEmailText } from '../components/email'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {

    // Auth

    authenticated: false,
    isTrainer: false,
    claims: {
      user_type: 0
    },

    // System

    instanceReady: false,
    loading: false,
    silentLoading: false,
    dontLeave: false,
    noClients: true,
    pwa: {
      deferredPrompt: null,
      displayMode: 'browser tab',
      canInstall: false,
      installed: null
    },
    connected: true,

    // Bookings
    bookings: [],

    // Clients

    clients: null,
    clientDetails: null,
    clientUser: {
      plans: null,
      profile_image: null,
      sessionsToday: [],
      bookings: []
    },

    // Portfolio

    portfolio: {
      business_name: '',
      trainer_name: '',
      notes: ''
    },

    // Products
    products: [],

    // Template

    templates: null,

    // archive

    archive: {
      clients: {},
      noArchive: true
    },

    // Versioning

    policyVersion: '1.1',
    versionName: 'Pegasus',
    versionBuild: '3.2.5',
    newBuild: false,
    showEULA: false
  },
  mutations: {
    // System
    setData (state, payload) {
      state[payload.attr] = payload.data
      if (payload.attr === 'clients') {
        state.noClients = state.clients.length === 0
      }
    },
    setDataDeep (state, payload) {
      state[payload.attrParent][payload.attrChild] = payload.data
      if (payload.attrParent === 'archive') {
        state.archive.noArchive = state.archive.clients.length === 0
      }
    },
    addNewClient (state, payload) {
      state.clients.push({
        ...payload
      })
    },
    updateClient (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      CLIENT[payload.attr] = payload.data
    },
    archiveClient (state, client) {
      const IDX = state.clients.indexOf(client)
      state.clients.splice(IDX, 1)
    },
    unarchiveClient (state, payload) {
      payload.forEach((clientId) => {
        const CLIENT = state.archive.clients.find(client => client.client_id === clientId)
        const IDX = state.archive.clients.indexOf(CLIENT)
        state.archive.clients.splice(IDX, 1)
        state.clients.push(CLIENT)
        state.clients.sort((a, b) => {
          const NAME_A = a.name.toUpperCase()
          const NAME_B = b.name.toUpperCase()
          return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
        })
      })
    },
    removeClient (state, payload) {
      payload.forEach((clientId) => {
        const CLIENT = state.archive.clients.find(client => client.client_id === parseInt(clientId))
        state.archive.clients.splice(state.archive.clients.indexOf(CLIENT), 1)
      })
    },

    // Plans
    addNewPlan (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.client_id))
      CLIENT.plans.push({
        ...payload
      })
    },
    updateEntirePlan (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.client_id))
      for (let plan of CLIENT.plans) {
        if (plan.id === payload.id) {
          plan = payload
        }
      }
    },
    updatePlanAttr (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      PLAN[payload.attr] = payload.data
    },
    removePlan (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      CLIENT.plans.splice(CLIENT.plans.indexOf(PLAN), 1)
    },

    // Sessions
    addNewSession (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.client_id))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.programme_id))
      delete payload.client_id
      if (!PLAN.sessions) {
        PLAN.sessions = []
      }
      PLAN.sessions.push({
        ...payload
      })
    },
    updateAllSessions (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      PLAN.sessions = payload.data
    },
    updateSessionAttr (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
      SESSION[payload.attr] = payload.data
    },
    removeSession (state, payload) {
      payload.sessionIds.forEach((sessionId) => {
        const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
        const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
        const SESSION = PLAN.sessions.find(session => session.id === sessionId)
        PLAN.sessions.splice(PLAN.sessions.indexOf(SESSION), 1)
      })
    },

    // Templates
    addNewTemplate (state, payload) {
      state.templates.push({
        id: payload.templateId,
        pt_id: payload.ptId,
        name: payload.name,
        template: payload.template
      })
    },
    removeTemplate (state, payload) {
      payload.forEach((templateId) => {
        const TEMPLATE = state.templates.find(template => template.id === templateId)
        state.templates.splice(state.templates.indexOf(TEMPLATE), 1)
      })
    },

    // Bookings

    // payload => client_id, id (booking), date, time, notes, status
    addNewBooking (state, payload) {
      state.bookings.push({ ...payload })
    },
    // payload => bookingId
    removeBooking (state, payload) {
      const BOOKING = state.bookings.find(booking => booking.id === parseInt(payload.bookingId))
      state.bookings.splice(state.bookings.indexOf(BOOKING), 1)
    },

    // Bookings

    // payload => client_id, id (booking), date, time, notes, status
    addNewProduct (state, payload) {
      state.products.push({ ...payload })
    },
    // payload => bookingId
    removeProduct (state, productIds) {
      productIds.forEach((productId) => {
        const PRODUCT = state.products.find(product => product.id === parseInt(productId))
        state.products.splice(state.products.indexOf(PRODUCT), 1)
      })
    },

    // Client user

    updateClientUserProfileImage (state, payload) {
      state.clientUser.profile_image = payload
    },
    updateClientUserPlanSessions (state, payload) {
      const PLAN = state.clientUser.plans.find(plan => plan.id === parseInt(payload.planId))
      PLAN[payload.attr] = payload.data

      const today = () => {
        const DATE = new Date()
        const YEAR = DATE.getFullYear()
        const MONTH = String(DATE.getMonth() + 1).padStart(2, '0')
        const DAY = String(DATE.getDate()).padStart(2, '0')
        return `${YEAR}-${MONTH}-${DAY}`
      }
      for (const SESSION of PLAN.sessions) {
        if (SESSION.date === today() && !state.clientUser.sessionsToday.includes(SESSION.id)) {
          state.clientUser.sessionsToday.push({ planId: parseInt(payload.planId), ...SESSION })
        }
      }
    },
    updateClientUserPlanSingleSession (state, payload) {
      const PLAN = state.clientUser.plans.find(plan => plan.id === parseInt(payload.planId))
      const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
      SESSION[payload.attr] = payload.data
    }
  },
  actions: {

    // System

    endLoading ({ commit }) {
      commit('setData', {
        attr: 'loading',
        data: false
      })
      commit('setData', {
        attr: 'silentLoading',
        data: false
      })
      commit('setData', {
        attr: 'dontLeave',
        data: false
      })
    },
    async resolveDeepError ({ dispatch, state }, msg) {
      if (state.claims.user_type !== 'Admin') {
        await axios.post('/.netlify/functions/error', {
          msg,
          claims: state.claims
        })
      }
      dispatch('endLoading')
      console.error(msg)
    },
    async getHighLevelData ({ dispatch, commit, state }) {
      // Main data call
      const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/${state.claims.sub}`)

      // Sets clients
      const SORTED_CLIENTS = RESPONSE.data[0].sort((a, b) => {
        const NAME_A = a.name.toUpperCase()
        const NAME_B = b.name.toUpperCase()
        return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
      })
      commit('setData', {
        attr: 'clients',
        data: SORTED_CLIENTS
      })

      // Sets archive
      const SORTED_ARCHIVE_CLIENTS = RESPONSE.data[1].sort((a, b) => {
        const NAME_A = a.name.toUpperCase()
        const NAME_B = b.name.toUpperCase()
        return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
      })
      commit('setDataDeep', {
        attrParent: 'archive',
        attrChild: 'clients',
        data: SORTED_ARCHIVE_CLIENTS
      })

      // Sets templates and portfolio
      commit('setData', {
        attr: 'templates',
        data: RESPONSE.data[2]
      })

      if (RESPONSE.data[3].length === 0) {
        await dispatch('createPortfolio')
      } else {
        commit('setData', {
          attr: 'portfolio',
          data: { ...RESPONSE.data[3][0] }
        })
      }

      // Sets bookings
      commit('setData', {
        attr: 'bookings',
        data: RESPONSE.data[4]
      })
    },

    // Sets templates

    // Clients

    async createClient ({ commit }, payload) {
      const NEW_CLIENT = await axios.put('https://api.traininblocks.com/v2/clients', {
        ...payload
      })
      delete payload.pt_id
      commit('addNewClient', {
        client_id: NEW_CLIENT.data[0]['LAST_INSERT_ID()'],
        notifications: 1,
        profile_image: '',
        ...payload
      })
    },
    async updateClient ({ state }) {
      const CLIENT = state.clientDetails
      await axios.post('https://api.traininblocks.com/v2/clients', {
        id: CLIENT.client_id,
        name: CLIENT.name,
        email: CLIENT.email,
        number: CLIENT.number,
        notifications: CLIENT.notifications,
        notes: CLIENT.notes,
        profile_image: CLIENT.profile_image
      })
    },
    // payload => clientId
    async clientArchive ({ commit, state }, clientId) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(clientId))
      commit('archiveClient', CLIENT)
      const EMAIL = CLIENT.email
      await axios.post(`https://api.traininblocks.com/v2/clients/archive/${clientId}`)
      const RESULT = await axios.post('/.netlify/functions/okta', {
        type: 'GET',
        url: `?filter=profile.email+eq+"${EMAIL}"&limit=1`
      })
      if (RESULT.data.length >= 1) {
        await axios.post('/.netlify/functions/okta', {
          type: 'POST',
          body: {},
          url: `${RESULT.data[0].id}/lifecycle/suspend`
        })
        await axios.post('/.netlify/functions/send-email', {
          to: EMAIL,
          subject: 'Account Deactivated',
          text: deleteEmailText(),
          html: deleteEmail()
        })
      }
    },
    // payload => clientIds
    async clientUnarchive ({ commit }, clientIds) {
      const POST_DATA = []
      clientIds.forEach((clientId) => {
        POST_DATA.push({ id: clientId })
      })
      commit('unarchiveClient', clientIds)
      await axios.post('https://api.traininblocks.com/v2/batch/clients/unarchive', POST_DATA)
    },
    // payload => clients
    async clientDelete ({ commit }, clients) {
      const DELETE_IDS = []
      clients.forEach((clientId) => {
        DELETE_IDS.push({ id: clientId })
      })
      await axios.delete('https://api.traininblocks.com/v2/batch/clients', {
        data: DELETE_IDS
      })
      commit('removeClient', clients)
    },

    // Templates

    async newTemplate ({ commit, state }) {
      const RESPONSE = await axios.put('https://api.traininblocks.com/v2/templates', {
        pt_id: state.claims.sub,
        name: 'Untitled',
        template: ''
      }).catch((e) => {
        console.error(e)
      })
      commit('addNewTemplate', {
        templateId: RESPONSE.data[0]['LAST_INSERT_ID()'],
        ptId: state.claims.sub,
        name: 'Untitled',
        template: ''
      })
    },
    // payload => templateId
    async updateTemplate ({ state }, templateId) {
      const TEMPLATE = state.templates.find(template => template.id === parseInt(templateId))
      await axios.post('https://api.traininblocks.com/v2/templates', {
        ...TEMPLATE
      })
    },
    // payload => templatesIds (selectedTemplates)
    async deleteTemplate ({ commit }, templateIds) {
      const DELETE_IDS = []
      templateIds.forEach((templateId) => {
        DELETE_IDS.push({ id: templateId })
      })
      await axios.delete('https://api.traininblocks.com/v2/batch/templates', {
        data: DELETE_IDS
      })
      commit('removeTemplate', templateIds)
    },

    // Portfolio

    async createPortfolio ({ dispatch, state }) {
      await axios.put('https://api.traininblocks.com/v2/portfolio', {
        pt_id: state.claims.sub,
        trainer_name: '',
        business_name: '',
        notes: ''
      })
      dispatch('setData', {
        attr: 'portfolio',
        data: {
          trainer_name: '',
          business_name: '',
          notes: ''
        }
      })
    },
    async updatePortfolio ({ state }) {
      await axios.post(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`, {
        ...state.portfolio
      })
    },

    // Products

    // payload => name, desc, price, type
    async createProduct ({ commit }, payload) {
      await axios.put('https://api.traininblocks.com/v2/products', {
        ...payload
      })
      commit('addNewProduct', {
        ...payload
      })
    },
    // payload => productId
    async updateProduct ({ state }, productId) {
      const POST_DATA = state.products.find(product => product.id === parseInt(productId))
      await axios.post(`https://api.traininblocks.com/v2/products/${productId}`, {
        ...POST_DATA
      })
    },
    // payload => productIds (selectedProducts)
    async deleteProduct ({ commit }, productIds) {
      const DELETE_IDS = []
      productIds.forEach((productId) => {
        DELETE_IDS.push({ id: productId })
      })
      await axios.delete('https://api.traininblocks.com/v2/batch/product', {
        data: DELETE_IDS
      })
      commit('removeProduct', productIds)
    },

    // Account

    async changePassword ({ state }, payload) {
      await axios.post('/.netlify/functions/okta', {
        type: 'POST',
        body: {
          oldPassword: payload.old,
          newPassword: payload.new
        },
        url: `${state.claims.sub}/credentials/change_password`
      })
      await axios.post('/.netlify/functions/send-email', {
        to: state.claims.email,
        subject: 'Password Changed',
        text: passChangeEmailText(),
        html: passChangeEmail()
      })
    },
    async saveClaims ({ state }) {
      await axios.post('/.netlify/functions/okta', {
        type: 'POST',
        body: {
          profile: {
            ga: state.claims.ga,
            theme: state.claims.theme,
            policy: state.claims.policy
          }
        },
        url: `${state.claims.sub}`
      })
      localStorage.removeItem('claims')
    },

    // Plans

    // payload => clientId, force
    async getPlans ({ dispatch, commit, state }, clientId) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(clientId))
      if (!CLIENT.plans) {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/plans/${CLIENT.client_id}`)
        commit('updateClient', {
          clientId: CLIENT.client_id,
          attr: 'plans',
          data: RESPONSE.data.length === 0 ? false : RESPONSE.data[0]
        })

        // Resolves sessions and assigns to correct plan
        CLIENT.plans.forEach((plan) => {
          const SESSION_DATA = RESPONSE.data[1].filter(session => parseInt(session.programme_id) === plan.id) || false
          commit('updatePlanAttr', {
            clientId,
            planId: plan.id,
            attr: 'sessions',
            data: SESSION_DATA
          })
        })
      }
    },
    // payload => clientId, name, duration, ordered
    async createPlan ({ commit }, payload) {
      const RESPONSE = await axios.put('https://api.traininblocks.com/v2/plans', {
        name: payload.name,
        client_id: parseInt(payload.clientId),
        duration: payload.duration,
        block_color: '',
        ordered: payload.ordered
      })
      commit('addNewPlan', {
        name: payload.name,
        id: RESPONSE.data[0]['LAST_INSERT_ID()'],
        client_id: parseInt(payload.clientId),
        duration: payload.duration,
        block_color: '',
        notes: null,
        ordered: payload.ordered,
        sessions: false
      })
    },
    // payload => clientId, planId, planName, planDuration, blockColor, planNotes, planSessions
    async duplicatePlan ({ dispatch, commit, state }, payload) {
      const NEW_PLAN_RESPONSE = await axios.put('https://api.traininblocks.com/v2/plans', {
        name: `Copy of ${payload.planName}`,
        client_id: parseInt(payload.clientId),
        duration: payload.planDuration,
        block_color: payload.blockColor,
        ordered: state.clientDetails.plans.length
      })
      const NEW_PLAN_ID = NEW_PLAN_RESPONSE.data[0]['LAST_INSERT_ID()']
      commit('addNewPlan', {
        name: `Copy of ${payload.planName}`,
        id: NEW_PLAN_ID,
        client_id: parseInt(payload.clientId),
        duration: payload.planDuration,
        block_color: payload.blockColor,
        notes: payload.planNotes,
        ordered: state.clientDetails.plans.length,
        sessions: false
      })
      await dispatch('updatePlan', {
        name: `Copy of ${payload.planName}`,
        id: NEW_PLAN_ID,
        client_id: payload.clientId,
        duration: payload.planDuration,
        block_color: payload.blockColor,
        notes: payload.planNotes,
        ordered: state.clientDetails.plans.length
      })
      if (payload.planSessions !== false) {
        payload.planSessions.forEach((session) => {
          dispatch('addSession', {
            client_id: payload.clientId,
            data: {
              name: session.name,
              programme_id: NEW_PLAN_ID,
              date: session.date,
              notes: session.notes,
              week_id: session.week_id
            }
          })
        })
      }
    },
    // payload => client_id, id (plan), name, duration, notes, block_color, ordered
    async updatePlan ({ commit }, payload) {
      await axios.post('https://api.traininblocks.com/v2/plans', {
        ...payload
      })
      commit('updateEntirePlan', payload)
    },
    // payload => clientId, planId
    async deletePlan ({ commit }, payload) {
      await axios.delete(`https://api.traininblocks.com/v2/plans/${payload.planId}`)
      commit('removePlan', {
        clientId: payload.clientId,
        planId: payload.planId
      })
    },

    // Sessions

    // payload => client_id, data: { programme_id, name, date, notes, week_id }
    async addSession ({ commit }, payload) {
      const RESPONSE = await axios.put('https://api.traininblocks.com/v2/sessions', {
        ...payload.data
      }).catch((e) => {
        console.error(e)
      })
      const NEW_SESSION_ID = RESPONSE.data[0]['LAST_INSERT_ID()']
      commit('addNewSession', {
        client_id: payload.client_id,
        id: NEW_SESSION_ID,
        feedback: null,
        checked: 0,
        ...payload.data
      })
      return NEW_SESSION_ID
    },
    // payload => clientId, planId, sessionId
    async updateSession ({ getters }, payload) {
      const SESSION = getters.helper('match_session', payload.clientId, payload.planId, payload.sessionId)
      await axios.post('https://api.traininblocks.com/v2/sessions', { ...SESSION })
    },
    // payload => clientId, planId, sessionIds
    async batchUpdateSession ({ getters }, payload) {
      const POST_DATA = []
      payload.sessionIds.forEach((sessionId) => {
        POST_DATA.push(getters.helper('match_session', payload.clientId, payload.planId, sessionId))
      })
      await axios.post('https://api.traininblocks.com/v2/batch/sessions', {
        ...POST_DATA
      })
    },
    // payload => clientId, planId, sessionIds
    async deleteSession ({ commit }, payload) {
      const DELETE_IDS = []
      payload.sessionIds.forEach((sessionId) => {
        DELETE_IDS.push({ id: sessionId })
      })
      await axios.delete('https://api.traininblocks.com/v2/batch/sessions', {
        data: DELETE_IDS
      })
      commit('removeSession', {
        clientId: payload.clientId,
        planId: payload.planId,
        sessionIds: payload.sessionIds
      })
    },

    // Bookings

    // payload => clientId, datetime, notes, status
    async createBooking ({ commit }, payload) {
      const RESPONSE = await axios.put('https://api.traininblocks.com/v2/bookings', {
        ...payload
      })
      payload.id = RESPONSE.data[0]['LAST_INSERT_ID()']
      commit('addNewBooking', {
        ...payload
      })
    },
    // payload => clientId, bookingIds (array of id for booking)
    async deleteBooking ({ commit }, payload) {
      await axios.delete(`https://api.traininblocks.com/v2/bookings/${payload.bookingId}`)
      commit('removeBooking', {
        clientId: payload.clientId,
        bookingId: payload.bookingId
      })
    },

    // Client-side

    async updateClientSideDetails ({ dispatch, commit }, payload) {
      await axios.post('https://api.traininblocks.com/v2/clientUser/clients', {
        ...payload
      })
      commit('updateClientUserProfileImage', payload.profile_image)
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'name',
        data: payload.name
      })
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'number',
        data: payload.number
      })
      dispatch('endLoading')
    },
    async getClientSideInfo ({ commit, state }) {
      const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clientUser/${state.claims.client_id_db}`)
      if (RESPONSE.data) {
        commit('setData', {
          attr: 'portfolio',
          data: RESPONSE.data[1][0]
        })
        commit('setDataDeep', {
          attrParent: 'clientUser',
          attrChild: 'profile_image',
          data: RESPONSE.data[2][0].profile_image
        })
        // Sets bookings
        commit('setDataDeep', {
          attrParent: 'clientUser',
          attr: 'bookings',
          data: RESPONSE.data[3]
        })
        commit('setDataDeep', {
          attrParent: 'clientUser',
          attrChild: 'name',
          data: RESPONSE.data[0][0].name
        })
        commit('setDataDeep', {
          attrParent: 'clientUser',
          attrChild: 'number',
          data: RESPONSE.data[0][0].number
        })
        commit('setDataDeep', {
          attrParent: 'clientUser',
          attrChild: 'pt_id',
          data: RESPONSE.data[0][0].pt_id
        })
      }
    },
    async getClientSidePlans ({ commit, state }) {
      const PLANS = await axios.get(`https://api.traininblocks.com/v2/plans/${state.claims.client_id_db}`)
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'plans',
        data: PLANS.data
      })
      if (state.clientUser.plans) {
        for (const PLAN of state.clientUser.plans) {
          const RESPONSE_SESSIONS = await axios.get(`https://api.traininblocks.com/v2/sessions/${PLAN.id}`)
          const SORTED_SESSIONS = RESPONSE_SESSIONS.data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
          })
          commit('updateClientUserPlanSessions', {
            planId: PLAN.id,
            attr: 'sessions',
            data: SORTED_SESSIONS
          })
        }
      }
    },
    // payload => planId, sessionId
    async updateClientSideSession ({ state }, payload) {
      const PLAN = state.clientUser.plans.find(plan => plan.id === parseInt(payload.planId))
      const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
      await axios.post('https://api.traininblocks.com/v2/client-sessions', {
        id: SESSION.id,
        name: SESSION.name,
        checked: SESSION.checked,
        feedback: SESSION.feedback
      })
      if (state.portfolio.notifications === 1) {
        if (SESSION.feedback !== null) {
          const PT_EMAIL = await axios.post('/.netlify/functions/okta', {
            type: 'GET',
            url: `?filter=id+eq+"${state.portfolio.pt_id}"&limit=1`
          })
          await axios.post('/.netlify/functions/send-email', {
            to: PT_EMAIL.data[0].credentials.emails[0].value,
            subject: state.claims.email + ' has submitted feedback for ' + SESSION.name,
            text: feedbackEmailText(state.claims.client_id_db, parseInt(payload.planId)),
            html: feedbackEmail(state.claims.client_id_db, parseInt(payload.planId))
          })
        }
      }
    }
  },
  getters: {
    helper: (state, getters) => (type, clientId, planId, sessionId) => {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(clientId))
      switch (type) {
        case 'match_plan':
          return CLIENT.plans.find(plan => plan.id === parseInt(planId))
        case 'match_session': {
          const PLAN = getters.helper('match_plan', clientId, planId)
          return PLAN.sessions.find(session => session.id === parseInt(sessionId))
        }
      }
    }
  }
})
