<template>
    <wrapper id="client-plan">
        <!-- Plan name -->
        <txt type="title">
            {{ plan.name }}
        </txt>

        <!-- Plan notes -->
        <editor-wrapper title="Plan notes" class="my-16">
            <div
                v-if="plan.notes && plan.notes !== '<p></p>'"
                class="show_html fadeIn mt-8"
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
        </editor-wrapper>

        <!-- Calendar section -->
        <div class="mb-16">
            <a
                class="flex items-center"
                href="javascript:void(0)"
                @click="showMonthlyCal = !showMonthlyCal"
            >
                <icon svg="calendar" :icon-size="20" class="mr-2" />
                Switch to {{ !showMonthlyCal ? "month" : "week" }} view
            </a>
            <week-calendar
                v-if="!showMonthlyCal"
                :events="sessionDates"
                :force-update="forceUpdate"
                :is-trainer="false"
                class="fadeIn"
            />
            <month-calendar
                v-else
                :events="sessionDates"
                :force-update="forceUpdate"
                :is-trainer="false"
                class="fadeIn"
            />
        </div>

        <!-- Sessions section -->
        <skeleton v-if="loading" :type="'session'" />
        <div v-else-if="plan.sessions">
            <!-- Navigation controls -->
            <div class="flex items-center justify-between mb-8">
                <icon-button
                    svg="arrow-left"
                    :icon-size="32"
                    :on-click="() => showing_current_session--"
                    :disabled="showing_current_session === 0"
                />
                <txt type="subtitle">
                    {{ showing_current_session + 1 }}/{{ plan.sessions.length }}
                </txt>
                <icon-button
                    svg="arrow-right"
                    :icon-size="32"
                    :on-click="() => showing_current_session++"
                    :disabled="
                        showing_current_session ===
                        parseInt(plan.sessions.length) - 1
                    "
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
                    :on-click="
                        () =>
                            handleToggleComplete(
                                plan.id,
                                session.id,
                                session.checked
                            )
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
                    <hr class="mt-8 mb-6" />
                    <txt type="subtitle">Feedback</txt>
                    <rich-editor
                        v-model="session.feedback"
                        :item-id="session.id"
                        :editing="feedbackId"
                        :empty-placeholder="'What would you like to share with your trainer?'"
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

<script>
import { mapState } from "vuex";

const WeekCalendar = () =>
    import(
        /* webpackChunkName: "components.weekCalendar", webpackPreload: true  */ "../../components/WeekCalendar"
    );
const MonthCalendar = () =>
    import(
        /* webpackChunkName: "components.monthCalendar", webpackPreload: true */ "../../components/MonthCalendar"
    );
const EditorWrapper = () =>
    import(
        /* webpackChunkName: "components.editorWrapper", webpackPreload: true  */ "@/components/generic/EditorWrapper"
    );
const RichEditor = () =>
    import(
        /* webpackChunkName: "components.richEditor", webpackPreload: true  */ "../../components/Editor"
    );
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );

export default {
    metaInfo() {
        return {
            title: "Plans",
        };
    },
    components: {
        WeekCalendar,
        MonthCalendar,
        RichEditor,
        CardWrapper,
        EditorWrapper,
    },
    async beforeRouteLeave(to, from, next) {
        if (
            this.dontLeave
                ? await this.$store.dispatch("openConfirmPopUp", {
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            this.$store.commit("setData", {
                attr: "dontLeave",
                data: false,
            });
            next();
        }
    },
    data() {
        return {
            // SYSTEM

            showing_current_session: 0,

            // EDIT

            forceStop: 0,
            feedbackId: null,
            tempEditorStore: null,

            // CALENDAR

            showMonthlyCal: false,
            sessionDates: [],
            forceUpdate: 0,
        };
    },
    computed: {
        ...mapState(["clientUserLoaded", "loading", "dontLeave", "clientUser"]),
        plan() {
            return this.$store.state.clientUser.plans.find(
                (plan) => plan.id === parseInt(this.$route.params.id)
            );
        },
    },
    async created() {
        this.$store.commit("setData", {
            attr: "loading",
            data: true,
        });
        this.willBodyScroll(true);
        await this.$parent.setup();
        await this.$parent.getClientSideData();
        this.$store.dispatch("endLoading");
    },
    methods: {
        /**
         * Resolves the state of the feedback editor.
         */
        resolveFeedbackEditor(state, id) {
            let plan;
            let session;
            this.clientUser.plans.forEach((planItem) => {
                if (planItem.sessions) {
                    planItem.sessions.forEach((sessionItem) => {
                        if (sessionItem.id === id) {
                            plan = planItem;
                            session = sessionItem;
                        }
                    });
                }
            });
            switch (state) {
                case "edit":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    this.feedbackId = id;
                    this.forceStop += 1;
                    this.tempEditorStore = session.feedback;
                    break;
                case "save":
                    this.feedbackId = null;
                    this.$parent.updateClientSideSession(plan.id, session.id);
                    break;
                case "cancel":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: false,
                    });
                    this.feedbackId = null;
                    session.feedback = this.tempEditorStore;
                    break;
            }
        },

        /**
         * Scrolls towards the target session.
         */
        goToEvent(id) {
            const SESSION_INDEX = this.sessionDates.findIndex(
                (session) => session.session_id === id
            );
            this.showing_current_session = SESSION_INDEX;
            setTimeout(() => {
                document
                    .getElementById(`session-${id}`)
                    .scrollIntoView({ behavior: "smooth" });
            }, 100);
        },

        /**
         * Toggles the complete state of the session.
         */
        handleToggleComplete(planId, sessionId, currentChecked) {
            this.$store.commit("updateClientUserPlanSingleSession", {
                planId,
                sessionId,
                attr: "checked",
                data: !currentChecked ? 1 : 0,
            });
            this.$parent.updateClientSideSession(planId, sessionId);
            this.$store.dispatch("endLoading");
        },

        /**
         * Scans the sessions and updates the page.
         */
        scan() {
            this.sessionDates.length = 0;
            const PLAN = this.clientUser.plans.find(
                (plan) => plan.id === parseInt(this.$route.params.id)
            );
            const WEEK_COLOR = PLAN.block_color
                .replace("[", "")
                .replace("]", "")
                .split(",");
            if (PLAN.sessions !== null) {
                PLAN.sessions.forEach((session) => {
                    this.sessionDates.push({
                        title: session.name,
                        date: session.date,
                        color: WEEK_COLOR[session.week_id - 1],
                        textColor: this.accessible_colors(
                            WEEK_COLOR[session.week_id - 1]
                        ),
                        week_id: session.week_id,
                        session_id: session.id,
                    });
                });
            }
            this.forceUpdate += 1;
        },
    },
};
</script>
