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
import accountStore from "../account";

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

    /** Updates a client-user's session. */
    async updateSession({
        id,
        name,
        checked,
        feedback,
        programme_id,
    }: Session) {
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
                        cId: accountStore.claims?.client_id_db,
                        pId: programme_id,
                    }),
                });
            }
        }
    }
}

export default getModule(ClientUserModule);
