<template>
    <wrapper id="client-home">
        <!-- Today's sessions section -->
        <div class="flex justify-between">
            <txt type="title">Today</txt>
            <div class="flex">
                <icon-button
                    v-if="pwa.displayMode === 'browser tab'"
                    svg="download"
                    :on-click="handleOpenInstall"
                    :icon-size="28"
                    class="mr-4"
                    aria-label="Install"
                    title="Install"
                />
                <icon-button
                    svg="info"
                    :icon-size="32"
                    class="mr-4"
                    :on-click="handleOpenInfo"
                    aria-label="Your trainer"
                    title="Your trainer"
                />
                <icon-button
                    svg="user"
                    :icon-size="32"
                    :on-click="handleOpenProfile"
                    aria-label="Your profile"
                    title="Your profile"
                />
            </div>
        </div>

        <!-- Sessions section -->
        <div v-if="loading" class="skeleton-box animate-pulse p-4 mt-8">
            <div class="skeleton-item w-1/3" />
            <div class="skeleton-item w-2/3" />
            <div class="skeleton-item w-5/12" />
            <div class="skeleton-item w-1/2" />
            <div class="skeleton-item w-1/4" />
        </div>
        <div v-else-if="getTodaySessions(plans).length" class="grid gap-8 mt-8">
            <!-- Session -->
            <card-wrapper
                v-for="(session, sessionIndex) in getTodaySessions(plans)"
                :id="`session-${session.id}`"
                :key="sessionIndex"
                class="p-4 sm:p-8"
                no-hover
            >
                <!-- Preview state header -->
                <div>
                    <txt bold>{{ session.name }}</txt>
                    <txt type="tiny"
                        >{{ day(session.date) }} {{ session.date }}</txt
                    >
                </div>

                <!-- Session Content -->
                <div
                    class="show_html"
                    v-html="updateHTML(session.notes, true)"
                />

                <!-- Toggle complete button -->
                <default-button
                    v-if="!feedbackId"
                    :theme="session.checked === 1 ? 'green' : 'red'"
                    :on-click="() => handleToggleComplete(session)"
                    :aria-label="
                        session.checked === 1
                            ? 'Completed'
                            : 'Click to complete'
                    "
                    class="mt-4"
                >
                    {{
                        session.checked === 1
                            ? "Completed"
                            : "Click to complete"
                    }}
                </default-button>

                <!-- Feedback section -->
                <div v-if="session.checked === 1">
                    <divider class="mt-8 mb-6" />
                    <txt type="subtitle">Feedback</txt>
                    <rich-editor
                        v-model="session.feedback"
                        :item-id="session.id"
                        :editing="feedbackId"
                        :placeholder="'What would you like to share with your trainer?'"
                        :force-stop="forceStop"
                        @on-edit-change="resolveFeedbackEditor"
                    />
                </div>
            </card-wrapper>
        </div>

        <!-- Placeholder -->
        <txt v-else type="large-body" class="mt-4" grey>
            Nothing planned for today
        </txt>

        <!-- Plans section -->
        <div class="mt-16">
            <txt type="title" class="mb-8">Plans</txt>
            <div v-if="loading" class="grid sm:grid-cols-2 gap-4">
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-1/3" />
                    <div class="skeleton-item w-3/4" />
                </div>
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-1/3" />
                    <div class="skeleton-item w-3/4" />
                </div>
            </div>
            <div v-else-if="plans" class="grid sm:grid-cols-2 gap-4">
                <plan-card
                    v-for="(plan, index) in plans"
                    :key="`plan-${index}`"
                    :plan="plan"
                    :link="`/clientUser/plan/${plan.id}`"
                />
            </div>
            <txt v-else type="large-body" grey>
                No plans yet, please contact your trainer or coach for more
                information
            </txt>
        </div>
    </wrapper>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { NavigationGuardNext, Route } from "vue-router";
import { EditorState, Plan, Session } from "../../store/modules/types";
import appState from "../../store/modules/appState";
import clientUserStore from "../../store/modules/clientUser";
import utilsStore from "../../store/modules/utils";
import GeneralMixins from "../../generalMixins";

const PlanCard = () =>
    import(
        /* webpackChunkName: "components.planCard", webpackPreload: true  */ "../../components/generic/PlanCard.vue"
    );
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "../../components/generic/CardWrapper.vue"
    );

@Component({
    components: {
        PlanCard,
        CardWrapper,
    },
})
export default class ClientHome extends Mixins(GeneralMixins) {
    forceStop: number = 0;
    feedbackId: number | null = null;
    tempEditorStore: string | null = null;
    showing_current_session: number = 0;

    get pwa() {
        return appState.pwa;
    }
    get loading() {
        return appState.loading;
    }
    get dontLeave() {
        return appState.dontLeave;
    }
    get portfolio() {
        return clientUserStore.portfolio;
    }
    get plans() {
        return clientUserStore.plans;
    }
    set plans(value) {
        clientUserStore.setPlans(value);
    }
    get claims() {
        return;
    }

    async beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext) {
        if (
            this.dontLeave
                ? await utilsStore.confirmPopUpRef?.open({
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            appState.setDontLeave(false);
            next();
        }
    }

    getTodaySessions(plans: Plan[]) {
        const allSessions: Session[] = [];
        plans.forEach((p) => {
            if (!!p.sessions) allSessions.push(...p.sessions);
        });
        return allSessions
            .filter((s) => this.today() === s.date)
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );
    }

    /** Resolves the state of the feedback editor. */
    resolveFeedbackEditor(state: EditorState, id: number) {
        const session = this.getTodaySessions(this.plans).find(
            (s) => s.id === id
        );
        if (!session) return;
        switch (state) {
            case "edit":
                appState.setDontLeave(true);
                this.feedbackId = id;
                this.forceStop += 1;
                this.tempEditorStore = session.feedback;
                break;
            case "save":
                this.feedbackId = null;
                clientUserStore.updateSession(session);
                break;
            case "cancel":
                appState.setDontLeave(false);
                this.feedbackId = null;
                session.feedback = this.tempEditorStore;
                break;
        }
    }

    handleOpenInstall() {
        utilsStore.openModal({
            name: "install-pwa",
        });
    }

    handleOpenInfo() {
        if (this.portfolio?.notes)
            utilsStore.openModal({
                name: "info",
                previewHTML: this.portfolio.notes,
            });
    }

    handleOpenProfile() {
        utilsStore.openModal({
            name: "client-user-profile",
        });
    }

    /** Toggles the complete state of the session. */
    handleToggleComplete(session: Session) {
        clientUserStore.updateSession({
            ...session,
            checked: !!session.checked ? 0 : 1,
        });
        appState.stopLoaders();
    }
}
</script>
