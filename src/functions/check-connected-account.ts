import axios from "axios";
import qs from "querystring";
import Stripe from "stripe";
import { Handler } from "@netlify/functions"; 

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("../../config/prod.env")
        : require("../../config/dev.env");

if (!process.env.STRIPE_SECRET_KEY) {
    throw "API Keys not set";
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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
                if (JSON.parse(event.body).connectedAccountId) {
                    const account = await stripe.accounts.retrieve(
                        JSON.parse(event.body).connectedAccountId
                    );
                    if (
                        account.id !== "acct_1GLXT9BYbiJubfJM" &&
                        account.charges_enabled
                    ) {
                        return {
                            statusCode: 200,
                            headers,
                            body: "true",
                        };
                    } else {
                        return {
                            statusCode: 200,
                            headers,
                            body: "false",
                        };
                    }
                } else {
                    return {
                        statusCode: 200,
                        headers,
                        body: "false",
                    };
                }
            } catch (e) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify(e),
                };
            }
        } else {
            return {
                statusCode: 401,
                headers,
                body: "401 - Unauthorized",
            };
        }
    } else {
        return {
            statusCode: 401,
            headers,
            body: "401 - Unauthorized",
        };
    }
};
