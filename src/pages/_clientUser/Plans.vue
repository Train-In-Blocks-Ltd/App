<template>
    <wrapper id="client-plan">
        <!-- Plan name -->
        <div v-if="loading" class="skeleton-box animate-pulse p-4 w-1/3">
            <div class="skeleton-item-lg" />
        </div>
        <txt v-else type="title">
            {{ plan.name }}
        </txt>

        <!-- Plan notes -->
        <div v-if="loading" class="skeleton-box animate-pulse p-4 sm:p-8 my-16">
            <div class="skeleton-item w-1/3" />
            <div class="skeleton-item w-2/3" />
            <div class="skeleton-item w-5/12" />
            <div class="skeleton-item w-1/2" />
            <div class="skeleton-item w-1/4" />
        </div>
        <label-wrapper v-else title="Plan notes" class="my-16">
            <div
                v-if="plan.notes && plan.notes !== '<p></p>'"
                class="show_html mt-8"
                v-html="updateHTML(plan.notes, true)"
            />
            <txt
                v-else-if="
                    plan.notes === null ||
                    plan.notes === '<p><br></p>' ||
                    plan.notes === ''
                "
                type="large-body"
                class="show_html mt-8"
                grey
            >
                No plan notes added...
            </txt>
        </label-wrapper>

        <!-- Calendar section -->
        <div v-if="loading" class="skeleton-box animate-pulse p-4 sm:p-8 mb-16">
            <div class="skeleton-item-lg" />
            <div
                v-for="index in 7"
                :key="`calendar-skeleton-${index}`"
                class="flex"
            >
                <div class="skeleton-item-lg w-1/4 mr-4" />
                <div class="skeleton-item w-1/4" />
            </div>
        </div>
        <div v-else class="mb-16">
            <a
                class="flex items-center mb-4"
                href="javascript:void(0)"
                :aria-label="`Switch to ${
                    !showMonthlyCal ? 'month' : 'week'
                } view`"
                @click="showMonthlyCal = !showMonthlyCal"
            >
                <icon svg="calendar" :size="20" class="mr-2" />
                Switch to {{ !showMonthlyCal ? "month" : "week" }} view
            </a>
            <week-calendar
                v-if="!showMonthlyCal"
                :events="events"
                :is-trainer="false"
                :on-event-press="goToEvent"
            />
            <month-calendar
                v-else
                :events="events"
                :is-trainer="false"
                :on-event-press="goToEvent"
            />
        </div>

        <!-- Sessions section -->
        <div v-if="loading" class="skeleton-box animate-pulse p-4 mb-8">
            <div class="skeleton-item w-1/3" />
            <div class="skeleton-item w-2/3" />
            <div class="skeleton-item w-5/12" />
            <div class="skeleton-item w-1/2" />
            <div class="skeleton-item w-1/4" />
        </div>
        <div v-else-if="plan.sessions">
            <!-- Navigation controls -->
            <div class="flex items-center justify-between mb-8">
                <icon-button
                    svg="arrow-left"
                    :size="32"
                    :on-click="() => showing_current_session--"
                    :disabled="showing_current_session === 0"
                    aria-label="Previous session"
                    title="Previous session"
                />
                <txt type="subtitle">
                    {{ showing_current_session + 1 }}/{{ plan.sessions.length }}
                </txt>
                <icon-button
                    svg="arrow-right"
                    :size="32"
                    :on-click="() => showing_current_session++"
                    :disabled="
                        showing_current_session ===
                        parseInt(plan.sessions.length) - 1
                    "
                    aria-label="Next session"
                    title="Next session"
                />
            </div>

            <!-- Session -->
            <card-wrapper
                v-for="(session, indexed) in plan.sessions"
                v-show="showing_current_session === indexed"
                :id="`session-${session.id}`"
                :key="indexed"
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
        <div v-else class="mb-8">
            <txt type="subtitle">No sessions yet</txt>
            <txt type="large-body" grey>
                Please contact your trainer or coach for more details
            </txt>
        </div>
    </wrapper>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { NavigationGuardNext, Route } from "vue-router";
import appModule from "../../store/app.module";
import clientUserModule from "../../store/clientUser.module";
import utilsModule from "../../store/utils.module";
import MainMixins from "../../main.mixins";
import { EditorState, Session } from "../../common/types";

const WeekCalendar = () =>
    import(
        /* webpackChunkName: "components.weekCalendar", webpackPreload: true  */ "../../components/generic/WeekCalendar.vue"
    );
const MonthCalendar = () =>
    import(
        /* webpackChunkName: "components.monthCalendar", webpackPreload: true */ "../../components/generic/MonthCalendar.vue"
    );
const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "../../components/generic/LabelWrapper.vue"
    );
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "../../components/generic/CardWrapper.vue"
    );

@Component({
    metaInfo() {
        return {
            title: "Plans",
        };
    },
    components: {
        WeekCalendar,
        MonthCalendar,
        CardWrapper,
        LabelWrapper,
    },
})
export default class ClientPlans extends Mixins(MainMixins) {
    showing_current_session: number = 0;
    forceStop: number = 0;
    feedbackId: number | null = null;
    tempEditorStore: string | null = null;
    showMonthlyCal: boolean = false;

    get dontLeave() {
        return appModule.dontLeave;
    }
    get loading() {
        return appModule.loading;
    }
    get plan() {
        return clientUserModule.plans.find(
            (p) => p.id === parseInt(this.$route.params.id)
        );
    }
    set plan(value) {
        if (value)
            clientUserModule.setPlans(
                clientUserModule.plans.map((p) =>
                    p.id !== value.id ? p : value
                )
            );
    }
    get weekColor() {
        const colors = this.plan?.block_color;
        if (!colors) return new Array(this.plan?.duration).fill("#282828");
        return JSON.parse(colors);
    }
    get events() {
        return this.plan?.sessions
            ?.sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map(({ name, date, week_id, id }) => {
                return {
                    id,
                    name,
                    date,
                    week_id,
                    color: this.weekColor[week_id - 1],
                    textColor: this.getAccessibleColor(
                        this.weekColor[week_id - 1]
                    ),
                };
            });
    }

    async beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext) {
        if (
            this.dontLeave
                ? await utilsModule.confirmPopUpRef?.open({
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            appModule.setDontLeave(false);
            next();
        }
    }

    /** Resolves the state of the feedback editor. */
    resolveFeedbackEditor(state: EditorState, id: number) {
        const session = this.plan?.sessions?.find((s) => s.id === id);
        if (!session) return;
        switch (state) {
            case "edit":
                appModule.setDontLeave(true);
                this.feedbackId = id;
                this.forceStop += 1;
                this.tempEditorStore = session.feedback;
                break;
            case "save":
                this.feedbackId = null;
                clientUserModule.updateSession(session);
                break;
            case "cancel":
                appModule.setDontLeave(false);
                this.feedbackId = null;
                session.feedback = this.tempEditorStore;
                break;
        }
    }

    /** Scrolls towards the target session. */
    goToEvent(id: number) {
        const sIndex = this.plan?.sessions?.findIndex((s) => s.id === id);
        if (sIndex === undefined) return;
        this.showing_current_session = sIndex;
        setTimeout(() => {
            document
                .getElementById(`session-${id}`)
                ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }

    /** Toggles the complete state of the session. */
    handleToggleComplete(session: Session) {
        clientUserModule.updateSession({
            ...session,
            checked: !!session.checked ? 0 : 1,
        });
        appModule.stopLoaders();
    }
}
</script>
