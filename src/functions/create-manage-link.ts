import axios from "axios";
import qs from "querystring";
import Stripe from "stripe";
import { Handler } from "@netlify/functions";

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("./helpers/prod.env")
        : require("./helpers/dev.env");

const stripe = new Stripe(CUSTOM_ENV.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
});
const headers = require("./helpers/headers");

export const handler: Handler = async (event) => {
    if (event.headers.authorization) {
        const accessToken = event.headers.authorization.split(" ");
        const response = await axios.post(
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
            return {
                statusCode: 200,
                headers,
                body: "",
            };
        } else if (event.body && response.data.active === true) {
            try {
                const response = await stripe.billingPortal.sessions.create({
                    customer: JSON.parse(event.body).id,
                    return_url:
                        event.multiValueHeaders.Referer &&
                        event.multiValueHeaders.Referer[0] ===
                            "https://app.traininblocks.com/account"
                            ? "https://app.traininblocks.com/account"
                            : "https://dev.traininblocks.com/account",
                });
                return {
                    statusCode: 200,
                    headers,
                    body: response.url,
                };
            } catch (e) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify(e),
                };
            }
        }
    }
    return {
        statusCode: 401,
        headers,
        body: "401 - Unauthorized",
    };
};
