import store from "../..";
import { Module, VuexModule } from "vuex-module-decorators";
import { Client } from "../types";

@Module({ name: "clients", store })
export default class ClientsModule extends VuexModule {
    clients: Client[] = [];
}
