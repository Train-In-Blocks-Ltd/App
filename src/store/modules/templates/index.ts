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

    @MutationAction
    async revertTemplate(
        id: number,
        { pt_id, name, created_at, updated_at }: Template,
        oldData: string
    ) {
        return {
            templates: this.templates.map((t) =>
                t.id !== id
                    ? t
                    : ({
                          id,
                          pt_id,
                          created_at,
                          updated_at,
                          name,
                          template: oldData,
                      } as Template)
            ),
        };
    }
}

export default getModule(TemplatesModule);
