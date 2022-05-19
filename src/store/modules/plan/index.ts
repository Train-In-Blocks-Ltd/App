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
import { addDays } from "../../../common/helpers";

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

    @MutationAction
    async updateSession(id: number) {
        const session = this.plan?.sessions?.find((s) => s.id === id);
        if (!session) return;
        await baseAPI.put("https://api.traininblocks.com/v2/sessions", session);

        return {};
    }

    @MutationAction
    async deleteSessions() {
        const data = utilsStore.selectedIds.map((id) => {
            return {
                id,
            };
        });
        await baseAPI.delete(
            "https://api.traininblocks.com/v2/batch/sessions",
            {
                data,
            }
        );

        const plan = this.plan;
        if (!plan) return;
        plan.sessions = plan.sessions?.filter(
            (s) => !utilsStore.selectedIds.includes(s.id)
        );
        return {
            plan,
        };
    }

    @MutationAction
    async updateWeekColor(color: string) {
        const plan = this.plan;
        if (!plan) return;
        if (!plan.block_color) {
            plan.block_color = JSON.stringify(
                new Array(plan.duration).fill("#999999")
            );
        } else {
            try {
                plan.block_color = JSON.stringify(
                    (JSON.parse(plan.block_color) as string[]).map((c, i) =>
                        this.currentWeek - 1 === i ? color : c
                    )
                );
            } catch {
                plan.block_color = JSON.stringify(
                    new Array(plan.duration).fill("#999999")
                );
            }
        }

        await baseAPI.put("https://api.traininblocks.com/v2/plans", plan);

        return {
            plan,
        };
    }

    @MutationAction
    async updateDuration() {
        const plan = this.plan;
        if (!plan) return;
        if (!plan.block_color) {
            plan.block_color = JSON.stringify(
                new Array(plan.duration).fill("#999999")
            );
        } else {
            try {
                plan.block_color = JSON.stringify(
                    new Array(plan.duration)
                        .fill("#999999")
                        .map(
                            (_, i) =>
                                (JSON.parse(plan.block_color) as string[])[i]
                        )
                        .map((c) => c || "#999999")
                );
            } catch {
                plan.block_color = JSON.stringify(
                    new Array(plan.duration).fill("#999999")
                );
            }
        }

        await baseAPI.put("https://api.traininblocks.com/v2/plans", plan);

        return {
            plan,
        };
    }

    @MutationAction
    async shiftSessions(shiftDays: number) {
        const plan = this.plan;
        if (!plan) return;

        const sessions = plan.sessions?.map((s) => {
            return {
                ...s,
                date: utilsStore.selectedIds.includes(s.id)
                    ? addDays(s.date, shiftDays)
                    : s.date,
            };
        });

        await baseAPI.put(
            "https://api.traininblocks.com/v2/batch/sessions",
            sessions
        );

        plan.sessions = sessions;
        return {
            plan,
        };
    }

    @MutationAction
    async moveSessions(week_id: number) {
        const plan = this.plan;
        if (!plan) return;

        const sessions = plan.sessions?.map((s) => {
            return {
                ...s,
                week_id: utilsStore.selectedIds.includes(s.id)
                    ? week_id
                    : s.week_id,
            };
        });

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
