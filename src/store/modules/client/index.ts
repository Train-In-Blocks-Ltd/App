import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Booking, Client } from "../types";

@Module({
    namespaced: true,
    name: "client",
    store,
    dynamic: true,
})
class ClientModule extends VuexModule {
    public client: Client | null = null;
}

export default getModule(ClientModule);
