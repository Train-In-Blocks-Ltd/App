import store from ".";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Booking } from "../common/types";
import { baseAPI } from "../api";
import portfolioModule from "./portfolio.module";
import clientUserModule from "./clientUser.module";
import clientsModule from "./clients.module";
import emailBuilder from "../components/js/email";

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
    async createTrainerBooking({
        client_id,
        datetime,
        notes,
        status,
    }: Pick<Booking, "client_id" | "datetime" | "notes" | "status">) {
        const response = await baseAPI.post(
            "https://api.traininblocks.com/v2/bookings",
            {
                client_id,
                datetime,
                notes,
                status,
                isTrainer: true,
            }
        );

        await baseAPI.post("/.netlify/functions/send-email", {
            to: clientsModule.clients.find(
                (client) => client.client_id === client_id
            )?.email,
            ...emailBuilder("booking-created", {
                datetime: datetime,
            }),
        });

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
            to: clientsModule.clients.find(
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
    async deleteTrainerBooking({
        id,
        client_id,
        datetime,
    }: Pick<Booking, "client_id" | "id" | "datetime">) {
        await baseAPI.delete(`https://api.traininblocks.com/v2/bookings/${id}`);
        if (new Date(datetime) > new Date()) {
            await baseAPI.post("/.netlify/functions/send-email", {
                to: clientsModule.clients.find(
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
