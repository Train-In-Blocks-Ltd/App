import { baseAPI } from "../../../api";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import store from "../..";
import { Client } from "../types";

@Module({
    namespaced: true,
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
    async setUnarchivedClients(ids: number[]) {
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
        const archivedClients = [
            ...this.archivedClients,
            ...this.clients.filter((c) => !ids.includes(c.client_id)),
        ];
        return {
            clients,
            archivedClients,
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
}

export default getModule(ClientsModule);
