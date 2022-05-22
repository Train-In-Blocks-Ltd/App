import { baseAPI } from "../../api";
const emailBuilder = require("../../components/js/email");
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import store from "..";
import { Client, Plan, Session } from "./types";
import utilsModule from "./utils.module";

@Module({
    name: "clients",
    store,
    dynamic: true,
})
class ClientsModule extends VuexModule {
    clients: Client[] = [];
    archivedClients: Client[] = [];

    @MutationAction
    async setClients(clients: Client[]) {
        return {
            clients,
        };
    }

    @MutationAction
    async setArchivedClients(archivedClients: Client[]) {
        return {
            archivedClients,
        };
    }

    @MutationAction
    async archiveClient(id: number, email: string) {
        try {
            await baseAPI.put(
                `https://api.traininblocks.com/v2/clients/archive/${id}`
            );
            const response = await baseAPI.post("/.netlify/functions/okta", {
                type: "GET",
                url: `?filter=profile.email+eq+"${email}"&limit=1`,
            });
            if (response.data.length >= 1) {
                await baseAPI.post("/.netlify/functions/okta", {
                    type: "POST",
                    body: {},
                    url: `${response.data[0].id}/lifecycle/suspend`,
                });
                await baseAPI.post("/.netlify/functions/send-email", {
                    to: email,
                    ...emailBuilder("client-account-deactivated"),
                });
            }

            const clients = this.clients.filter((c) => c.client_id !== id);
            const archivedClients = [
                this.clients.find((c) => c.client_id === id),
                ...this.archivedClients,
            ];
            return {
                clients,
                archivedClients,
            };
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }

    @MutationAction
    async unarchiveClients(ids: number[]) {
        await baseAPI.put(
            "https://api.traininblocks.com/v2/batch/clients/unarchive",
            ids.map((i) => {
                return { id: i };
            })
        );

        const clients = [
            ...this.clients,
            ...this.archivedClients.filter((c) => ids.includes(c.client_id)),
        ];
        const archivedClients = this.archivedClients.filter(
            (c) => !ids.includes(c.client_id)
        );
        return {
            clients,
            archivedClients,
        };
    }

    @MutationAction
    async createClient(
        data: Pick<Client, "pt_id" | "name" | "email" | "number">
    ) {
        const response = await baseAPI.post(
            "https://api.traininblocks.com/v2/clients",
            {
                ...data,
                notes: "",
            }
        );

        const clients: Client[] = [
            ...this.clients,
            {
                notes: "",
                notifications: 1,
                archive: 0,
                profile_image: "",
                client_id: response.data[0]["LAST_INSERT_ID()"],
                ...data,
            },
        ];
        return {
            clients,
        };
    }

    @MutationAction
    async deleteClients(ids: number[]) {
        await baseAPI.delete("https://api.traininblocks.com/v2/batch/clients", {
            data: ids.map((i) => {
                return { id: i };
            }),
        });

        const archivedClients = this.archivedClients.filter(
            (c) => !ids.includes(c.client_id)
        );
        return {
            archivedClients,
        };
    }

    @MutationAction
    async duplicatePlan({
        client_id,
        plan,
    }: {
        client_id: number;
        plan: Plan;
    }) {
        const newPlan = plan;
        const { name, duration, block_color } = newPlan;
        const planResponse = await baseAPI.post(
            "https://api.traininblocks.com/v2/plans",
            {
                name: `Copy of ${name}`,
                client_id,
                duration,
                block_color,
            }
        );

        newPlan.id = planResponse.data[0]["LAST_INSERT_ID()"];

        await baseAPI.put("https://api.traininblocks.com/v2/plans", newPlan);

        if (!plan.sessions) return;
        const newSessions: Session[] = [];
        for (const s of plan.sessions) {
            const newSession: Omit<Session, "id"> = {
                name: s.name,
                programme_id: newPlan.id,
                date: s.date,
                notes: s.notes,
                week_id: s.week_id,
                checked: s.checked,
                feedback: null,
            };
            const sessionResponse = await baseAPI.post(
                "https://api.traininblocks.com/v2/sessions",
                newSession
            );
            const newSessionId = sessionResponse.data[0]["LAST_INSERT_ID()"];
            newSessions.push({
                ...newSession,
                id: newSessionId,
            });
            if (newSessions.length >= 30)
                throw new Error("Too many sessions to duplicate");
        }
        newPlan.sessions = newSessions;

        const clients = this.clients.map((c: Client) =>
            c.client_id !== client_id
                ? c
                : {
                      ...c,
                      plans: [...(c.plans ?? []), newPlan],
                  }
        );

        return {
            clients,
        };
    }
}

export default getModule(ClientsModule);
