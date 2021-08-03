export const state: State = {
  authenticated: false,
  isTrainer: false,
  claims: {
    user_type: 0
  },

  instanceReady: false,
  loading: false,
  silentLoading: false,
  dontLeave: false,
  noClients: true,
  pwa: {
    deferredPrompt: false,
    displayMode: 'browser tab',
    canInstall: false,
    installed: false
  },
  connected: true,
  clientUserLoaded: false,

  bookings: [],

  clients: [],
  clientDetails: {
    pt_id: '',
    client_id: 0,
    name: '',
    email: '',
    number: '',
    notes: '',
    archive: 0,
    notifications: 0
  },
  clientUser: {
    pt_id: '',
    name: '',
    number: '',
    plans: [],
    profile_image: '',
    sessionsToday: [],
    bookings: [],
    products: []
  },

  portfolio: {
    business_name: '',
    trainer_name: '',
    notes: ''
  },

  hasCheckedStripeConnect: false,
  isStripeConnected: false,
  products: [],

  templates: [],

  archive: {
    clients: [],
    noArchive: true
  },

  policyVersion: '1.1',
  versionName: 'Andromeda',
  versionBuild: '4.0',
  newBuild: false,
  showEULA: false,

  coupon: {
    checked: false,
    generated: false,
    code: ''
  }
}

export interface Portfolio {
  pt_id?: string,
  business_name: string,
  trainer_name: string,
  notes: string,
  notifications?: number
}
export interface Claims {
  email?: string,
  sub?: string,
  user_type: number,
  client_id_db?: number,
  ga?: boolean,
  theme?: string,
  policy?: Array<string>,
  calendar?: string
}

export interface Booking {
  id: number,
  client_id: number,
  datetime: string,
  notes: string,
  status: string,
  isClientSide?: boolean,
  created_at?: string,
  updated_at?: string
}

export interface Session {
  id: number,
  client_id?: number,
  programme_id: number,
  name: string,
  date: string,
  checked: number,
  notes: string,
  feedback: string,
  week_id: number,
  created_at?: string,
  updated_at?: string
}

export interface Plan {
  id: number,
  client_id: number,
  name: string,
  duration: number,
  notes: string,
  block_color: string,
  sessions?: Array<Session>,
  created_at?: string,
  updated_at?: string
}

export interface Client {
  pt_id: string,
  client_id: number,
  name: string,
  email: string,
  number: string,
  profile_image?: string,
  notes: string,
  archive: number,
  notifications: number
  plans?: Array<Plan>,
  created_at?: string,
  updated_at?: string
}

export interface Product {
  id: number,
  pt_id: string,
  name: string,
  notes: string
  type: string,
  currency: string,
  price: string,
  created_at?: string,
  updated_at?: string
}

export interface Template {
  id: number,
  pt_id: string,
  name: string,
  template: string,
  created_at?: string,
  updated_at?: string
}

export interface State {
  // Auth

  authenticated: boolean,
  isTrainer: boolean,
  claims: Claims,

  // System

  instanceReady: boolean,
  loading: boolean,
  silentLoading: boolean,
  dontLeave: boolean,
  noClients: boolean,
  pwa: {
    deferredPrompt: boolean,
    displayMode: string,
    canInstall: boolean,
    installed: boolean
  },
  connected: boolean,
  clientUserLoaded: boolean,

  // Bookings
  bookings: Array<Booking>,

  // Clients

  clients: Array<Client>,
  clientDetails: Client,
  clientUser: {
    pt_id: string,
    name: string,
    number: string,
    plans: Array<Plan>,
    profile_image: string,
    sessionsToday: Array<Session>,
    bookings: Array<Booking>,
    products: Array<Product>
  },

  // Portfolio

  portfolio: Portfolio,

  // Products
  hasCheckedStripeConnect: boolean,
  isStripeConnected: boolean,
  products: Array<Product>,

  // Template

  templates: Array<Template>,

  // Archive

  archive: {
    clients: Array<Client>,
    noArchive: true
  },

  // Versioning

  policyVersion: string,
  versionName: string,
  versionBuild: string,
  newBuild: boolean,
  showEULA: boolean,

  // Coupons
  coupon: {
    checked: boolean,
    generated: boolean,
    code: string
  }
}