import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Booking } from "../types";
import { baseAPI } from "../../../api";
import portfolioStore from "../portfolio";
import clientUserStore from "../clientUser";
import clientsStore from "../clients";
import emailBuilder from "../../../components/js/email";

@Module({
    name: "bookings",
    store,
    dynamic: true,
})
class BookingsModule extends VuexModule {
    public bookings: Booking[] = [];

    @MutationAction
    async setBookings(bookings: Booking[]) {
        return {
            bookings,
        };
    }

    @MutationAction
    async createBooking(
        {
            client_id,
            datetime,
            notes,
            status,
        }: Pick<Booking, "client_id" | "datetime" | "notes" | "status">,
        isTrainer?: boolean
    ) {
        const response = await baseAPI.post(
            "https://api.traininblocks.com/v2/bookings",
            {
                client_id,
                datetime,
                notes,
                status,
                isTrainer,
            }
        );

        if (!isTrainer) {
            const PT_EMAIL = await baseAPI.post("/.netlify/functions/okta", {
                type: "GET",
                url: `?filter=id+eq+"${portfolioStore.pt_id}"&limit=1`,
            });
            await baseAPI.post("/.netlify/functions/send-email", {
                to: PT_EMAIL.data[0].credentials.emails[0].value,
                ...emailBuilder("booking-requested", {
                    clientName: clientUserStore.clientUser.name,
                    datetime: datetime,
                    link: `https://app.traininblocks.com/client/${client_id}`,
                }),
            });
        } else {
            await baseAPI.post("/.netlify/functions/send-email", {
                to: clientsStore.clients.find(
                    (client) => client.client_id === client_id
                )?.email,
                ...emailBuilder("booking-created", {
                    datetime: datetime,
                }),
            });
        }

        const bookings: Booking[] = [
            ...this.bookings,
            {
                id: response.data[0]["LAST_INSERT_ID()"],
                client_id,
                datetime,
                notes,
                status,
            },
        ];
        return {
            bookings,
        };
    }

    @MutationAction
    async updateBooking({
        id,
        client_id,
        status,
    }: Pick<Booking, "id" | "client_id" | "status">) {
        await baseAPI.put("https://api.traininblocks.com/v2/bookings", {
            id,
            client_id,
            status,
        });
        await baseAPI.post("/.netlify/functions/send-email", {
            to: clientsStore.clients.find(
                (client) => client.client_id === client_id
            )?.email,
            ...emailBuilder("booking-accepted", {
                datetime: this.bookings.find((booking) => booking.id === id)
                    ?.datetime,
            }),
        });

        const bookings: Booking[] = this.bookings.map((b) =>
            b.id !== id
                ? b
                : {
                      id: b.id,
                      client_id,
                      datetime: b.datetime,
                      notes: b.notes,
                      status,
                  }
        );
        return {
            bookings,
        };
    }

    @MutationAction
    async deleteBooking(
        {
            id,
            client_id,
            datetime,
        }: Pick<Booking, "client_id" | "id" | "datetime">,
        isTrainer?: boolean
    ) {
        await baseAPI.delete(`https://api.traininblocks.com/v2/bookings/${id}`);
        if (!isTrainer) {
            const PT_EMAIL = await baseAPI.post("/.netlify/functions/okta", {
                type: "GET",
                url: `?filter=id+eq+"${portfolioStore.pt_id}"&limit=1`,
            });
            await baseAPI.post("/.netlify/functions/send-email", {
                to: PT_EMAIL.data[0].credentials.emails[0].value,
                ...emailBuilder("booking-request-cancelled", {
                    clientName: clientUserStore.clientUser.name,
                    datetime: datetime,
                    link: `https://app.traininblocks.com/client/${client_id}`,
                }),
            });
        } else if (
            new Date(
                this.bookings.find((booking) => booking.id === id)?.datetime ??
                    ""
            ) > new Date()
        ) {
            await baseAPI.post("/.netlify/functions/send-email", {
                to: clientsStore.clients.find(
                    (client) => client.client_id === client_id
                )?.email,
                ...emailBuilder("booking-rejected", {
                    datetime: this.bookings.find((booking) => booking.id === id)
                        ?.datetime,
                }),
            });
        }

        const bookings: Booking[] = this.bookings.filter((b) => b.id !== id);
        return {
            bookings,
        };
    }
}

export default getModule(BookingsModule);
