import axios from "axios";
import { Handler } from "@netlify/functions";
import { ics } from "../common/helpers";
import { Client } from "../common/types";

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("./helpers/prod.env")
        : require("./helpers/dev.env");

const authHeader = CUSTOM_ENV.OKTA.AUTH_KEY;
const headers = require("././helpers/headers");

// @ts-expect-error
export const handler: Handler = async (event) => {
    // If options request return 200
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "",
        };
        // if email in query string
    } else if (event.queryStringParameters?.email) {
        try {
            // Search okta for email
            const response = await axios.get(
                `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/users/?filter=profile.email+eq+"${event.queryStringParameters.email}"&limit=1`,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: authHeader,
                    },
                }
            );
            // if email found in okta then get events from db
            if (response.data.length > 0) {
                // if calendar enabled in settings
                if (response.data[0].profile.calendar === true) {
                    // create calendar
                    const cal = ics();
                    // update headers to include content-type calendar
                    headers["Content-Type"] = "text/calendar";
                    // If client user
                    if (response.data[0].profile.user_type === "Client") {
                        const data = await axios.get(
                            `https://api.traininblocks.com/v2/clientUser/${response.data[0].profile.client_id_db}`,
                            {
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    Authorization: CUSTOM_ENV.TIB_API,
                                },
                            }
                        );
                        // add calendar events for bookings
                        if (data.data[3].length > 0) {
                            for (const booking of data.data[3]) {
                                let date;
                                date = new Date(booking.datetime);
                                date = new Date(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate()
                                );
                                cal.addEvent(
                                    "Train In Blocks Meeting",
                                    booking.notes,
                                    "",
                                    date,
                                    date
                                );
                            }
                        } else {
                            return {
                                statusCode: 200,
                                headers,
                                body: "No Bookings",
                            };
                        }
                    } else {
                        const data = await axios.get(
                            `https://api.traininblocks.com/v2/${response.data[0].id}`,
                            {
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    Authorization: CUSTOM_ENV.TIB_API,
                                },
                            }
                        );
                        // add calendar events for bookings
                        if (data.data[4].length > 0) {
                            for (const booking of data.data[4]) {
                                let date;
                                date = new Date(booking.datetime);
                                date = new Date(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate()
                                );
                                cal.addEvent(
                                    "Train In Blocks Meeting with" +
                                        data.data[0].find(
                                            (client: Client) =>
                                                client.client_id ===
                                                booking.client_id
                                        ).name,
                                    booking.notes,
                                    "",
                                    date,
                                    date
                                );
                            }
                        } else {
                            return {
                                statusCode: 200,
                                headers,
                                body: "No Bookings",
                            };
                        }
                    }
                    // return calendar
                    return {
                        statusCode: 200,
                        headers,
                        body: cal.build(),
                    };
                    // if calendar not enabled return 401
                } else {
                    return {
                        statusCode: 401,
                        headers,
                        body: "Not Authorized - Please enable calendar in user settings",
                    };
                }
                // if calendar not enabled return 401
            } else {
                return {
                    statusCode: 401,
                    headers,
                    body: "Not Authorized - Email not found",
                };
            }
            // return 500 on error
        } catch (e) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify(e),
            };
        }
        // return 400 on missing query paramters
    } else {
        return {
            statusCode: 400,
            headers,
            body: "Missing Email Paramter",
        };
    }
};
