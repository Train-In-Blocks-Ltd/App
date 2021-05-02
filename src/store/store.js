import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { deleteEmail, deleteEmailText, passChangeEmail, passChangeEmailText } from '../components/email'

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

    setData (state, payload) {
      state[payload.attr] = payload.data
    },
    setDataDeep (state, payload) {
      state[payload.attrParent][payload.attrChild] = payload.data
    },
    setSystemData (state, payload) {
      switch (payload.type) {
        case 'eula':
          state.showEULA = payload.data
          break
        case 'connected':
          state.connected = payload.data
          break
        case 'clients':
          state.clients = payload.data
          state.noClients = state.clients.length === 0
          break
        case 'archive_clients':
          state.archive.clients = payload.data
          state.archive.noArchive = state.archive.clients.length === 0
          break
        case 'client_details':
          state.clientDetails = payload.data
          break
        case 'client_plan': {
          const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
          for (let plan of CLIENT.plans) {
            if (plan.id === parseInt(payload.planId)) {
              plan = payload.data
              break
            }
          }
        }
      }
    },

    // Clients

    updateClient (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      CLIENT[payload.attr] = payload.data
    },

    // Account

    // Archive

    // Plan and sessions
    updatePlanSessions (state, payload) {
      const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
      const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
      PLAN.sessions = payload.data
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
    async saveClaims ({ dispatch, commit, state }) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
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
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async resolveError ({ dispatch, state }, msg) {
      if (state.claims.user_type !== 'Admin') {
        await axios.post('/.netlify/functions/error',
          {
            msg,
            claims: state.claims
          }
        )
      }
      dispatch('endLoading')
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
        data: SORTED_CLIENTS
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
    async clientUpdate ({ dispatch, commit }, payload) {
      commit('setLoading', ['silentLoading', 'dontLeave'])
      try {
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
        await dispatch('clientsForceGet')
        await dispatch('clientsToVue')
        // this.$refs.response_pop_up.show('Client updated', 'All your changes have been saved')
        dispatch('endLoading')
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
          data: SORTED_ARCHIVE_CLIENTS
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
    async clientArchive ({ dispatch, commit, state }, payload) {
      if (await this.$refs.confirm_pop_up.show('Are you sure that you want to archive/hide this client?', 'Their data will be stored, but it will be removed if deleted from the Archive.')) {
        commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        commit('setSystemData', {
          type: 'clients',
          data: state.clients.splice(payload.index, 1)
        })
        const CLIENT = state.clients.find(client => client.client_id === payload.id)
        const EMAIL = CLIENT.email
        try {
          this.response = await axios.post(`https://api.traininblocks.com/v2/clients/archive/${payload.id}`).data
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
          dispatch('endLoading')
          this.$router.push('/')
        } catch (e) {
          dispatch('resolveError', e)
        }
      }
    },
    async clientUnarchive ({ dispatch, commit, state }, id) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
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
        data: SORTED_CLIENTS
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
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
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
        commit('setData', {
          attr: 'portfolio',
          data: JSON.parse(localStorage.getItem('portfolio'))
        })
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
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
    async createPortfolio ({ dispatch, commit, state }) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
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
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },

    // Account

    async changePassword ({ dispatch, commit, state }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      try {
        await axios.post('/.netlify/functions/okta',
          {
            type: 'POST',
            body: {
              oldPassword: payload.password.old,
              newPassword: payload.password.new
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
        dispatch('endLoading')
        this.will_body_scroll(true)
      } catch (e) {
        dispatch('resolveError', e)
      }
    },

    // Archive

    // Client

    async getClientDetails ({ dispatch, commit, state }, payload) {
      commit('setLoading', ['loading'])
      try {
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
        if (CLIENT.plans !== false) {
          CLIENT.plans.forEach((plan) => {
            dispatch('getSessions', {
              planId: plan.id,
              clientId: CLIENT.client_id,
              force: false
            })
          })
        }
        commit('setSystemData', {
          type: 'client_details',
          data: CLIENT
        })
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async getSessions ({ dispatch, commit, state }, payload) {
      try {
        const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
        const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
        if (!PLAN.sessions || payload.force) {
          const RESPONSE = await axios.get(`https://api.traininblocks.com/v2/sessions/${PLAN.id}`)
          commit('updatePlanSessions', {
            clientId: CLIENT.client_id,
            planId: PLAN.id,
            data: RESPONSE.data.length === 0 ? false : RESPONSE.data
          })
        }
        localStorage.setItem('clients', JSON.stringify(state.clients))
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },

    // Plan and sessions

    // (clientId, planName, planDuration, blockColor, planNotes, planSessions)
    async duplicatePlan ({ dispatch, commit, state }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      try {
        await axios.put('https://api.traininblocks.com/v2/plans',
          {
            name: `Copy of ${payload.planName}`,
            client_id: parseInt(payload.clientId),
            duration: payload.planDuration,
            block_color: payload.blockColor,
            ordered: state.client_details.plans.length
          }
        ).then((response) => {
          const CLIENT = state.clients.find(client => client.client_id === parseInt(payload.clientId))
          const PLAN = CLIENT.plans.find(plan => plan.id === parseInt(payload.planId))
          dispatch('updatePlan', {
            id: response.data[0]['LAST_INSERT_ID()'],
            name: PLAN.name,
            duration: PLAN.duration,
            notes: payload.planNotes,
            block_color: PLAN.blockColor,
            ordered: PLAN.ordered
          })
          if (payload.planSessions) {
            payload.planSessions.forEach((session) => {
              this.add_session({
                clientId: parseInt(payload.clientId),
                planId: response.data[0]['LAST_INSERT_ID()'],
                sessionName: session.name,
                sessionDate: session.date,
                sessionNotes: session.notes,
                sessionWeek: session.week_id
              }, 'duplicate')
            })
          }
        })
        await dispatch('getClientDetails', {
          clientId: payload.clientId,
          force: true
        })
        this.$ga.event('Plan', 'new')
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },

    // (clientId, planId, planName, planDuration, planNotes, planBlockColor, planOrdered)
    async updatePlan ({ dispatch, commit, state }, payload) {
      commit('setLoading', ['silentLoading', 'dontLeave'])
      try {
        const RESPONSE = await axios.post('https://api.traininblocks.com/v2/plans',
          {
            id: payload.planId,
            name: payload.planName,
            duration: payload.planDuration,
            notes: payload.planNotes,
            block_color: payload.planBlockColor,
            ordered: payload.planOrdered
          }
        )
        commit('setSystemData', {
          type: 'client_plan',
          clientId: payload.clientId,
          planId: payload.planId,
          data: JSON.parse(JSON.stringify(Object.assign({}, RESPONSE.data)).replace('{"0":', '').replace('}}', '}'))
        })
        localStorage.setItem('clients', JSON.stringify(state.clients))
        this.$ga.event('Plan', 'update')
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async deletePlan ({ dispatch, commit }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      if (await this.$parent.$parent.$refs.confirm_pop_up.show('Are you sure you want to delete this plan?', 'We will remove this plan from our database and it won\'t be recoverable.')) {
        try {
          await axios.delete(`https://api.traininblocks.com/v2/plans/${parseInt(payload.planId)}`)
          await dispatch('clientForceGet')
          await dispatch('clientsToVue')
          this.$ga.event('Session', 'delete')
          this.$parent.$parent.$refs.response_pop_up.show('Plan deleted', 'Your changes have been saved')
          dispatch('endLoading')
          this.$router.push({ path: `/client/${this.$parent.$parent.client_details.client_id}/` })
        } catch (e) {
          dispatch('resolveError', e)
        }
      }
    },
    async updateSession ({ dispatch, commit, getters }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      this.$parent.$parent.dontLeave = true
      const SESSION = getters.helper('match_session', payload.clientId, payload.planId, payload.sessionId)
      try {
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
        this.adherence()
        this.$ga.event('Session', 'update')
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async addSession ({ dispatch, commit }, payload) {
      let newSessionId
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      try {
        await axios.put('https://api.traininblocks.com/v2/sessions',
          {
            name: payload.sessionName,
            programme_id: payload.planId,
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
        if (payload.type === 'new') {
          this.go_to_event(newSessionId, this.currentWeek)
          this.$ga.event('Session', 'new')
          this.$parent.$parent.$refs.response_pop_up.show('New session added', 'Get programming!')
        } else if (payload.type === 'duplicate') {
          this.$ga.event('Session', 'duplicate')
          this.$parent.$parent.$refs.response_pop_up.show(`${this.selectedSessions.length > 1 ? 'Sessions' : 'Session'} duplicated`, 'Get programming!')
        } else if (payload.type === 'progress') {
          this.$parent.$parent.$refs.response_pop_up.show('Sessions have been progressed', 'Please go through them to make sure that you\'re happy with it')
        }
        if (payload.type !== 'progress') {
          this.sort_sessions(this.helper('match_plan'))
          this.check_for_new()
          this.adherence()
          this.check_for_week_sessions()
        }
        dispatch('endLoading')
      } catch (e) {
        dispatch('resolveError', e)
      }
    },
    async delete_session ({ dispatch, commit }, payload) {
      commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      try {
        await axios.delete(`https://api.traininblocks.com/v2/sessions/${parseInt(payload.sessionId)}`)
        await dispatch('getSessions', {
          clientId: payload.clientId,
          planId: payload.planId,
          force: true
        })

        this.$ga.event('Session', 'delete')
        this.check_for_week_sessions()
        this.$parent.$parent.end_loading()
      } catch (e) {
        dispatch('resolveError', e)
      }
    }
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
