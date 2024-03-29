const qs = require("querystring");
const axios = require("axios");
const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require(".../../../config/prod.env")
        : require(".../../../config/dev.env");
/* eslint-disable-next-line */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const headers = require("../helpers/headers");

let response;

exports.handler = async function handler(event, context, callback) {
    if (event.headers.authorization) {
        const accessToken = event.headers.authorization.split(" ");
        response = await axios.post(
            `${CUSTOM_ENV.OKTA.ISSUER}/oauth2/default/v1/introspect?client_id=${CUSTOM_ENV.OKTA.CLIENT_ID}`,
            qs.stringify({
                token: accessToken[1],
                token_type_hint: "access_token",
            }),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        if (event.httpMethod === "OPTIONS") {
            return callback(null, {
                statusCode: 200,
                headers,
                body: "",
            });
        } else if (event.body && response.data.active === true) {
            try {
                if (JSON.parse(event.body).connectedAccountId) {
                    const account = await stripe.accounts.retrieve(
                        JSON.parse(event.body).connectedAccountId
                    );
                    if (
                        account.id !== "acct_1GLXT9BYbiJubfJM" &&
                        account.charges_enabled
                    ) {
                        return callback(null, {
                            statusCode: 200,
                            headers,
                            body: "true",
                        });
                    } else {
                        return callback(null, {
                            statusCode: 200,
                            headers,
                            body: "false",
                        });
                    }
                } else {
                    return callback(null, {
                        statusCode: 200,
                        headers,
                        body: "false",
                    });
                }
            } catch (e) {
                return callback(null, {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify(e, response),
                });
            }
        } else {
            return callback(null, {
                statusCode: 401,
                headers,
                body: "401 - Unauthorized",
            });
        }
    } else {
        return callback(null, {
            statusCode: 401,
            headers,
            body: "401 - Unauthorized",
        });
    }
};
