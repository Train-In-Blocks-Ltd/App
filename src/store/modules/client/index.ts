import store from "../..";
import { Module, VuexModule } from "vuex-module-decorators";
import { Client } from "../types";

@Module({ name: "client", store })
export default class ClientModule extends VuexModule {
    client: Client | null = null;
}
