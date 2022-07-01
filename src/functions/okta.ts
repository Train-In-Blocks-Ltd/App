import axios from "axios";
import qs from "querystring";
import { Handler } from "@netlify/functions";

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("../../config/prod.env")
        : require("../../config/dev.env");
const headers = require("./helpers/headers");

export const handler: Handler = async (event) => {
    if (event.headers.authorization) {
        const accessToken = event.headers.authorization.split(" ");
        let response = await axios.post(
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
            const data = JSON.parse(event.body);
            if (data.type === "POST") {
                try {
                    response = await axios.post(
                        `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/users/${data.url}`,
                        data.body,
                        {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: process.env.OKTA_AUTH_KEY,
                            },
                        }
                    );
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(response.data),
                    };
                } catch (e) {
                    if (data.url.includes("suspend")) {
                        return {
                            statusCode: 200,
                            headers,
                            body: "Archived Successfully",
                        };
                    }
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify(e),
                    };
                }
            } else if (data.type === "GET") {
                try {
                    const response = await axios.get(
                        `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/users/${data.url}`,
                        {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: process.env.OKTA_AUTH_KEY,
                            },
                        }
                    );
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify(response.data),
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
    }
    return {
        statusCode: 401,
        headers,
        body: "401 - Unauthorized",
    };
};
