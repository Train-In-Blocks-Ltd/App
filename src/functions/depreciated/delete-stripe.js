const axios = require("axios");
const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("./helpers/prod.env")
        : require("./helpers/dev.env");
const stripe = require("stripe")(CUSTOM_ENV.STRIPE_SECRET_KEY);
const headers = require("./helpers/headers");

let response;

exports.handler = async function handler(event, context, callback) {
    if (event.httpMethod === "OPTIONS") {
        return callback(null, {
            statusCode: 200,
            headers,
            body: "",
        });
    } else {
        try {
            const deleted = await stripe.oauth.deauthorize({
                stripe_user_id: "acct_1JCVwKPhTZcwqmOh",
                client_id: "ca_HJZuJlGHQMQ4GNAFNLgx40U1weCC98Ui",
            });
            return callback(null, {
                statusCode: 200,
                headers,
                body: JSON.stringify(deleted),
            });
        } catch (e) {
            return callback(null, {
                statusCode: 500,
                headers,
                body: JSON.stringify(e, response),
            });
        }
    }
};
