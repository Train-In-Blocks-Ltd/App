import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Template } from "../types";

@Module({
    namespaced: true,
    name: "templates",
    store,
    dynamic: true,
})
class TemplatesModule extends VuexModule {
    public templates: Template[] = [];

    @MutationAction
    async setTemplates(templates: Template[]) {
        return {
            templates,
        };
    }
}

export default getModule(TemplatesModule);
