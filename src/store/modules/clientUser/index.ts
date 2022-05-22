import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Booking, Plan, Portfolio, Session } from "../types";
import { baseAPI, ClientUserData } from "../../../api";
import emailBuilder from "../../../components/js/email";
import accountModule from "../account.module";

@Module({
    name: "clientUser",
    store,
    dynamic: true,
})
class ClientUserModule extends VuexModule {
    name: string = "";
    number: string = "";
    profile_image: string = "";
    pt_id: string = "";
    portfolio: Portfolio | null = null;
    plans: Plan[] = [];
    bookings: Booking[] = [];

    @MutationAction
    async setClientUser(data: ClientUserData) {
        return data;
    }

    @MutationAction
    async setPlans(plans: Plan[]) {
        return {
            plans,
        };
    }

    @MutationAction
    async setProfileImage(profile_image: string) {
        return {
            profile_image,
        };
    }

    @MutationAction
    async setName(name: string) {
        return {
            name,
        };
    }

    @MutationAction
    async setNumber(number: string) {
        return {
            number,
        };
    }

    @MutationAction
    async setBookings(bookings: Booking[]) {
        return {
            bookings,
        };
    }

    @MutationAction
    async updateSession(updatedSession: Session) {
        const { id, name, checked, feedback, programme_id } = updatedSession;
        await baseAPI.put("https://api.traininblocks.com/v2/client-sessions", {
            id,
            name,
            checked,
            feedback,
        });

        // @ts-expect-error
        if (this.portfolio?.notifications === 1) {
            if (feedback !== null) {
                const PT_EMAIL = await baseAPI.post(
                    "/.netlify/functions/okta",
                    {
                        type: "GET",
                        url: `?filter=id+eq+"${this.portfolio.pt_id}"&limit=1`,
                    }
                );
                await baseAPI.post("/.netlify/functions/send-email", {
                    to: PT_EMAIL.data[0].credentials.emails[0].value,
                    ...emailBuilder("client-feedback", {
                        cId: accountModule.claims?.client_id_db,
                        pId: programme_id,
                    }),
                });
            }
        }

        const plans: Plan[] = this.plans.map((p) =>
            p.id !== programme_id
                ? p
                : {
                      ...p,
                      sessions: p.sessions?.map((s) =>
                          s.id !== id ? s : updatedSession
                      ),
                  }
        );
        return {
            plans,
        };
    }

    @MutationAction
    async updateClientUser() {
        const { name, number, profile_image } = this;
        await baseAPI.put(
            "https://api.traininblocks.com/v2/clientUser/clients",
            {
                client_id: accountModule.claims?.client_id_db,
                name,
                number,
                profile_image,
            }
        );

        return {};
    }

    @MutationAction
    async createClientBooking({
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
            }
        );

        const PT_EMAIL = await baseAPI.post("/.netlify/functions/okta", {
            type: "GET",
            url: `?filter=id+eq+"${this.pt_id}"&limit=1`,
        });
        await baseAPI.post("/.netlify/functions/send-email", {
            to: PT_EMAIL.data[0].credentials.emails[0].value,
            ...emailBuilder("booking-requested", {
                clientName: this.name,
                datetime: datetime,
                link: `https://app.traininblocks.com/client/${client_id}`,
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
    async deleteClientBooking({
        id,
        client_id,
        datetime,
    }: Pick<Booking, "client_id" | "id" | "datetime">) {
        await baseAPI.delete(`https://api.traininblocks.com/v2/bookings/${id}`);
        const PT_EMAIL = await baseAPI.post("/.netlify/functions/okta", {
            type: "GET",
            url: `?filter=id+eq+"${this.pt_id}"&limit=1`,
        });
        await baseAPI.post("/.netlify/functions/send-email", {
            to: PT_EMAIL.data[0].credentials.emails[0].value,
            ...emailBuilder("booking-request-cancelled", {
                clientName: this.name,
                datetime: datetime,
                link: `https://app.traininblocks.com/client/${client_id}`,
            }),
        });

        const bookings: Booking[] = this.bookings.filter((b) => b.id !== id);
        return {
            bookings,
        };
    }
}

export default getModule(ClientUserModule);
