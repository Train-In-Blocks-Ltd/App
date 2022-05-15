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
}

export default getModule(ClientsModule);
