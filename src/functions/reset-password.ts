import axios from "axios";
import smtpTransport from "nodemailer-smtp-transport";
import nodemailer from "nodemailer";
import { emailBuilder } from "../common/helpers";
import headers from "./helpers/headers";
import { Handler } from "@netlify/functions";

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("../../config/prod.env")
        : require("../../config/dev.env");

const transporter = nodemailer.createTransport(
    smtpTransport({
        service: "gmail",
        host: "smtp-relay.gmail.com",
        secure: true,
        auth: {
            user: process.env.GOOGLE_WORKSPACE_USERNAME,
            pass: process.env.GOOGLE_WORKSPACE_PASSWORD,
        },
    })
);

export const handler: Handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "",
        };
    } else if (event.body) {
        const data = JSON.parse(event.body);
        if (data.email !== "demo@traininblocks.com") {
            try {
                const oktaOne = await axios.get(
                    `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/users/?filter=profile.email+eq+"${data.email}"&limit=1`,
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: process.env.OKTA_AUTH_KEY,
                        },
                    }
                );
                if (oktaOne.data.length > 0) {
                    const id = oktaOne.data[0].id;
                    const oktaTwo = await axios.post(
                        `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/users/${id}/lifecycle/reset_password?sendEmail=false`,
                        {},
                        {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: process.env.OKTA_AUTH_KEY,
                            },
                        }
                    );
                    // options
                    const LINK = oktaTwo.data.resetPasswordUrl.replace(
                        CUSTOM_ENV.OKTA.ISSUER,
                        "https://auth.traininblocks.com"
                    );
                    const mailOptions = {
                        from: "Train In Blocks <hello@traininblocks.com>",
                        to: data.email,
                        ...emailBuilder("password-reset", { link: LINK }),
                    };
                    await transporter.sendMail(mailOptions);
                    return {
                        statusCode: 200,
                        headers,
                        body: "Email sent successfully",
                    };
                } else {
                    return {
                        statusCode: 500,
                        headers,
                        body: 'That email doesn\'t appear to be associated with an account.',
                    };
                }
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
