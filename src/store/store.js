import Vue from 'vue'
import Vuex from 'vuex'

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
    noClients: false,
    pwa: {
      deferredPrompt: null,
      displayMode: 'browser tab',
      canInstall: false,
      installed: null
    },
    connected: true,

    // Clients
    clients: null,
    client_details: null,
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

    // Home

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

    // Client

    // Plan and sessions
  },
  actions: {
    // System

    // Home

    // Templates
    async getTemplates ({ commit, state }, force) {
      try {
        if (!localStorage.getItem('templates') || force || state.claims.user_type === 'Admin') {
          const RESPONSE = await this.$axios.get(`https://api.traininblocks.com/v2/templates/${state.claims.sub}`)
          localStorage.setItem('templates', JSON.stringify(RESPONSE.data))
        }
        commit('setTemplates', JSON.parse(localStorage.getItem('templates')))
      } catch (e) {
        this.resolve_error(e)
      }
    },
    async newTemplate ({ dispatch, commit, state }) {
      commit('setLoading', ['dontLeave'])
      try {
        await this.$axios.put('https://api.traininblocks.com/v2/templates',
          {
            pt_id: state.claims.sub,
            name: 'Untitled',
            template: ''
          }
        )
        await dispatch('getTemplates', true)
        this.check_for_new()
        this.helper('new')
        commit('setLoading')
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async updateTemplate ({ dispatch, commit, state }, templateId) {
      commit('setLoading', ['dontLeave'])
      try {
        const TEMPLATE = state.templates.find(template => template.id === templateId)
        await this.$axios.post('https://api.traininblocks.com/v2/templates',
          {
            name: TEMPLATE.name,
            template: TEMPLATE.template,
            id: templateId
          }
        )
        await dispatch('getTemplates', true)
        this.helper('update')
        commit('setLoading')
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async deleteTemplate ({ dispatch, commit }, id) {
      commit('setLoading', ['dontLeave'])
      try {
        await this.$axios.delete(`https://api.traininblocks.com/v2/templates/${id}`)
        await dispatch('getTemplates', true)
        commit('setLoading')
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },

    // Portfolio
    async getPortfolio ({ commit, state }, force) {
      try {
        if (!localStorage.getItem('portfolio') || force || state.claims.user_type === 'Admin') {
          if (state.claims.user_type === 'Trainer' || state.claims.user_type === 'Admin') {
            const RESPONSE = await this.$axios.get(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`)
            if (RESPONSE.data.length === 0) {
              this.create_portfolio()
            } else {
              localStorage.setItem('portfolio', JSON.stringify(RESPONSE.data[0]))
            }
          } else {
            const CLIENT = await this.$axios.get(`https://api.traininblocks.com/v2/ptId/${state.claims.client_id_db}`)
            if (CLIENT.data[0].pt_id) {
              const RESPONSE = await this.$axios.get(`https://api.traininblocks.com/v2/portfolio/${CLIENT.data[0].pt_id}`)
              if (RESPONSE.data.length !== 0) {
                localStorage.setItem('portfolio', JSON.stringify(RESPONSE.data[0]))
              }
            }
          }
        }
        commit('setPortfolio', JSON.parse(localStorage.getItem('portfolio')))
        commit('setLoading')
      } catch (e) {
        this.resolve_error(e)
      }
    },
    async updatePortfolio ({ dispatch, commit, state }) {
      commit('setLoading', ['loading', 'silentLoading', 'dontLeave'])
      try {
        await this.$axios.post(`https://api.traininblocks.com/v2/portfolio/${state.claims.sub}`,
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
        this.$parent.resolve_error(e)
      }
    },
    async createPortfolio ({ dispatch, commit, state }) {
      commit('setLoading', ['dontLeave'])
      try {
        await this.$axios.put('https://api.traininblocks.com/v2/portfolio',
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
        this.resolve_error(e)
      }
    }

    // Account

    // Archive

    // Client

    // Plan and sessions
  },
  getters: {

    // System
    getLoadingState: (state) => {
      return state.loading
    },

    // Home

    // Templates

    // Portfolio

    // Account

    // Archive

    // Client

    // Plan and sessions
    sessionPlanHelper: (state, getters) => (type, planId, sessionId) => {
      switch (type) {
        case 'match_plan':
          return state.client_details.plans.find(plan => plan.id === parseInt(planId))
        case 'match_session': {
          const PLAN = getters.sessionPlanHelper('match_plan', planId)
          return PLAN.sessions.find(session => session.id === parseInt(sessionId))
        }
      }
    }
  }
})
