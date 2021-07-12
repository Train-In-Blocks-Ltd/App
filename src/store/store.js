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

    // -----------------------------
    // System
    // -----------------------------

    /**
     * Sets the first level of any object data.
     * @param {object} payload - { attr, data }
     */
    setData (state, payload) {
      state[payload.attr] = payload.data
      if (payload.attr === 'clients') {
        state.noClients = state.clients.length === 0
      }
    },

    /**
     * Sets the second level of any object data.
     * @param {object} payload - { attrParent, attrChild, data }
     */
    setDataDeep (state, payload) {
      state[payload.attrParent][payload.attrChild] = payload.data
      if (payload.attrParent === 'archive') {
        state.archive.noArchive = state.archive.clients.length === 0
      }
    },

    /**
     * Pushes a new client to 'clients'.
     * @param {object} payload - { ...client_params }
     */
    addNewClient (state, payload) {
      state.clients.push({
        ...payload
      })
    },

    /**
     * Updates a client.
     * @param {object} payload - { clientId, attr, data }
     */
    updateClient (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      CLIENT[payload.attr] = payload.data
    },

    /**
     * Pushes a client to 'archive' and splices them from 'clients'.
     * @param {object} client - The client object.
     */
    archiveClient (state, client) {
      const IDX = state.clients.indexOf(client)
      state.clients.splice(IDX, 1)
      state.archive.clients.push(client)
      state.archive.clients.sort((a, b) => {
        const NAME_A = a.name.toUpperCase()
        const NAME_B = b.name.toUpperCase()
        return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
      })
    },

    /**
     * Pushes clients to 'clients' and splices them from 'archive'.
     * @param {object} payload - { clientIds }
     */
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

    /**
     * Removes clients from archive permenently.
     * @param {object} payload - { clientIds }
     */
    removeClient (state, payload) {
      payload.forEach((clientId) => {
        const CLIENT = state.archive.clients.find(client => client.client_id === parseInt(clientId))
        state.archive.clients.splice(state.archive.clients.indexOf(CLIENT), 1)
      })
    },

    // -----------------------------
    // Plans
    // -----------------------------

    /**
     * Adds a new plan to a client.
     * @param {object} payload - { client_id, ...plan_params }
     */
    addNewPlan (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.client_id))
      CLIENT.plans.push({
        ...payload
      })
    },

    /**
     * Updates an entire plan
     * @param {object} payload - { client_id, ...plan_params }
     */
    updateEntirePlan (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.client_id))
      for (let plan of CLIENT.plans) {
        if (plan.id === payload.id) {
          plan = payload
        }
      }
    },

    /**
     * Updates a single plan parameter.
     * @param {object} payload - { clientId, planId, attr, data }
     */
    updatePlanAttr (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      PLAN[payload.attr] = payload.data
    },

    /**
     * Removes a plan from a client.
     * @param {object} payload - { clientId, planId }
     */
    removePlan (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      CLIENT.plans.splice(CLIENT.plans.indexOf(PLAN), 1)
    },

    // -----------------------------
    // Sessions
    // -----------------------------

    /**
     * Pushes the new session to the plan.
     * @param {object} payload - { client_id, programme_id, ...session_params }
     */
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

    /**
     * Updates all the sessions in a plan.
     * @param {object} payload - { clientId, planId, data }
     */
    updateAllSessions (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      PLAN.sessions = payload.data
    },

    /**
     * Updates a parameter of a single session.
     * @param {object} payload - { clientId, planId, sessionId, attr, data }
     */
    updateSessionAttr (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
      SESSION[payload.attr] = payload.data
    },

    /**
     * Removes sessions from a plan.
     * @param {object} payload - { clientId, planId, sessionIds }
     */
    removeSession (state, payload) {
      payload.sessionIds.forEach((sessionId) => {
        const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
        const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
        const SESSION = PLAN.sessions.find(session => session.id === sessionId)
        PLAN.sessions.splice(PLAN.sessions.indexOf(SESSION), 1)
      })
    },

    // -----------------------------
    // Templates
    // -----------------------------

    /**
     * Pushes a new template to 'templates'.
     * @param {object} payload - { templateId, ptId, name, template }
     */
    addNewTemplate (state, payload) {
      state.templates.push({
        id: payload.templateId,
        pt_id: payload.ptId,
        name: payload.name,
        template: payload.template
      })
    },

    /**
     * Removes templates from 'templates'.
     * @param {object} templateIds - Single or multiple ids of templates.
     */
    removeTemplate (state, templateIds) {
      templateIds.forEach((templateId) => {
        const TEMPLATE = state.templates.find(template => template.id === templateId)
        state.templates.splice(state.templates.indexOf(TEMPLATE), 1)
      })
    },

    // -----------------------------
    // Bookings
    // -----------------------------

    /**
     * Pushes new booking to 'bookings'.
     * @param {object} payload - { client_id, id (booking), date, time, notes, status, isClientSide }
     */
    addNewBooking (state, payload) {
      delete payload.isClientSide
      state.bookings.push({ ...payload })
      state.bookings.sort((a, b) => {
        return new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) - new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
      })
    },

    /**
     * Updates a booking.
     * @param {object} payload - { id (booking), status }
     */
    updateBooking (state, payload) {
      const BOOKING = state.bookings.find(booking => booking.id === parseInt(payload.id))
      BOOKING.status = payload.status
    },

    /**
     * Removes a booking.
     * @param {object} bookingId - The id of the booking.
     */
    removeBooking (state, bookingId) {
      const BOOKING = state.bookings.find(booking => booking.id === parseInt(bookingId))
      state.bookings.splice(state.bookings.indexOf(BOOKING), 1)
    },

    // -----------------------------
    // Products
    // -----------------------------

    /**
     * Pushes a new product to 'products'.
     * @param {object} payload - { ...product_params }
     */
    addNewProduct (state, payload) {
      state.products.push({ ...payload })
    },
    /**
     * Removes products from 'products'.
     * @param {array} productIds - The ids of products.
     */
    removeProduct (state, productIds) {
      productIds.forEach((productId) => {
        const PRODUCT = state.products.find(product => product.id === parseInt(productId))
        state.products.splice(state.products.indexOf(PRODUCT), 1)
      })
    },

    // -----------------------------
    // Client-user
    // -----------------------------

    /**
     * Pushes a new booking to 'clientUser.bookings'.
     * @param {object} payload - { ...booking_params }
     */
    addNewBookingClientSide (state, payload) {
      delete payload.isClientSide
      state.clientUser.bookings.push({ ...payload })
      state.clientUser.bookings.sort((a, b) => {
        return new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) - new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
      })
    },

    /**
     * Removes a booking from 'clientUser.bookings'.
     * @param {object} payload - { bookingId }
     */
    removeBookingClientSide (state, payload) {
      const BOOKING = state.clientUser.bookings.find(booking => booking.id === parseInt(payload.bookingId))
      state.clientUser.bookings.splice(state.clientUser.bookings.indexOf(BOOKING), 1)
    },

    /**
     * Updates the sessions of the plan.
     * @param {object} payload - { sessions }
     */
    setClientUserPlan (state, payload) {
      const PLAN = state.clientUser.plans.find(plan => plan.id === parseInt(payload.planId))
      PLAN.sessions = payload.sessions
    },

    /**
     * Loads the client-user profile image.
     * @param {object} profileImage - The profile iamge.
     */
    updateClientUserProfileImage (state, profileImage) {
      state.clientUser.profile_image = profileImage
    },

    /**
     * Updates an attribute for a single session from the client-user.
     * @param {object} payload - { planId, sessionId, attr, data }
     */
    updateClientUserPlanSingleSession (state, payload) {
      const PLAN = state.clientUser.plans.find(plan => plan.id === parseInt(payload.planId))
      const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
      SESSION[payload.attr] = payload.data
    }
  },
  actions: {

    // -----------------------------
    // System
    // -----------------------------

    /**
     * Ends all loading.
     */
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

    /**
     * Resolves any error in store.js.
     * @param {string} msg - The error message.
     */
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

    /**
     * Gets all the data for the trainer-user's session.
     */
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
        data: RESPONSE.data[4].sort((a, b) => {
          return new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) - new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
        })
      })
    },

    // -----------------------------
    // Clients
    // -----------------------------

    /**
     * Creates a new client.
     * @param {object} payload - { pt_id, ..client_params }
     */
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

    /**
     * Updates a client.
     */
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

    /**
     * Archives a client
     * @param {integer} clientId - The id of the client.
     */
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

    /**
     * Unarchive clients.
     * @param {array} clientIds - The ids of clients.
     */
    async clientUnarchive ({ commit }, clientIds) {
      const POST_DATA = []
      clientIds.forEach((clientId) => {
        POST_DATA.push({ id: clientId })
      })
      commit('unarchiveClient', clientIds)
      await axios.post('https://api.traininblocks.com/v2/batch/clients/unarchive', POST_DATA)
    },

    /**
     * Delete clients from the archive.
     * @param {array} clientIds - The ids of clients.
     */
    async clientDelete ({ commit }, clientIds) {
      const DELETE_IDS = []
      clientIds.forEach((clientId) => {
        DELETE_IDS.push({ id: clientId })
      })
      await axios.delete('https://api.traininblocks.com/v2/batch/clients', {
        data: DELETE_IDS
      })
      commit('removeClient', clientIds)
    },

    // -----------------------------
    // Templates
    // -----------------------------

    /**
     * Adds a new template.
     */
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

    /**
     * Updates a template.
     * @param {integer} templateId - The id of the template.
     */
    async updateTemplate ({ state }, templateId) {
      const TEMPLATE = state.templates.find(template => template.id === parseInt(templateId))
      await axios.post('https://api.traininblocks.com/v2/templates', {
        ...TEMPLATE
      })
    },

    /**
     * Delete templates.
     * @param {array} templateIds - The ids of templates.
     */
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

    // -----------------------------
    // Portfolio
    // -----------------------------

    /**
     * Creates a portfolio.
     */
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

    /**
     * Updates the portfolio.
     */
    async updatePortfolio ({ state }) {
      await axios.post(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`, {
        ...state.portfolio
      })
    },

    // -----------------------------
    // Products
    // -----------------------------

    /**
     * Creates a new product.
     * @param {object} payload - { name, desc, price, type }
     */
    async createProduct ({ commit }, payload) {
      await axios.put('https://api.traininblocks.com/v2/products', {
        ...payload
      })
      commit('addNewProduct', {
        ...payload
      })
    },

    /**
     * Updates a product.
     * @param {integer} productId - The id of the product.
     */
    async updateProduct ({ state }, productId) {
      const POST_DATA = state.products.find(product => product.id === parseInt(productId))
      await axios.post(`https://api.traininblocks.com/v2/products/${productId}`, {
        ...POST_DATA
      })
    },
    // payload => productIds (selectedProducts)

    /**
     * Deletes products.
     * @param {array} productIds - The ids of products.
     */
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

    // -----------------------------
    // Account
    // -----------------------------

    /**
     * Changes the user's password.
     * @param {object} payload - { old, new }
     */
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

    /**
     * Updates the user's claims on Okta.
     */
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

    // -----------------------------
    // Plans
    // -----------------------------

    /**
     * Get all the plans and sessions for a client.
     * @param {integer} clientId - The id of the client.
     */
    async getPlans ({ commit, state }, clientId) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(clientId))
      if (!CLIENT.plans) {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/plans/${CLIENT.client_id}`)
        commit('updateClient', {
          clientId: CLIENT.client_id,
          attr: 'plans',
          data: RESPONSE.data.length === 0 ? false : RESPONSE.data[0]
        })

        // Resolves sessions and assigns to correct plan
        if (RESPONSE.data[1]) {
          CLIENT.plans.forEach((plan) => {
            const SESSION_DATA = RESPONSE.data[1].filter(session => session.programme_id === plan.id) || false
            commit('updatePlanAttr', {
              clientId,
              planId: plan.id,
              attr: 'sessions',
              data: SESSION_DATA.length === 0 ? false : SESSION_DATA
            })
          })
        }
      }
    },

    /**
     * Creates a new plan.
     * @param {object} payload - { clientId, name, duration, ordered }
     */
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

    /**
     * Duplicates a plan.
     * @param {object} payload - { clientId, planId, planName, planDuration, blockColor, planNotes, planSessions }
     */
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

    /**
     * Updates a plan.
     * @param {object} payload - { client_id, id (plan), name, duration, notes, block_color, ordered }
     */
    async updatePlan ({ commit }, payload) {
      await axios.post('https://api.traininblocks.com/v2/plans', {
        ...payload
      })
      commit('updateEntirePlan', payload)
    },

    /**
     * Deletes a plan.
     * @param {object} payload - { clientId, planId }
     */
    async deletePlan ({ commit }, payload) {
      await axios.delete(`https://api.traininblocks.com/v2/plans/${payload.planId}`)
      commit('removePlan', {
        clientId: payload.clientId,
        planId: payload.planId
      })
    },

    // -----------------------------
    // Sessions
    // -----------------------------

    /**
     * Creates a new session.
     * @param {object} payload - { client_id, data: { programme_id, name, date, notes, week_id } }
     * @returns The new session's id.
     */
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

    /**
     * Updates a session.
     * @param {object} payload - { clientId, planid, sessionId }
     */
    async updateSession ({ getters }, payload) {
      const SESSION = getters.helper('match_session', payload.clientId, payload.planId, payload.sessionId)
      await axios.post('https://api.traininblocks.com/v2/sessions', { ...SESSION })
    },

    /**
     * Update multiple sessions.
     * @param {object} payload - { clientId, planId, sessionIds }
     */
    async batchUpdateSession ({ getters }, payload) {
      const POST_DATA = []
      payload.sessionIds.forEach((sessionId) => {
        POST_DATA.push(getters.helper('match_session', payload.clientId, payload.planId, sessionId))
      })
      await axios.post('https://api.traininblocks.com/v2/batch/sessions', {
        ...POST_DATA
      })
    },

    /**
     * Delete single/multiple session(s).
     * @param {object} payload - { clientId, planId, sessionIds }
     */
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

    // -----------------------------
    // Bookings
    // -----------------------------

    // payload => clientId, datetime, notes, status
    /**
     * Creates a new booking.
     * @param {object} payload - { clientId, datetime, notes, status }
     */
    async createBooking ({ commit }, payload) {
      const RESPONSE = await axios.put('https://api.traininblocks.com/v2/bookings', {
        ...payload
      })
      payload.id = RESPONSE.data[0]['LAST_INSERT_ID()']
      commit(payload.isClientSide ? 'addNewBookingClientSide' : 'addNewBooking', {
        ...payload
      })
    },

    /**
     * Updates a booking.
     * @param {object} payload - { id (booking), status }
     */
    async updateBooking ({ commit }, payload) {
      await axios.post('https://api.traininblocks.com/v2/bookings', {
        ...payload
      })
      commit('updateBooking', {
        ...payload
      })
    },

    /**
     * Deletes a booking.
     * @param {object} payload - { isTrainer, bookingId }
     */
    async deleteBooking ({ commit }, payload) {
      await axios.delete(`https://api.traininblocks.com/v2/bookings/${payload.bookingId}`)
      commit(`removeBooking${payload.isTrainer ? '' : 'ClientSide'}`, payload.bookingId)
    },

    // -----------------------------
    // Client-side
    // -----------------------------

    /**
     * Updates client-user's details.
     * @param {object} payload - { ...client_params }
     */
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

    /**
     * Gets client-user's data for app session.
     */
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
          attrChild: 'bookings',
          data: RESPONSE.data[3].sort((a, b) => {
            return new Date(a.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]) - new Date(b.datetime.match(/\d{4}-\d{2}-\d{2}/)[0])
          })
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

    /**
     * Gets client-user's plan data for app session.
     */
    async getClientSidePlans ({ commit, state }) {
      const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/plans/${state.claims.client_id_db}`)
      commit('setDataDeep', {
        attrParent: 'clientUser',
        attrChild: 'plans',
        data: RESPONSE.data[0]
      })

      // Resolves sessions and assigns to correct plan
      state.clientUser.plans.forEach((plan) => {
        const SESSION_DATA = RESPONSE.data[1].filter(session => session.programme_id === plan.id) || false
        commit('setClientUserPlan', {
          planId: plan.id,
          sessions: SESSION_DATA.length === 0 ? false : SESSION_DATA
        })
      })
    },

    /**
     * Updates a client-user's session.
     * @param {object} payload - { planId, sessionId }
     */
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

    /**
     * Helps gets plans or sessions.
     * @returns Sepecified data.
     */
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
