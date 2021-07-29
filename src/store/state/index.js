export default {

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
  clientUserLoaded: false,

  // Bookings
  bookings: [],

  // Clients

  clients: null,
  clientDetails: null,
  clientUser: {
    plans: null,
    profile_image: null,
    sessionsToday: [],
    bookings: [],
    products: []
  },

  // Portfolio

  portfolio: {
    business_name: '',
    trainer_name: '',
    notes: ''
  },

  // Products
  hasCheckedStripeConnect: false,
  isStripeConnected: false,
  products: [],

  // Template

  templates: null,

  // Archive

  archive: {
    clients: {},
    noArchive: true
  },

  // Versioning

  policyVersion: '1.1',
  versionName: 'Andromeda',
  versionBuild: '4.0',
  newBuild: false,
  showEULA: false
}
