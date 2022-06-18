import axios from "axios";
import { Handler, schedule } from "@netlify/functions";
import { Client } from "src/common/types";
import { emailBuilder } from "src/common/helpers/email";
const smtpTransport = require("nodemailer-smtp-transport");
const nodemailer = require("nodemailer");

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("./helpers/prod.env")
        : require("./helpers/dev.env");

const authHeader = process.env.OKTA_AUTH_KEY;

const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp-relay.gmail.com',
    secure: true,
    auth: {
        user: process.env.GOOGLE_WORKSPACE_USERNAME,
        pass: process.env.GOOGLE_WORKSPACE_PASSWORD
    }
}))

const thisWeek = new Date(new Date().setDate(new Date().getDate() - 7));
const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7));

const breakdownHandler: Handler = async () => {
    try {
        // Search okta users for active trainers
        const PTs = await axios.get(
            `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/groups/00gf92ryyjhkuM5ua4x6/users`,
            // `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/groups/00gf92iyuemKhsTcV4x6/users`,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: authHeader,
                },
            }
        );

        // Loop through Personal Trainer users
        for (const PT in PTs.data) {
            // If the PT is active (and they've opted in to weekly breakdown emails)
            if (
                PTs.data[PT].status === "ACTIVE" &&
                PTs.data[PT].profile.weeklyBreakdown !== false
            ) {
                const ptData = await axios.get(
                    `https://api.traininblocks.com/v2/${PTs.data[PT].id}`,
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: process.env.TIB_API,
                        },
                    }
                );

                // Sort out the PT's data into each category
                const clients = ptData.data[0];
                const archivedClients = ptData.data[1];
                const templates = ptData.data[2];
                const bookings = ptData.data[4];

                // Set the variables that we're reporting back to the user
                let clientsUpdatedThisWeek = 0;
                let clientsCreatedThisWeek = 0;
                let clientsArchivedThisWeek = 0;
                let templatesUpdatedThisWeek = 0;
                let templatesCreatedThisWeek = 0;
                let plansUpdatedThisWeek = 0;
                let plansCreatedThisWeek = 0;
                let sessionsUpdatedThisWeek = 0;
                let sessionsCreatedThisWeek = 0;
                let upcomingBookings = 0;

                // Loop through clients
                for (const client in clients) {
                    if (new Date(clients[client].created_at) >= thisWeek) {
                        clientsCreatedThisWeek++;
                    } else if (
                        new Date(clients[client].updated_at) >= thisWeek
                    ) {
                        clientsUpdatedThisWeek++;
                    }
                    const plansData = await axios.get(
                        `https://api.traininblocks.com/v2/plans/${clients[client].client_id}`,
                        {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: process.env.TIB_API,
                            },
                        }
                    );
                    const plans = plansData.data[0];
                    const sessions = plansData.data[1];
                    for (const plan in plans) {
                        if (new Date(plans[plan].created_at) >= thisWeek) {
                            plansCreatedThisWeek++;
                        } else if (
                            new Date(plans[plan].updated_at) >= thisWeek
                        ) {
                            plansUpdatedThisWeek++;
                        }
                    }
                    for (const session in sessions) {
                        if (
                            new Date(sessions[session].created_at) >= thisWeek
                        ) {
                            sessionsCreatedThisWeek++;
                        } else if (
                            new Date(sessions[session].updated_at) >= thisWeek
                        ) {
                            sessionsUpdatedThisWeek++;
                        }
                    }
                }

                // Loop through archivedClients
                for (const client in archivedClients) {
                    if (
                        new Date(archivedClients[client].updated_at) >= thisWeek
                    ) {
                        clientsArchivedThisWeek++;
                    }
                }

                // Loop through templates
                for (const template in templates) {
                    if (new Date(templates[template].created_at) >= thisWeek) {
                        templatesCreatedThisWeek++;
                    } else if (
                        new Date(templates[template].updated_at) >= thisWeek
                    ) {
                        templatesUpdatedThisWeek++;
                    }
                }

                // Loop through bookings
                for (const booking in bookings) {
                    // If the client was created this week
                    if (
                        new Date(bookings[booking].datetime) <= nextWeek &&
                        new Date(bookings[booking].datetime) >= new Date()
                    ) {
                        upcomingBookings++;
                    }
                }

                let body = "";

                if (clientsCreatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You created ${clientsCreatedThisWeek} client.</p>`;
                }
                if (clientsUpdatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You updated ${clientsUpdatedThisWeek} client.</p>`;
                }
                if (clientsArchivedThisWeek === 1) {
                    body =
                        body +
                        `<p>You archived ${clientsArchivedThisWeek} client.</p>`;
                }
                if (templatesCreatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You created ${templatesCreatedThisWeek} template.</p>`;
                }
                if (templatesUpdatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You updated ${templatesUpdatedThisWeek} template.</p>`;
                }
                if (plansCreatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You created ${plansCreatedThisWeek} plan.</p>`;
                }
                if (plansUpdatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You updated ${plansUpdatedThisWeek} plan.</p>`;
                }
                if (sessionsCreatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You created ${sessionsCreatedThisWeek} session.</p>`;
                }
                if (sessionsUpdatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You updated ${sessionsUpdatedThisWeek} session.</p>`;
                }
                if (upcomingBookings === 1) {
                    body =
                        body +
                        `<p>Keep up the great work!</p><h2>Let us help kickstart your week</h2><p>You have ${upcomingBookings} upcoming booking.</p>`;
                }
                if (clientsCreatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You created ${clientsCreatedThisWeek} clients.</p>`;
                }
                if (clientsUpdatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You updated ${clientsUpdatedThisWeek} clients.</p>`;
                }
                if (clientsArchivedThisWeek > 1) {
                    body =
                        body +
                        `<p>You archived ${clientsArchivedThisWeek} clients.</p>`;
                }
                if (templatesCreatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You created ${templatesCreatedThisWeek} templates.</p>`;
                }
                if (templatesUpdatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You updated ${templatesUpdatedThisWeek} templates.</p>`;
                }
                if (plansCreatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You created ${plansCreatedThisWeek} plans.</p>`;
                }
                if (plansUpdatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You updated ${plansUpdatedThisWeek} plans.</p>`;
                }
                if (sessionsCreatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You created ${sessionsCreatedThisWeek} sessions.</p>`;
                }
                if (sessionsUpdatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You updated ${sessionsUpdatedThisWeek} sessions.</p>`;
                }
                if (upcomingBookings > 1) {
                    body =
                        body +
                        `<p>Keep up the great work!</p><h2>Let us help kickstart your week</h2><p>You have ${upcomingBookings} upcoming bookings.</p>`;
                }
                if (body !== "") {
                    // Send an email to the PT
                    const mailOptions = {
                        from: "Train In Blocks <hello@traininblocks.com>",
                        to: "joe@joebailey.xyz", //PTs.data[PT].email
                        ...emailBuilder("weekly-breakdown", { body }),
                    };
                    await transporter.sendMail(mailOptions);
                }
            }
        }
        return {
            statusCode: 200,
        };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
        };
    }
};

export const handler = schedule("0 12 * * 1", breakdownHandler);
