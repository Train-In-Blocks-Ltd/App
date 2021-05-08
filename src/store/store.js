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

    // Clients

    clients: null,
    clientDetails: null,
    clientUser: {
      plans: null,
      sessionsToday: []
    },

    // Portfolio

    portfolio: {
      business_name: '',
      trainer_name: '',
      notes: ''
    },

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
    updateClient (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      CLIENT[payload.attr] = payload.data
    },
    archiveClient (state, client) {
      const IDX = state.clients.indexOf(client)
      state.clients.splice(IDX, 1)
    },
    unarchiveClient (state, client) {
      const IDX = state.archive.clients.indexOf(client)
      state.archive.clients.splice(IDX, 1)
      state.clients.push(client)
      state.clients.sort((a, b) => {
        const NAME_A = a.name.toUpperCase()
        const NAME_B = b.name.toUpperCase()
        return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
      })
    },
    removeClient (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      state.archive.clients.splice(state.archive.clients.indexOf(CLIENT), 1)
    },

    // Plans
    addNewPlan (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      CLIENT.plans.push({
        name: payload.name,
        id: parseInt(payload.planId),
        client_id: parseInt(payload.clientId),
        duration: payload.duration,
        block_color: payload.blockColor,
        notes: payload.notes,
        ordered: payload.ordered,
        sessions: payload.sessions
      })
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
      console.log(payload)
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
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
      PLAN.sessions.splice(PLAN.sessions.indexOf(SESSION), 1)
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
      const TEMPLATE = state.templates.find(template => template.id === parseInt(payload.templateId))
      state.templates.splice(state.templates.indexOf(TEMPLATE), 1)
    },

    // Client user

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
        if (SESSION.date === today() && !state.sessionsToday.includes(SESSION.id)) {
          state.clientUser.sessionsToday.push(SESSION)
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

    // Clients

    async getClientsAndArchive ({ dispatch }) {
      await dispatch('getClients', true)
      await dispatch('getArchive', true)
    },
    async getClients ({ dispatch, commit, state }) {
      try {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clients/${state.claims.sub}`)
        const SORTED_CLIENTS = RESPONSE.data.sort((a, b) => {
          const NAME_A = a.name.toUpperCase()
          const NAME_B = b.name.toUpperCase()
          return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
        })
        commit('setData', {
          attr: 'clients',
          data: SORTED_CLIENTS
        })
      } catch (e) {
        dispatch('resolveDeepError', e)
      }
    },
    /*
    async getClients ({ dispatch, commit, state }, force) {
      try {
        if (!localStorage.getItem('clients') || force) {
          const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clients/${state.claims.sub}`)
          localStorage.setItem('clients', JSON.stringify(RESPONSE.data))
        }
        const SORTED_CLIENTS = JSON.parse(localStorage.getItem('clients')).sort((a, b) => {
          const NAME_A = a.name.toUpperCase()
          const NAME_B = b.name.toUpperCase()
          return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
        })
        commit('setData', {
          attr: 'clients',
          data: SORTED_CLIENTS
        })
      } catch (e) {
        dispatch('resolveDeepError', e)
      }
    },
    */
    async getArchive ({ dispatch, commit, state }, force) {
      try {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clients/${state.claims.sub}/archive`)
        const SORTED_ARCHIVE_CLIENTS = RESPONSE.data.sort((a, b) => {
          const NAME_A = a.name.toUpperCase()
          const NAME_B = b.name.toUpperCase()
          return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
        })
        commit('setDataDeep', {
          attrParent: 'archive',
          attrChild: 'clients',
          data: SORTED_ARCHIVE_CLIENTS
        })
      } catch (e) {
        dispatch('resolveDeepError', e)
      }
    },
    /*
    async getArchive ({ dispatch, commit, state }, force) {
      try {
        if (!localStorage.getItem('archive') || force) {
          const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clients/${state.claims.sub}/archive`)
          localStorage.setItem('archive', JSON.stringify(RESPONSE.data))
        }
        if (JSON.parse(localStorage.getItem('archive')).length !== 0) {
          const SORTED_ARCHIVE_CLIENTS = JSON.parse(localStorage.getItem('archive')).sort((a, b) => {
            const NAME_A = a.name.toUpperCase()
            const NAME_B = b.name.toUpperCase()
            return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
          })
          commit('setDataDeep', {
            attrParent: 'archive',
            attrChild: 'clients',
            data: SORTED_ARCHIVE_CLIENTS
          })
        }
      } catch (e) {
        dispatch('resolveDeepError', e)
      }
    },
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
        profile_img: CLIENT.profile_img
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
    /*
    async clientArchive ({ commit, state }, payload) {
      commit('setData', {
        attr: 'clients',
        data: state.clients.splice(payload.index, 1)
      })
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const EMAIL = CLIENT.email
      await axios.post(`https://api.traininblocks.com/v2/clients/archive/${payload.clientId}`)
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
    */
    // payload => clientId
    async clientUnarchive ({ commit, state }, clientId) {
      const CLIENT = state.archive.clients.find(client => client.client_id === parseInt(clientId))
      commit('unarchiveClient', CLIENT)
      await axios.post(`https://api.traininblocks.com/v2/clients/unarchive/${clientId}`)
    },
    /*
    async clientUnarchive ({ commit, state }, clientId) {
      const CLIENT = state.archive.clients.find(client => client.client_id === parseInt(clientId))
      const LOCAL_STORAGE_ARRAY = JSON.parse(localStorage.getItem('clients'))
      LOCAL_STORAGE_ARRAY.push(CLIENT)
      localStorage.setItem('clients', JSON.stringify(LOCAL_STORAGE_ARRAY))
      const SORTED_CLIENTS = JSON.parse(localStorage.getItem('clients')).sort((a, b) => {
        const NAME_A = a.name.toUpperCase()
        const NAME_B = b.name.toUpperCase()
        return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
      })
      commit('setData', {
        attr: 'clients',
        data: SORTED_CLIENTS
      })
      await axios.post(`https://api.traininblocks.com/v2/clients/unarchive/${clientId}`)
    },
    */
    // payload => clientId
    async clientDelete ({ commit }, clientId) {
      await axios.delete(`https://api.traininblocks.com/v2/clients/${clientId}`)
      commit('removeClient', {
        clientId
      })
    },

    // Templates

    async getTemplates ({ commit, state }, force) {
      if (!localStorage.getItem('templates') || force || state.claims.user_type === 'Admin') {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/templates/${state.claims.sub}`)
        localStorage.setItem('templates', JSON.stringify(RESPONSE.data))
      }
      commit('setData', {
        attr: 'templates',
        data: JSON.parse(localStorage.getItem('templates'))
      })
    },
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
    // payload => templateId
    async deleteTemplate ({ commit }, templateId) {
      await axios.delete(`https://api.traininblocks.com/v2/templates/${templateId}`)
      commit('removeTemplate', {
        templateId
      })
    },

    // Portfolio

    async getPortfolio ({ dispatch, commit, state }, force) {
      try {
        if (!localStorage.getItem('portfolio') || force || state.claims.user_type === 'Admin') {
          if (state.claims.user_type === 'Trainer' || state.claims.user_type === 'Admin') {
            const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`)
            if (RESPONSE.data.length === 0) {
              await dispatch('createPortfolio')
            } else {
              localStorage.setItem('portfolio', JSON.stringify(RESPONSE.data[0]))
            }
          } else {
            const CLIENT = await axios.get(`https://api.traininblocks.com/v2/ptId/${state.claims.client_id_db}`)
            if (CLIENT.data[0].pt_id) {
              const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/portfolio/${CLIENT.data[0].pt_id}`)
              if (RESPONSE.data.length !== 0) {
                localStorage.setItem('portfolio', JSON.stringify(RESPONSE.data[0]))
              }
            }
          }
        }
        commit('setData', {
          attr: 'portfolio',
          data: JSON.parse(localStorage.getItem('portfolio'))
        })
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async createPortfolio ({ dispatch, state }) {
      try {
        await axios.put('https://api.traininblocks.com/v2/portfolio', {
          pt_id: state.claims.sub,
          trainer_name: '',
          business_name: '',
          notes: ''
        })
        await dispatch('getPortfolio')
      } catch (e) {
        dispatch('resolveDeepError', e)
      }
    },
    async updatePortfolio ({ state }) {
      await axios.post(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`, {
        ...state.portfolio
      })
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
          data: RESPONSE.data.length === 0 ? false : RESPONSE.data
        })
        if (CLIENT.plans !== false) {
          CLIENT.plans.forEach((plan) => {
            dispatch('getSessions', {
              planId: plan.id,
              clientId: CLIENT.client_id,
              force: false
            })
          })
        }
      }
    },
    // payload => clientId, name, duration, ordered
    async createPlan ({ commit, state }, payload) {
      const RESPONSE = await axios.put('https://api.traininblocks.com/v2/plans', {
        name: payload.name,
        client_id: parseInt(payload.clientId),
        duration: payload.duration,
        block_color: '',
        ordered: payload.ordered
      }).catch((e) => {
        console.error(e)
      })
      commit('addNewPlan', {
        name: payload.name,
        planId: RESPONSE.data[0]['LAST_INSERT_ID()'],
        clientId: payload.clientId,
        duration: payload.duration,
        blockColor: '',
        notes: null,
        ordered: payload.ordered,
        sessions: false
      })
      localStorage.setItem('clients', JSON.stringify(state.clients))
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
        planId: NEW_PLAN_ID,
        clientId: payload.clientId,
        duration: payload.planDuration,
        blockColor: payload.blockColor,
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
    async updatePlan ({ state }, payload) {
      await axios.post('https://api.traininblocks.com/v2/plans', {
        ...payload
      })
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

    // payload => clientId, planId, force
    async getSessions ({ commit, state }, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      if (!PLAN.sessions || payload.force) {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/sessions/${PLAN.id}`)
        const SORTED_RESPONSE = RESPONSE.data.sort((a, b) => {
          return new Date(a.date) - new Date(b.date)
        })
        commit('updateAllSessions', {
          clientId: CLIENT.client_id,
          planId: PLAN.id,
          data: SORTED_RESPONSE.length === 0 ? false : SORTED_RESPONSE
        })
      }
      localStorage.setItem('clients', JSON.stringify(state.clients))
    },
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
      await axios.post('https://api.traininblocks.com/v2/sessions', {
        id: SESSION.id,
        name: SESSION.name,
        date: SESSION.date,
        notes: SESSION.notes,
        week_id: SESSION.week_id,
        checked: SESSION.checked
      })
    },
    // payload => clientId, planId, sessionId
    async deleteSession ({ commit }, payload) {
      await axios.delete(`https://api.traininblocks.com/v2/sessions/${payload.sessionId}`)
      commit('removeSession', {
        clientId: payload.clientId,
        planId: payload.planId,
        sessionId: payload.sessionId
      })
    },

    // Client-side

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
      const CLIENT = await axios.get(`https://api.traininblocks.com/v2/ptId/${state.claims.client_id_db}`)
      const PLAN = state.clientUser.plans.find(plan => plan.id === parseInt(payload.planId))
      const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
      await axios.post('https://api.traininblocks.com/v2/client-sessions', {
        id: SESSION.id,
        name: SESSION.name,
        checked: SESSION.checked,
        feedback: SESSION.feedback
      })
      if (CLIENT.data[0].notifications === 1) {
        if (SESSION.feedback !== null) {
          const PT_EMAIL = await axios.post('/.netlify/functions/okta', {
            type: 'GET',
            url: `?filter=id+eq+"${CLIENT.data[0].pt_id}"&limit=1`
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