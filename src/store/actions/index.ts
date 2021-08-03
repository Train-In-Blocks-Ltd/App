import system from './system'
import clients from './clients'
import templates from './templates'
import portfolio from './portfolio'
import products from './products'
import account from './account'
import plans from './plans'
import sessions from './sessions'
import bookings from './bookings'
import clientSide from './client_side'
const { merge } = require('webpack-merge')

export default merge(
  system,
  clients,
  templates,
  portfolio,
  products,
  account,
  plans,
  sessions,
  bookings,
  clientSide
)
