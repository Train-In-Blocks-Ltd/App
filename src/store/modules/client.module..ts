import store from "..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Client, Plan, Session } from "./types";
import clientsModule from "./clients.module";
import utilsModule from "./utils.module";
import { baseAPI } from "../../api";

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
        const clientDetails = clientsModule.clients.find(
            (c) => c.client_id === id
        );

        return {
            clientDetails,
        };
    }

    @MutationAction
    async addPlan(plan: Plan) {
        const clientDetails = this.clientDetails;
        clientDetails?.plans?.push(plan);
        return {
            clientDetails,
        };
    }

    @MutationAction
    async createPlan({
        client_id,
        name,
        duration,
    }: {
        client_id: number;
        name: string;
        duration: number;
    }) {
        const block_color = JSON.stringify(new Array(duration).fill("#999999"));
        const response = await baseAPI.post(
            "https://api.traininblocks.com/v2/plans",
            {
                name,
                client_id,
                duration,
                block_color,
            }
        );

        const clientDetails = this.clientDetails;
        if (!clientDetails) return;
        clientDetails.plans = [
            ...(clientDetails.plans ?? []),
            {
                id: response.data[0]["LAST_INSERT_ID()"] as number,
                name,
                client_id,
                duration,
                block_color,
                notes: "",
                sessions: [],
            },
        ];

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

            const clientDetails = {
                ...this.clientDetails,
                plans: (response.data[0] as Plan[]).map((p) => {
                    return {
                        ...p,
                        sessions: (response.data[1] as Session[])
                            .filter((s) => s.programme_id === p.id)
                            .sort(
                                (a, b) =>
                                    new Date(a.date).getTime() -
                                    new Date(b.date).getTime()
                            ),
                    };
                }),
            } as Client;

            return {
                clientDetails,
            };
        } catch (e) {
            return utilsModule.resolveError(e as string);
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
            utilsModule.resolveError(e as string);
        }
    }

    @MutationAction
    async deletePlan(id: number) {
        await baseAPI.delete(`https://api.traininblocks.com/v2/plans/${id}`);

        const clientDetails = this.clientDetails;
        if (!clientDetails) return;
        clientDetails.plans = clientDetails.plans?.filter((p) => p.id !== id);
        return {
            clientDetails,
        };
    }
}

export default getModule(ClientModule);
