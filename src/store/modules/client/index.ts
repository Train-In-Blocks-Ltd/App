import { store } from "@/store";
import { Module, VuexModule } from "vuex-module-decorators";

@Module({ name: "client", store })
export default class Client extends VuexModule {
    client = null;
}
