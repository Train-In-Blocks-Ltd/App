import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Plan } from "../types";
import clientStore from "../client";

@Module({
    name: "plan",
    store,
    dynamic: true,
})
class PlanModule extends VuexModule {
    plan: Plan | null = null;
    currentWeek: number = 1;

    @MutationAction
    async setPlan(plan: Plan | null) {
        return {
            plan,
        };
    }

    @MutationAction
    async setCurrentPlan(id: number) {
        const plan = clientStore.clientDetails?.plans?.find((p) => p.id === id);

        return {
            plan,
        };
    }

    @MutationAction
    async setCurrentWeek(currentWeek: number) {
        return {
            currentWeek,
        };
    }
}

export default getModule(PlanModule);
