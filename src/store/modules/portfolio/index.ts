import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Portfolio } from "../types";
import { baseAPI } from "../../../api";
import appState from "../appState";

@Module({
    namespaced: true,
    name: "portfolio",
    store,
    dynamic: true,
})
class PortfolioModule extends VuexModule implements Portfolio {
    business_name: string = "";
    notes: string = "";
    pt_id: string = "";
    trainer_name: string = "";

    @MutationAction
    async setPortfolio({
        pt_id,
        business_name,
        trainer_name,
        notes,
    }: Portfolio) {
        return {
            pt_id,
            business_name,
            trainer_name,
            notes,
        };
    }
    @MutationAction
    async setBusinessName(business_name: string) {
        return {
            business_name,
        };
    }
    @MutationAction
    async setTrainerName(trainer_name: string) {
        return {
            trainer_name,
        };
    }
    @MutationAction
    async setNotes(notes: string) {
        return {
            notes,
        };
    }

    @MutationAction
    async revertPortfolio(oldData: Portfolio) {
        return oldData;
    }

    @MutationAction
    async createPortfolio() {
        const pt_id = appState.claims?.sub;
        await baseAPI.post("https://api.traininblocks.com/v2/portfolio", {
            pt_id,
            trainer_name: "",
            business_name: "",
            notes: "",
        });
        return {
            pt_id,
            trainer_name: "",
            business_name: "",
            notes: "",
        };
    }

    @MutationAction
    async updatePortfolio() {
        const { pt_id, business_name, trainer_name, notes } = this;
        await baseAPI.put(
            `https://api.traininblocks.com/v2/portfolio/${appState.claims?.sub}`,
            {
                pt_id,
                business_name,
                trainer_name,
                notes,
            }
        );

        return {};
    }
}

export default getModule(PortfolioModule);
