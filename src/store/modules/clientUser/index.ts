import store from "../..";
import { getModule, Module, VuexModule } from "vuex-module-decorators";

@Module({
    name: "clientUser",
    store,
    dynamic: true,
})
class ClientUserModule extends VuexModule {
    clientUser = {
        name: "",
    };
}

export default getModule(ClientUserModule);
