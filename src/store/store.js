import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { deleteEmail, deleteEmailText, passChangeEmail, passChangeEmailText, feedbackEmail, feedbackEmailText } from '../components/email'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {

    // Auth

    auth: null,
    authenticated: false,
    isTrainer: false,
    claims: {
      user_type: 0
    },

    // System

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
    updatePlanWhole (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      for (let plan of CLIENT.plans) {
        if (plan.id === parseInt(payload.planId)) {
          plan = payload.data
          break
        }
      }
    },
    updatePlanAttr (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      PLAN[payload.attr] = payload.data
    },
    updatePlanSessions (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      PLAN.sessions = payload.data
    },
    updatePlanSingleSession (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      const SESSION = PLAN.sessions.find(session => session.id === parseInt(payload.sessionId))
      SESSION[payload.attr] = payload.data
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
          state.clientUser.sessionsToday.push(SESSION.id)
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

    async clientsAndArchiveHelper ({ dispatch }) {
      await dispatch('archiveForceGet')
      dispatch('archiveToVue')
      await dispatch('clientsForceGet')
      dispatch('clientsToVue')
    },
    async clientsToVue ({ dispatch, commit }) {
      if (!localStorage.getItem('clients')) {
        await dispatch('clientsForceGet')
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
    },
    async clientsForceGet ({ dispatch, state }) {
      try {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clients/${state.claims.sub}`)
        localStorage.setItem('clients', JSON.stringify(RESPONSE.data))
      } catch (e) {
        dispatch('resolveDeepError', e)
      }
    },
    async archiveToVue ({ dispatch, commit }) {
      if (!localStorage.getItem('archive')) {
        await dispatch('archiveForceGet')
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
    },
    async archiveForceGet ({ dispatch, state }) {
      try {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clients/${state.claims.sub}/archive`)
        localStorage.setItem('archive', JSON.stringify(RESPONSE.data))
      } catch (e) {
        dispatch('resolveDeepError', e)
      }
    },
    async updateClient ({ dispatch, commit }, payload) {
      commit('setData', {
        attr: 'silentLoading',
        data: true
      })
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.post('https://api.traininblocks.com/v2/clients',
        {
          id: payload.client_id,
          name: payload.name,
          email: payload.email,
          number: payload.number,
          notifications: payload.notifications,
          notes: payload.notes
        }
      )
      // Get the client information again as we have just updated the client
      await dispatch('clientsForceGet')
      await dispatch('clientsToVue')
      dispatch('endLoading')
    },
    async clientArchive ({ dispatch, commit, state }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      commit('setData', {
        attr: 'clients',
        data: state.clients.splice(payload.index, 1)
      })
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const EMAIL = CLIENT.email
      await axios.post(`https://api.traininblocks.com/v2/clients/archive/${payload.clientId}`)
      const RESULT = await axios.post('/.netlify/functions/okta',
        {
          type: 'GET',
          url: `?filter=profile.email+eq+"${EMAIL}"&limit=1`
        }
      )
      if (RESULT.data.length >= 1) {
        await axios.post('/.netlify/functions/okta',
          {
            type: 'POST',
            body: {},
            url: `${RESULT.data[0].id}/lifecycle/suspend`
          }
        )
        await axios.post('/.netlify/functions/send-email',
          {
            to: EMAIL,
            subject: 'Account Deactivated',
            text: deleteEmailText(),
            html: deleteEmail()
          }
        )
      }
      await dispatch('clientsAndArchiveHelper')
    },
    async clientUnarchive ({ dispatch, commit, state }, clientId) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
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
      await dispatch('clientsAndArchiveHelper')
      dispatch('endLoading')
    },
    async clientDelete ({ dispatch, commit }, clientId) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.delete(`https://api.traininblocks.com/v2/clients/${parseInt(clientId)}`)
      await dispatch('clientsAndArchiveHelper')
      dispatch('endLoading')
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
    async newTemplate ({ dispatch, commit, state }) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.put('https://api.traininblocks.com/v2/templates',
        {
          pt_id: state.claims.sub,
          name: 'Untitled',
          template: ''
        }
      )
      await dispatch('getTemplates', true)
      dispatch('endLoading')
    },
    async updateTemplate ({ dispatch, commit, state }, templateId) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      const TEMPLATE = state.templates.find(template => template.id === parseInt(templateId))
      await axios.post('https://api.traininblocks.com/v2/templates',
        {
          name: TEMPLATE.name,
          template: TEMPLATE.template,
          id: parseInt(templateId)
        }
      )
      await dispatch('getTemplates', true)
      dispatch('endLoading')
    },
    async deleteTemplate ({ dispatch, commit }, templateId) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.delete(`https://api.traininblocks.com/v2/templates/${parseInt(templateId)}`)
      await dispatch('getTemplates', true)
      dispatch('endLoading')
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
    async createPortfolio ({ dispatch, commit, state }) {
      try {
        await axios.put('https://api.traininblocks.com/v2/portfolio',
          {
            pt_id: state.claims.sub,
            trainer_name: '',
            business_name: '',
            notes: ''
          }
        )
        await dispatch('getPortfolio')
      } catch (e) {
        dispatch('resolveDeepError', e)
      }
    },
    async updatePortfolio ({ dispatch, commit, state }) {
      commit('setData', {
        attr: 'silentLoading',
        data: true
      })
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.post(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`,
        {
          trainer_name: state.portfolio.trainer_name,
          business_name: state.portfolio.business_name,
          notes: state.portfolio.notes
        }
      )
      await dispatch('getPortfolio')
      dispatch('endLoading')
    },

    // Account

    async changePassword ({ commit, state }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
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
    async saveClaims ({ commit, state }) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
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

    async getPlans ({ commit, state }, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      if (!CLIENT.plans || payload.force) {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/plans/${CLIENT.client_id}`)
        commit('updateClient', {
          clientId: CLIENT.client_id,
          attr: 'plans',
          data: RESPONSE.data.length === 0 ? false : RESPONSE.data
        })
        localStorage.setItem('clients', JSON.stringify(state.clients))
      }
    },
    async createPlan ({ dispatch, commit }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.put('https://api.traininblocks.com/v2/plans',
        {
          name: payload.name,
          client_id: parseInt(payload.clientId),
          duration: payload.duration,
          block_color: '',
          ordered: payload.ordered
        }
      )
      await dispatch('getPlans', {
        clientId: payload.clientId,
        force: true
      })
    },
    // (clientId, planName, planDuration, blockColor, planNotes, planSessions)
    async duplicatePlan ({ dispatch, commit, state }, payload) {
      let newPlanId
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.put('https://api.traininblocks.com/v2/plans', {
        name: `Copy of ${payload.planName}`,
        client_id: parseInt(payload.clientId),
        duration: payload.planDuration,
        block_color: payload.blockColor,
        ordered: state.client_details.plans.length
      }).then((response) => {
        newPlanId = response.data[0]['LAST_INSERT_ID()']
        const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
        const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
        dispatch('updatePlan', {
          planId: response.data[0]['LAST_INSERT_ID()'],
          planName: PLAN.name,
          planDuration: PLAN.duration,
          planNotes: payload.planNotes,
          planBlockColor: PLAN.blockColor,
          planOrdered: PLAN.ordered
        })
      })
      return newPlanId
    },
    // (clientId, planId, planName, planDuration, planNotes, planBlockColor, planOrdered)
    async updatePlan ({ commit, state }, payload) {
      commit('setData', {
        attr: 'silentLoading',
        data: true
      })
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      const RESPONSE = await axios.post('https://api.traininblocks.com/v2/plans', {
        id: parseInt(payload.planId),
        name: payload.planName,
        duration: payload.planDuration,
        notes: payload.planNotes,
        block_color: payload.planBlockColor,
        ordered: payload.planOrdered
      })
      commit('updatePlanWhole', {
        clientId: payload.clientId,
        planId: payload.planId,
        data: JSON.parse(JSON.stringify(Object.assign({}, RESPONSE.data)).replace('{"0":', '').replace('}}', '}'))
      })
      localStorage.setItem('clients', JSON.stringify(state.clients))
    },
    async deletePlan ({ dispatch, commit }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.delete(`https://api.traininblocks.com/v2/plans/${parseInt(payload.planId)}`)
      await dispatch('clientForceGet')
      await dispatch('clientsToVue')
    },

    // Sessions

    async getSessions ({ commit, state }, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      if (!PLAN.sessions || payload.force) {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/sessions/${PLAN.id}`)
        const SORTED_RESPONSE = RESPONSE.data.sort((a, b) => {
          return new Date(a.date) - new Date(b.date)
        })
        commit('updatePlanSessions', {
          clientId: CLIENT.client_id,
          planId: PLAN.id,
          data: SORTED_RESPONSE.length === 0 ? false : SORTED_RESPONSE
        })
      }
      localStorage.setItem('clients', JSON.stringify(state.clients))
    },
    async addSession ({ dispatch, commit }, payload) {
      let newSessionId
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.put('https://api.traininblocks.com/v2/sessions',
        {
          name: payload.sessionName,
          programme_id: parseInt(payload.planId),
          date: payload.sessionDate,
          notes: payload.sessionNotes,
          week_id: payload.sessionWeek
        }
      ).then((response) => {
        newSessionId = response.data[0]['LAST_INSERT_ID()']
      })
      await dispatch('getSessions', {
        clientId: payload.clientId,
        planId: payload.planId,
        force: true
      })
      return newSessionId
    },
    async updateSession ({ dispatch, commit, getters }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      const SESSION = getters.helper('match_session', payload.clientId, payload.planId, payload.sessionId)
      await axios.post('https://api.traininblocks.com/v2/sessions',
        {
          id: SESSION.id,
          name: SESSION.name,
          date: SESSION.date,
          notes: SESSION.notes,
          week_id: SESSION.week_id,
          checked: SESSION.checked
        }
      )
      await dispatch('getSessions', {
        clientId: payload.clientId,
        planId: payload.planId,
        force: true
      })
    },
    async deleteSession ({ dispatch, commit }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      await axios.delete(`https://api.traininblocks.com/v2/sessions/${payload.sessionId}`)
      await dispatch('getSessions', {
        clientId: parseInt(payload.clientId),
        planId: parseInt(payload.planId),
        force: true
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
