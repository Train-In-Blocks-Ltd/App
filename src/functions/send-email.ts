import axios from "axios";
import smtpTransport from "nodemailer-smtp-transport";
import nodemailer from "nodemailer";
import qs from "querystring";
import { Handler } from "@netlify/functions";

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("./helpers/prod.env")
        : require("./helpers/dev.env");
const headers = require("./helpers/headers");
const transporter = nodemailer.createTransport(
    smtpTransport({
        service: "gmail",
        host: "smtp-relay.gmail.com",
        secure: true,
        auth: {
            user: CUSTOM_ENV.GOOGLE_WORKSPACE.USERNAME,
            pass: CUSTOM_ENV.GOOGLE_WORKSPACE.PASSWORD,
        },
    })
);

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
                const data = JSON.parse(event.body);
                // options
                const mailOptions = {
                    from: "Train In Blocks <hello@traininblocks.com>",
                    to: data.to, // from req.body.to
                    subject: data.subject, // from req.body.subject
                    text: data.text,
                    html: data.html, // from req.body.message
                };
                await transporter.sendMail(mailOptions);
                return {
                    statusCode: 200,
                    headers,
                    body: "Email sent successfully",
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
