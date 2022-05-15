import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Template } from "../types";
import { baseAPI } from "../../../api";
import appState from "../appState";

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

    @MutationAction
    async addTemplate() {
        try {
            const response = await baseAPI.post(
                "https://api.traininblocks.com/v2/templates",
                {
                    pt_id: appState.claims?.sub,
                    name: "Untitled",
                    template: "",
                }
            );
            const templates: Template[] = [
                ...this.templates,
                {
                    id: response.data[0]["LAST_INSERT_ID()"],
                    pt_id: appState.claims?.sub ?? "",
                    name: "Untitled",
                    template: "",
                },
            ];
            return {
                templates,
            };
        } catch (e) {
            console.error(e);
        }
    }
}

export default getModule(TemplatesModule);
