import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import store from "../..";
import { Client } from "../types";
import { baseAPI } from "../../../api";
import appState from "../appState";

@Module({
    namespaced: true,
    name: "clients",
    store,
    dynamic: true,
})
class ClientsModule extends VuexModule {
    clients: Client[] = [];

    @MutationAction
    async fetchClients() {
        const RESPONSE = await baseAPI.get(
            `https://api.traininblocks.com/v2/${appState.claims?.sub}`
        );
        return {
            clients: RESPONSE.data[0][0],
        };
    }
}

export default getModule(ClientsModule);
