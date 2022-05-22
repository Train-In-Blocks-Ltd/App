import axios from "axios";
import qs from "querystring";
import { v2 as cloudinary } from "cloudinary";
import { Handler } from "@netlify/functions";

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("./helpers/prod.env")
        : require("./helpers/dev.env");
const headers = require("./helpers/headers");

cloudinary.config({
    cloud_name: CUSTOM_ENV.CLOUDINARY.CLOUD_NAME,
    api_key: CUSTOM_ENV.CLOUDINARY.API_KEY,
    api_secret: CUSTOM_ENV.CLOUDINARY.API_SECRET,
});

const handler: Handler = async (event) => {
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
                const { file } = await JSON.parse(event.body);
                const res = await cloudinary.uploader.destroy(
                    file.match(/([^/]+)(?=\.\w+$)/g)
                );
                return {
                    statusCode: 200,
                    body: JSON.stringify(res),
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
