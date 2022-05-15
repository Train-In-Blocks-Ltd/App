import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Portfolio, Template } from "../types";

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
        business_name,
        notes,
        pt_id,
        trainer_name,
    }: Portfolio) {
        return {
            business_name,
            notes,
            pt_id,
            trainer_name,
        };
    }
}

export default getModule(PortfolioModule);
