import system from "./system";
import templates from "./templates";
import products from "./products";
import plans from "./plans";
import sessions from "./sessions";
import bookings from "./bookings";
import clientSide from "./client_side";
const { merge } = require("webpack-merge");

export default merge(
  system,
  templates,
  products,
  plans,
  sessions,
  bookings,
  clientSide
);
