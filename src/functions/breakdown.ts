import axios from "axios";
import { Handler, schedule } from "@netlify/functions";
import { Booking, Client, Plan, Session, Template } from "src/common/types";
import { emailBuilder } from "src/common/helpers/email";
const smtpTransport = require("nodemailer-smtp-transport");
const nodemailer = require("nodemailer");

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("../../config/prod.env")
        : require("../../config/dev.env");

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
            process.env.NODE_ENV === "production"
                ? `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/groups/00gf92iyuemKhsTcV4x6/users`
                : `${CUSTOM_ENV.OKTA.ISSUER}/api/v1/groups/00gf92ryyjhkuM5ua4x6/users`,
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
                (PTs.data[PT].profile.weeklyBreakdown === true || PTs.data[PT].profile.weeklyBreakdown === undefined)
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
                const clients: Client[] = ptData.data[0];
                const archivedClients: Client[] = ptData.data[1];
                const templates: Template[] = ptData.data[2];
                const bookings: Booking[] = ptData.data[4];

                let clientsUpdatedThisWeek = 0;
                let clientsCreatedThisWeek = 0;

                let templatesUpdatedThisWeek = 0;
                let templatesCreatedThisWeek = 0;

                let plansUpdatedThisWeek = 0;
                let plansCreatedThisWeek = 0;

                let sessionsUpdatedThisWeek = 0;
                let sessionsCreatedThisWeek = 0;

                let bookingsUpdatedThisWeek = 0;
                let bookingsCreatedThisWeek = 0;

                // Loop through clients
                for (const client of clients) {
                    if (client.created_at && client.updated_at) {
                        if (new Date(client.created_at) >= thisWeek) {
                            clientsCreatedThisWeek++;
                        } else if (new Date(client.updated_at) >= thisWeek) {
                            clientsUpdatedThisWeek++;
                        }
                    }

                    const plansData = await axios.get(
                        `https://api.traininblocks.com/v2/plans/${client.client_id}`,
                        {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: process.env.TIB_API,
                            },
                        }
                    );
                    const plans: Plan[] = plansData.data[0];
                    const sessions: Session[] = plansData.data[1];

                    // Count plans created/updated
                    for (const plan of plans) {
                        if (!plan.created_at || !plan.updated_at) continue;

                        if (new Date(plan.created_at) >= thisWeek) {
                            plansCreatedThisWeek++;
                        } else if (new Date(plan.updated_at) >= thisWeek) {
                            plansUpdatedThisWeek++;
                        }
                    }

                    // Count sessions created/updated
                    for (const session of sessions) {
                        if (!session.created_at || !session.updated_at)
                            continue;

                        if (new Date(session.created_at) >= thisWeek) {
                            sessionsCreatedThisWeek++;
                        } else if (new Date(session.updated_at) >= thisWeek) {
                            sessionsUpdatedThisWeek++;
                        }
                    }

                    // Count bookings created/updated
                    for (const booking of bookings) {
                        if (!booking.created_at || !booking.updated_at)
                            continue;

                        if (new Date(booking.created_at) >= thisWeek) {
                            bookingsCreatedThisWeek++;
                        } else if (new Date(booking.updated_at) >= thisWeek) {
                            bookingsUpdatedThisWeek++;
                        }
                    }
                }

                // Count clients archived
                const clientsArchivedThisWeek = archivedClients.filter((c) => {
                    if (!c.updated_at) return false;
                    return new Date(c.updated_at) >= thisWeek;
                }).length;

                // Count templates created/updated
                for (const template of templates) {
                    if (!template.created_at || !template.updated_at) continue;

                    if (new Date(template.created_at) >= thisWeek) {
                        templatesCreatedThisWeek++;
                    } else if (new Date(template.updated_at) >= thisWeek) {
                        templatesUpdatedThisWeek++;
                    }
                }

                // Count upcoming bookings
                const upcomingBookings = bookings.filter(
                    (b) =>
                        new Date(b.datetime) <= nextWeek &&
                        new Date(b.datetime) >= new Date()
                ).length;

                let body = "";

                if (clientsCreatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You created ${clientsCreatedThisWeek} client.</p>`;
                } else if (clientsCreatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You created ${clientsCreatedThisWeek} clients.</p>`;
                }
                if (clientsUpdatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You updated ${clientsUpdatedThisWeek} client.</p>`;
                }
                else if (clientsUpdatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You updated ${clientsUpdatedThisWeek} clients.</p>`;
                }
                if (clientsArchivedThisWeek === 1) {
                    body =
                        body +
                        `<p>You archived ${clientsArchivedThisWeek} client.</p>`;
                } else if (clientsArchivedThisWeek > 1) {
                    body =
                        body +
                        `<p>You archived ${clientsArchivedThisWeek} clients.</p>`;
                }
                if (templatesCreatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You created ${templatesCreatedThisWeek} template.</p>`;
                } else if (templatesCreatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You created ${templatesCreatedThisWeek} templates.</p>`;
                }
                if (templatesUpdatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You updated ${templatesUpdatedThisWeek} template.</p>`;
                } else if (templatesUpdatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You updated ${templatesUpdatedThisWeek} templates.</p>`;
                }
                if (plansCreatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You created ${plansCreatedThisWeek} plan.</p>`;
                } else if (plansCreatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You created ${plansCreatedThisWeek} plans.</p>`;
                }
                if (plansUpdatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You updated ${plansUpdatedThisWeek} plan.</p>`;
                } else if (plansUpdatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You updated ${plansUpdatedThisWeek} plans.</p>`;
                }
                if (sessionsCreatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You created ${sessionsCreatedThisWeek} session.</p>`;
                } else if (sessionsCreatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You created ${sessionsCreatedThisWeek} sessions.</p>`;
                }
                if (sessionsUpdatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You updated ${sessionsUpdatedThisWeek} session.</p>`;
                } else if (sessionsUpdatedThisWeek > 1) {
                    body =
                        body +
                        `<p>You updated ${sessionsUpdatedThisWeek} sessions.</p>`;
                }
                if (bookingsCreatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You created ${bookingsCreatedThisWeek} booking.</p>`;
                } else if (bookingsCreatedThisWeek > 1) {
                    body =
                        body +
                    `<p>You created ${bookingsCreatedThisWeek} bookings.</p>`;
                }
                if (bookingsUpdatedThisWeek === 1) {
                    body =
                        body +
                        `<p>You updated ${bookingsUpdatedThisWeek} bookings.</p>`;
                } else if (bookingsUpdatedThisWeek > 1) {
                    body =
                        body +
                    `<p>You updated ${bookingsUpdatedThisWeek} bookings.</p>`;
                }
                if (body !== "") {
                    if (upcomingBookings === 1) {
                        body =
                            body +
                            `<p>Keep up the great work!</p><h2>Let us help kickstart your week</h2><p>You have ${upcomingBookings} upcoming booking.</p>`;
                    } else if (upcomingBookings > 1) {
                        body =
                            body +
                            `<p>Keep up the great work!</p><h2>Let us help kickstart your week</h2><p>You have ${upcomingBookings} upcoming bookings.</p>`;
                    }
                    // Send an email to the PT
                    const mailOptions = {
                        from: "Train In Blocks <hello@traininblocks.com>",
                        to: process.env.NODE_ENV === "production"
                            ? PTs.data[PT].email
                            : "joe@joebailey.xyz",
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
