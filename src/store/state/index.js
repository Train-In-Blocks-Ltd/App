import archive from "./archive";
import bookings from "./bookings";
import clients from "./clients";
import plans from "./plans";
import portfolio from "./portfolio";
import products from "./products";
import sessions from "./sessions";
import system from "./system";
import templates from "./templates";
const { merge } = require("webpack-merge");

export default merge(
  archive,
  bookings,
  clients,
  plans,
  portfolio,
  products,
  sessions,
  system,
  templates
);
