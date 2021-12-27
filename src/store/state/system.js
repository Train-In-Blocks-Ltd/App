export default {
  // Auth

  authenticated: false,
  isTrainer: false,
  claims: {
    user_type: 0,
  },

  // Modal
  modalSize: null,
  modalOpen: false,
  modalContent: null,

  // Response pop-up
  responseOpen: false,
  responseTitle: null,
  responseDescription: null,
  responsePersist: false,
  responseBackdrop: false,

  // System

  search: "",
  instanceReady: false,
  loading: false,
  silentLoading: false,
  dontLeave: false,
  noClients: true,
  pwa: {
    deferredPrompt: null,
    displayMode: "browser tab",
    canInstall: false,
    installed: null,
  },
  connected: true,
  clientUserLoaded: false,

  // Versioning

  policyVersion: "1.1",
  versionName: "Andromeda",
  versionBuild: "4.0",
  newBuild: false,
  showEULA: false,

  // Coupons
  coupon: {
    checked: false,
    generated: false,
    code: null,
  },
};
