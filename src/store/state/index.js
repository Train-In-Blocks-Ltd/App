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
    modalPersist: false,

    // Response pop-up
    responseOpen: false,
    responseTitle: null,
    responseDescription: null,
    responsePersist: false,
    responseBackdrop: false,

    // Selection
    selectedIds: [],

    // App state
    loading: false,
    silentLoading: false,
    dontLeave: false,
    disableButtons: false,

    // System
    search: "",
    instanceReady: false,
    pwa: {
        deferredPrompt: null,
        displayMode: "browser tab",
        canInstall: false,
        installed: null,
    },
    connected: true,
    clientUserLoaded: false,
    previewHTML: undefined,

    // Confirm pop up
    confirmPromise: undefined,
    confirmTitle: undefined,
    confirmText: undefined,

    // Upload pop up
    uploadPromise: undefined,
    uploadTitle: undefined,
    uploadText: undefined,

    // Txt input pop up
    txtInputPromise: undefined,
    txtInputTitle: undefined,
    txtInputText: undefined,
    txtInputLabel: undefined,
    txtInputValue: undefined,
    txtInputPlaceholder: undefined,

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
        products: [],
    },

    // Portfolio
    portfolio: {
        business_name: "",
        trainer_name: "",
        notes: "",
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
    },

    // Versioning
    policyVersion: "1.1",
    versionName: "Andromeda",
    versionBuild: "4.0",
    newBuild: false,

    // Coupons
    coupon: {
        checked: false,
        generated: false,
        code: null,
    },

    // Sessions
    currentWeek: 1,
    editor: undefined,
    cloudinaryImages: {
        startingWith: [],
        endingWith: [],
    },
    newImgs: [],
};
