import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Client, Plan, Session } from "../types";
import clientsStore from "../clients";
import { baseAPI } from "../../../api";

@Module({
    name: "client",
    store,
    dynamic: true,
})
class ClientModule extends VuexModule {
    clientDetails: Client | null = null;

    @MutationAction
    async setCurrentClient(id: number) {
        const clientDetails = clientsStore.clients.find(
            (c) => c.client_id === id
        );

        return {
            clientDetails,
        };
    }

    @MutationAction
    async setClientPlans(plans: Plan[]) {
        return {
            clientDetails: {
                ...this.clientDetails,
                plans,
            } as Client,
        };
    }

    @MutationAction
    async setClientSessions(sessions: Session[]) {
        return {
            clientDetails: {
                plans: this.clientDetails?.plans?.map((p) => {
                    return {
                        ...p,
                        sessions: sessions.filter((s) => s.plan_id === p.id),
                    };
                }),
            } as Client,
        };
    }

    @MutationAction
    async getPlans(id: number) {
        if (!this.clientDetails) return;
        const { plans, client_id } = this.clientDetails;
        if (!plans) {
            const response = await baseAPI.get(
                `https://api.traininblocks.com/v2/plans/${client_id}`
            );

            this.setClientPlans(response.data[0]);
            this.setClientSessions(response.data[1]);
        }

        return {};
    }
}

export default getModule(ClientModule);
