import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { deleteEmail, deleteEmailText, passChangeEmail, passChangeEmailText } from './components/email'

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
      plans: null
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

    setLoading (state, data) {
      state.loading = data.includes('loading') || false
      state.silentLoading = data.includes('silentLoading') || false
      state.dontLeave = data.includes('dontLeave') || false
    },
    setClaims (state, data) {
      state.claims = data
    },
    setSystemData (state, data) {
      switch (data.type) {
        case 'eula':
          state.showEULA = data.payload
          break
        case 'connected':
          state.connected = data.payload
          break
        case 'clients':
          state.clients = data.payload
          state.noClients = data.clients.length === 0
          break
        case 'archive_clients':
          state.archive.clients = data.payload
          state.archive.noArchive = data.archive.clients.length === 0
          break
        case 'client_details':
          state.clientDetails = data.payload
          break
      }
    },

    // Clients

    updateClient (state, data) {
      const CLIENT = state.clients.find(client => client.client_id === data.clientId)
      CLIENT[data.attr] = data.payload
    },

    // Templates

    setTemplates (state, data) {
      state.templates = data
    },

    // Portfolio

    setPortfolio (state, data) {
      state.portfolio = data
    }

    // Account

    // Archive

    // Plan and sessions
  },
  actions: {

    // System

    async setup ({ commit, state }) {
      commit('setClaims', localStorage.getItem('claims') ? JSON.parse(localStorage.getItem('claims')) : this.$auth.getUser())
      if (state.claims) {
        // Sets initial claims
        if (!state.claims.ga || !state.claims) {
          const CURRENT_CLAIMS = state.claims
          CURRENT_CLAIMS.ga = true
          commit('setClaims', CURRENT_CLAIMS)
        }
        // Sets initial theme
        if (!state.claims.theme || !state.claims) {
          const CURRENT_CLAIMS = state.claims
          CURRENT_CLAIMS.theme = 'system'
          commit('setClaims', CURRENT_CLAIMS)
        }

        // Run claims and theme
        state.claims.ga !== false ? this.$ga.enable() : this.$ga.disable()
        this.darkmode(state.claims.theme)

        // Check version
        if ((!state.claims.policy || !state.claims.policy || state.policyVersion !== state.claims.policy[2]) && state.claims.email !== 'demo@traininblocks.com' && this.$route.path !== '/login') {
          this.will_body_scroll(false)
          commit('setSystemData', {
            type: 'eula',
            payload: true
          })
        }
      }

      // Auth
      axios.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`
      await this.clients_to_vue()

      // Connection
      commit('setSystemData', {
        type: 'connected',
        payload: navigator.onLine
      })
      window.addEventListener('offline', function (event) {
        commit('setSystemData', {
          type: 'connected',
          payload: false
        })
      })
      window.addEventListener('online', function (event) {
        commit('setSystemData', {
          type: 'connected',
          payload: true
        })
      })
    },
    async saveClaims ({ dispatch, commit, state }) {
      commit('setLoading', ['dontLeave'])
      try {
        await axios.post('/.netlify/functions/okta',
          {
            type: 'POST',
            body: {
              profile: {
                ga: state.claims.ga,
                theme: state.claims.theme,
                policy: state.claims.policy
              }
            },
            url: `${state.claims.sub}`
          }
        )
        localStorage.removeItem('claims')
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async resolveError ({ commit, state }, msg) {
      if (this.claims.user_type !== 'Admin') {
        await axios.post('/.netlify/functions/error',
          {
            msg,
            claims: state.claims
          }
        )
      }
      commit('setLoading')
      // this.$refs.response_pop_up.show('ERROR: this problem has been reported to our developers', msg.toString() !== 'Error: Network Error' ? msg.toString() : 'You may be offline. We\'ll try that request again once you\'ve reconnected', true, true)
      this.will_body_scroll(false)
      console.error(msg)
    },

    // Clients

    async clientsAndArchiveHelper () {
      await this.archive_f()
      this.archive_to_vue()
      await this.clients_f()
      this.clients_to_vue()
      this.end_loading()
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
      commit('setSystemData', {
        type: 'clients',
        payload: SORTED_CLIENTS
      })
    },
    async clientsForceGet ({ dispatch }) {
      try {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clients/${this.claims.sub}`)
        localStorage.setItem('clients', JSON.stringify(RESPONSE.data))
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async clientUpdate ({ dispatch, commit }, data) {
      commit('setLoading', ['silentLoading', 'dontLeave'])
      try {
        await axios.post('https://api.traininblocks.com/v2/clients',
          {
            id: data.client_id,
            name: data.name,
            email: data.email,
            number: data.number,
            notifications: data.notifications,
            notes: data.notes
          }
        )
        await dispatch('clientsForceGet')
        await dispatch('clientsToVue')
        // this.$refs.response_pop_up.show('Client updated', 'All your changes have been saved')
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
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
        commit('setSystemData', {
          type: 'archive_clients',
          payload: SORTED_ARCHIVE_CLIENTS
        })
      }
    },
    async archiveForceGet ({ dispatch }) {
      try {
        const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/clients/${this.claims.sub}/archive`)
        localStorage.setItem('archive', JSON.stringify(RESPONSE.data))
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async clientArchive ({ dispatch, commit, state }, data) {
      if (await this.$refs.confirm_pop_up.show('Are you sure that you want to archive/hide this client?', 'Their data will be stored, but it will be removed if deleted from the Archive.')) {
        commit('setLoading', ['dontLeave'])
        commit('setSystemData', {
          type: 'clients',
          payload: state.clients.splice(data.index, 1)
        })
        const CLIENT = state.clients.find(client => client.client_id === data.id)
        const EMAIL = CLIENT.email
        try {
          this.response = await axios.post(`https://api.traininblocks.com/v2/clients/archive/${data.id}`).data
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
          this.$refs.response_pop_up.show('Client archived', 'Their data will be kept safe on the archive page')
          commit('setLoading')
          this.$router.push('/')
        } catch (e) {
          dispatch('resolveError', e)
        }
      }
    },
    async clientUnarchive ({ dispatch, commit, state }, id) {
      commit('setLoading', ['dontLeave'])
      const CLIENT = state.archive.clients.find(client => client.client_id === id)
      const LOCAL_STORAGE_ARRAY = JSON.parse(localStorage.getItem('clients'))
      LOCAL_STORAGE_ARRAY.push(CLIENT)
      localStorage.setItem('clients', JSON.stringify(LOCAL_STORAGE_ARRAY))
      const SORTED_CLIENTS = JSON.parse(localStorage.getItem('clients')).sort((a, b) => {
        const NAME_A = a.name.toUpperCase()
        const NAME_B = b.name.toUpperCase()
        return (NAME_A < NAME_B) ? -1 : (NAME_A > NAME_B) ? 1 : 0
      })
      commit('setSystemData', {
        type: 'clients',
        payload: SORTED_CLIENTS
      })
      try {
        const RESPONSE = await axios.post(`https://api.traininblocks.com/v2/clients/unarchive/${id}`)
        this.response = RESPONSE.data
        await dispatch('clientsAndArchiveHelper')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async clientDelete ({ dispatch, commit }, id) {
      commit('setLoading', ['dontLeave'])
      try {
        await axios.delete(`https://api.traininblocks.com/v2/clients/${id}`)
        await dispatch('clientsAndArchiveHelper')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },

    // Home

    // Templates

    async getTemplates ({ dispatch, commit, state }, force) {
      try {
        if (!localStorage.getItem('templates') || force || state.claims.user_type === 'Admin') {
          const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/templates/${state.claims.sub}`)
          localStorage.setItem('templates', JSON.stringify(RESPONSE.data))
        }
        commit('setTemplates', JSON.parse(localStorage.getItem('templates')))
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async newTemplate ({ dispatch, commit, state }) {
      commit('setLoading', ['dontLeave'])
      try {
        await axios.put('https://api.traininblocks.com/v2/templates',
          {
            pt_id: state.claims.sub,
            name: 'Untitled',
            template: ''
          }
        )
        await dispatch('getTemplates', true)
        this.check_for_new()
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async updateTemplate ({ dispatch, commit, state }, templateId) {
      commit('setLoading', ['dontLeave'])
      try {
        const TEMPLATE = state.templates.find(template => template.id === templateId)
        await axios.post('https://api.traininblocks.com/v2/templates',
          {
            name: TEMPLATE.name,
            template: TEMPLATE.template,
            id: templateId
          }
        )
        await dispatch('getTemplates', true)
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async deleteTemplate ({ dispatch, commit }, id) {
      commit('setLoading', ['dontLeave'])
      try {
        await axios.delete(`https://api.traininblocks.com/v2/templates/${id}`)
        await dispatch('getTemplates', true)
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },

    // Portfolio

    async getPortfolio ({ dispatch, commit, state }, force) {
      try {
        if (!localStorage.getItem('portfolio') || force || state.claims.user_type === 'Admin') {
          if (state.claims.user_type === 'Trainer' || state.claims.user_type === 'Admin') {
            const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`)
            if (RESPONSE.data.length === 0) {
              this.create_portfolio()
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
        commit('setPortfolio', JSON.parse(localStorage.getItem('portfolio')))
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async updatePortfolio ({ dispatch, commit, state }) {
      commit('setLoading', ['loading', 'silentLoading', 'dontLeave'])
      try {
        await axios.post(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`,
          {
            trainer_name: state.portfolio.trainer_name,
            business_name: state.portfolio.business_name,
            notes: state.portfolio.notes
          }
        )
        await dispatch('getPortfolio')
        this.$ga.event('Portfolio', 'update')
        // this.$parent.$refs.response_pop_up.show('Portfolio updated', 'Your clients can access this information')
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async createPortfolio ({ dispatch, commit, state }) {
      commit('setLoading', ['dontLeave'])
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
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },

    // Account

    async changePassword ({ dispatch, commit, state }, data) {
      commit('setLoading', ['dontLeave'])
      try {
        await axios.post('/.netlify/functions/okta',
          {
            type: 'POST',
            body: {
              oldPassword: data.password.old,
              newPassword: data.password.new
            },
            url: `${state.claims.sub}/credentials/change_password`
          }
        )
        await axios.post('/.netlify/functions/send-email',
          {
            to: state.claims.email,
            subject: 'Password Changed',
            text: passChangeEmailText(),
            html: passChangeEmail()
          }
        )
        // this.$parent.$refs.response_pop_up.show('Password changed', 'Remember to not share it and keep it safe')
        commit('setLoading')
        this.will_body_scroll(true)
      } catch (e) {
        dispatch('resolveError', e)
      }
    },

    // Archive

    // Client

    async getClientDetails ({ dispatch, commit, state }, data) {
      commit('setLoading', ['loading'])
      try {
        const CLIENT = state.clients.find(client => client.client_id === parseInt(data.clientId))
        if (!CLIENT.plans || data.force) {
          const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/plans/${CLIENT.client_id}`)
          commit('updateClient', {
            clientId: CLIENT.client_id,
            attr: 'plans',
            payload: RESPONSE.data.length === 0 ? false : RESPONSE.data
          })
        }
        if (CLIENT.plans !== false) {
          state.client_details.plans.forEach((plan) => {
            dispatch('getSessions', {
              planId: plan.id,
              clientId: data.clientId,
              force: false
            })
          })
        }
        commit('setSystemData', {
          type: 'client_details',
          payload: CLIENT
        })
        localStorage.setItem('clients', JSON.stringify(state.clients))
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async getSessions ({ dispatch, commit, state }, data) {
      try {
        const CLIENT = state.clients.find(client => client.client_id === data.clientId)
        const PLAN = CLIENT.plans.find(plan => plan.id === data.planId)
        if (!PLAN.sessions || data.force) {
          const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/sessions/${PLAN.id}`)
          PLAN.sessions = RESPONSE.data.length === 0 ? false : RESPONSE.data
        }
        localStorage.setItem('clients', JSON.stringify(state.clients))
        commit('setLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    }

    // Plan and sessions
  },
  getters: {

    // System
    getLoadingState: (state) => {
      return state.loading
    },

    // Clients
    getClients: (state) => {
      return state.clients
    },

    // Templates

    // Portfolio

    // Account

    // Archive

    // Client details

    // Plan and sessions
    sessionPlanHelper: (state, getters) => (type, planId, sessionId) => {
      switch (type) {
        case 'match_plan':
          return state.plans.find(plan => plan.id === parseInt(planId))
        case 'match_session': {
          const PLAN = getters.sessionPlanHelper('match_plan', planId)
          return PLAN.sessions.find(session => session.id === parseInt(sessionId))
        }
      }
    }
  }
})
