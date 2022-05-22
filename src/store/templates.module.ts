import store from ".";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Template } from "./types";
import { baseAPI } from "../api";
import accountModule from "./account.module";

@Module({
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
    async addTemplate() {
        try {
            const response = await baseAPI.post(
                "https://api.traininblocks.com/v2/templates",
                {
                    pt_id: accountModule.claims?.sub,
                    name: "Untitled",
                    template: "",
                }
            );
            const templates: Template[] = [
                ...this.templates,
                {
                    id: response.data[0]["LAST_INSERT_ID()"],
                    pt_id: accountModule.claims?.sub ?? "",
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

    @MutationAction
    async updateTemplate(id: number) {
        const foundTemplate = this.templates.find(
            (template) => template.id === id
        );
        await baseAPI.put(
            "https://api.traininblocks.com/v2/templates",
            foundTemplate
        );
        return {
            templates: this.templates,
        };
    }

    @MutationAction
    async deleteTemplates(ids: number[]) {
        const deleteIds: { id: number }[] = [];
        ids.forEach((id) => {
            deleteIds.push({ id });
        });
        await baseAPI.delete(
            "https://api.traininblocks.com/v2/batch/templates",
            {
                data: deleteIds,
            }
        );
        const templates = this.templates.filter((t) => !ids.includes(t.id));
        return {
            templates,
        };
    }
}

export default getModule(TemplatesModule);
