import store from "../..";
import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { Plan, Session } from "../types";
import { baseAPI } from "../../../api";
import clientStore from "../client";
import utilsStore from "../utils";

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

    @MutationAction
    async updatePlan() {
        await baseAPI.put("https://api.traininblocks.com/v2/plans", this.plan);

        return {};
    }

    @MutationAction
    async addSession(
        session: Pick<Session, "programme_id" | "date" | "week_id">
    ) {
        const response = await baseAPI.post(
            "https://api.traininblocks.com/v2/sessions",
            {
                ...session,
                notes: "",
                name: "Untitled",
            }
        );
        const newSessionId = response.data[0]["LAST_INSERT_ID()"];
        const plan = this.plan;
        plan?.sessions?.push({
            ...session,
            id: newSessionId,
            feedback: null,
            checked: 0,
            notes: "",
            name: "Untitled",
        });

        return {};
    }

    @MutationAction
    async toggleSessionChecked(checked: 1 | 0) {
        const plan = this.plan;
        if (!plan) return;
        const sessions = plan.sessions
            ?.filter((s) => utilsStore.selectedIds.includes(s.id))
            .map((s) => {
                return {
                    ...s,
                    checked,
                };
            });
        if (!sessions) return;
        await baseAPI.put(
            "https://api.traininblocks.com/v2/batch/sessions",
            sessions
        );

        plan.sessions = sessions;
        return {
            plan,
        };
    }
}

export default getModule(PlanModule);
