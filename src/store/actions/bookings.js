const emailBuilder = require("../../components/js/email");

export default {
    /** Creates a new booking. */
    async createBooking(
        { commit, state },
        { clientId, datetime, notes, status, isTrainer }
    ) {
        const RESPONSE = await this._vm.$axios.post(
            "https://api.traininblocks.com/v2/bookings",
            {
                client_id: clientId,
                datetime,
                notes,
                status,
                isTrainer,
            }
        );

        if (!isTrainer) {
            const PT_EMAIL = await this._vm.$axios.post(
                "/.netlify/functions/okta",
                {
                    type: "GET",
                    url: `?filter=id+eq+"${state.portfolio.pt_id}"&limit=1`,
                }
            );
            await this._vm.$axios.post("/.netlify/functions/send-email", {
                to: PT_EMAIL.data[0].credentials.emails[0].value,
                ...emailBuilder("booking-requested", {
                    clientName: state.clientUser.name,
                    datetime: datetime,
                    link: `https://app.traininblocks.com/client/${clientId}`,
                }),
            });
        } else {
            await this._vm.$axios.post("/.netlify/functions/send-email", {
                to: state.clients.find(
                    (client) => client.client_id === parseInt(clientId)
                ).email,
                ...emailBuilder("booking-created", {
                    datetime: datetime,
                }),
            });
        }
        commit(isTrainer ? "addNewBooking" : "addNewBookingClientSide", {
            id: RESPONSE.data[0]["LAST_INSERT_ID()"],
            client_id: clientId,
            datetime,
            notes,
            status,
            isTrainer,
        });
    },

    /** Updates a booking. */
    async updateBooking({ commit, state }, { bookingId, clientId, status }) {
        await this._vm.$axios.put("https://api.traininblocks.com/v2/bookings", {
            id: bookingId,
            client_id: clientId,
            status,
        });
        await this._vm.$axios.post("/.netlify/functions/send-email", {
            to: state.clients.find(
                (client) => client.client_id === parseInt(clientId)
            ).email,
            ...emailBuilder("booking-accepted", {
                datetime: state.bookings.find(
                    (booking) => booking.id === bookingId
                ).datetime,
            }),
        });
        commit("updateBooking", {
            id: bookingId,
            client_id: clientId,
            status,
        });
    },

    /** Deletes a booking. */
    async deleteBooking(
        { commit, state },
        { clientId, bookingId, datetime, isTrainer }
    ) {
        await this._vm.$axios.delete(
            `https://api.traininblocks.com/v2/bookings/${bookingId}`
        );
        if (!isTrainer) {
            const PT_EMAIL = await this._vm.$axios.post(
                "/.netlify/functions/okta",
                {
                    type: "GET",
                    url: `?filter=id+eq+"${state.portfolio.pt_id}"&limit=1`,
                }
            );
            await this._vm.$axios.post("/.netlify/functions/send-email", {
                to: PT_EMAIL.data[0].credentials.emails[0].value,
                ...emailBuilder("booking-request-cancelled", {
                    clientName: state.clientUser.name,
                    datetime: datetime,
                    link: `https://app.traininblocks.com/client/${clientId}`,
                }),
            });
        } else if (
            new Date(
                state.bookings.find(
                    (booking) => booking.id === bookingId
                ).datetime
            ) > new Date()
        ) {
            await this._vm.$axios.post("/.netlify/functions/send-email", {
                to: state.clients.find(
                    (client) => client.client_id === parseInt(clientId)
                ).email,
                ...emailBuilder("booking-rejected", {
                    datetime: state.bookings.find(
                        (booking) => booking.id === bookingId
                    ).datetime,
                }),
            });
        }
        commit(`removeBooking${isTrainer ? "" : "ClientSide"}`, bookingId);
    },
};
