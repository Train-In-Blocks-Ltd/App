import axios from "axios";
import { Handler, schedule } from "@netlify/functions";
import { Client } from "src/common/types";

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("./helpers/prod.env")
        : require("./helpers/dev.env");

const authHeader = CUSTOM_ENV.OKTA.AUTH_KEY;
const headers = require("././helpers/headers");

const breakdownHandler: Handler = async () => {
    // Search okta users for active trainers
    const oktaResponse = await axios.get(
        `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/users?search=profile.user_type+eq+"Trainer"+and+status+eq+"ACTIVE"`,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
        }
    );

    const trainerIds: string[] = oktaResponse.data.map(
        (t: { id: string }) => t.id
    );

    // Go through each active trainer and send emails to them
    trainerIds.forEach(async (id) => {
        const trainerResponse = await axios.get(
            `https://api.traininblocks.com/v2/${id}`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: CUSTOM_ENV.TIB_API,
                },
            }
        );

        // TODO: Filter through and get last week's bookings

        const clientIds: number[] = trainerResponse.data[0].map(
            (c: Client) => c.client_id
        );

        clientIds.forEach(async (id) => {
            const clientResponse = await axios.get(
                `https://api.traininblocks.com/v2/plans/${id}`,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: CUSTOM_ENV.TIB_API,
                    },
                }
            );

            console.log(clientResponse);

            // TODO: Filter through and get last week's CREATED sessions
            // TODO: Filter through and get last week's UPDATED sessions
        });
    });

    // TODO: Need to remove this response after it's finished as we don't need to call this on the front.
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(oktaResponse.data),
    };
};

export const handler = schedule("@weekly", breakdownHandler);
