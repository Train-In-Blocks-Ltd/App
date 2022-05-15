import { store } from "../..";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Template } from "../types";

@Module({ name: "templates", store })
export default class TemplatesModule extends VuexModule {
    public templates: Template[] = [];

    @Mutation
    ADD_TEMPLATE(template: Template) {
        this.templates.push(template);
    }

    @Mutation
    DELETE_TEMPLATE(id: number) {
        this.templates = this.templates.filter(
            (template) => template.id !== id
        );
    }

    @Action({ commit: "ADD_TEMPLATE" })
    async addTemplate() {
        // const RESPONSE = await this._vm.$axios
        //     .post("https://api.traininblocks.com/v2/templates", {
        //         pt_id: state.claims.sub,
        //         name: "Untitled",
        //         template: "",
        //     })
        //     .catch((e) => {
        //         console.error(e);
        //     });
        // commit("addNewTemplate", {
        //     templateId: RESPONSE.data[0]["LAST_INSERT_ID()"],
        //     ptId: state.claims.sub,
        //     name: "Untitled",
        //     template: "",
        // });
    }
}
