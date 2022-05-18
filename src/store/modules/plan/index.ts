import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Plan } from "../types";
import clientStore from "../client";
import { baseAPI } from "../../../api";

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

    @MutationAction
    async setPlanNotes(notes: string) {
        return {
            plan: {
                ...this.plan,
                notes,
            },
        };
    }

    @MutationAction
    async createDuplicatePlan(id: number) {
        if (!this.plan) return;
        const { name, client_id, duration, block_color } = this.plan;
        const planResponse = await baseAPI.post(
            "https://api.traininblocks.com/v2/plans",
            {
                name: `Copy of ${name}`,
                client_id,
                duration,
                block_color,
            }
        );

        clientStore.addPlan({
            ...this.plan,
            id: planResponse.data[0]["LAST_INSERT_ID()"],
        });

        return {};
    }
}

export default getModule(PlanModule);
