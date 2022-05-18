import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Client, Plan, Session } from "../types";
import clientsStore from "../clients";
import utilsStore from "../utils";
import { baseAPI } from "../../../api";

@Module({
    name: "client",
    store,
    dynamic: true,
})
class ClientModule extends VuexModule {
    clientDetails: Client | null = null;

    @MutationAction
    async setClientDetails(clientDetails: Client | null) {
        return {
            clientDetails,
        };
    }

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
    async getPlans(id: number) {
        try {
            const response = await baseAPI.get(
                `https://api.traininblocks.com/v2/plans/${id}`
            );

            console.log(response.data);
            const clientDetails = {
                ...this.clientDetails,
                plans: response.data[0].map((p: Plan) => {
                    return {
                        ...p,
                        sessions: response.data[1].filter(
                            (s: Session) => s.programme_id === p.id
                        ),
                    };
                }),
            } as Client;

            return {
                clientDetails,
            };
        } catch (e) {
            return utilsStore.resolveError(e as string);
        }
    }

    @MutationAction
    async updateClient() {
        try {
            if (!this.clientDetails) return;
            const { client_id } = this.clientDetails;
            await baseAPI.put("https://api.traininblocks.com/v2/clients", {
                ...this.clientDetails,
                id: client_id,
            });

            return {};
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }
}

export default getModule(ClientModule);
