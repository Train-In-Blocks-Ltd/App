import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import store from "../..";

@Module({
    namespaced: true,
    name: "utils",
    store,
    dynamic: true,
})
class UtilsModule extends VuexModule {
    search: string = "";
    @MutationAction
    async setSearch(search: string) {
        return { search };
    }
}

export default getModule(UtilsModule);
