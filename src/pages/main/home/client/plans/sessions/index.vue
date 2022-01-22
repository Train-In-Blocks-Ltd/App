<style lang="scss" scoped>
.switch_cal {
    margin-bottom: 0.4rem;
    svg {
        margin-right: 0.4rem;
    }
}

/* Sessions */
.session--header {
    display: flex;
    justify-content: space-between;
    .session--header__left {
        display: grid;
        grid-gap: 1rem;
        min-height: 80px;
        .session--header__left__top {
            display: flex;
            .change_week_color {
                height: 2rem;
                width: 4rem;
                border: 2px solid var(--base);
                border-radius: 5px;
                cursor: pointer;
                transition: var(--transition_standard);
                &:hover {
                    opacity: var(--light_opacity);
                }
                &.noColor {
                    /* stylelint-disable-next-line */
                    background-color: var(--fore) !important;
                }
            }

            /* Info */
            #info {
                fill: var(--base);
                margin-left: 1rem;
                cursor: pointer;
                transition: opacity 1s,
                    transform 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
                &:hover {
                    opacity: var(--light_opacity);
                }
                &:active {
                    transform: var(--active_state);
                }
            }
        }
    }
}
.container--sessions_header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
    a {
        font-size: 0.8rem;
        margin-left: 1rem;
    }
}
.container--sessions {
    display: grid;
    grid-gap: 2rem;
    .session_header {
        display: flex;
        justify-content: space-between;
        .session-name {
            margin-bottom: 0.4rem;
        }
        .session-date {
            margin-bottom: 0.4rem;
            width: fit-content;
            font-size: 0.8rem;
        }
        .header_options {
            display: flex;
            flex-direction: column;
            align-items: center;
            > .slot_1 {
                display: flex;
                .feedback_button {
                    margin-right: 1rem;
                    padding: 0.4rem 1rem;
                    border-radius: 3px;
                }
            }
            .icon--expand {
                cursor: pointer;
                margin: 0.8rem 0 0 auto;
                transition: var(--transition_smooth);
                &.expanded {
                    transform: rotate(180deg);
                }
            }
        }
        .newSession,
        .incomplete {
            color: var(--base_red);
        }
        .completed {
            color: var(--base_green);
        }
    }
}

/* Responsive */
@media (max-width: 992px) {
    .switch_cal {
        display: none;
    }
}
@media (max-width: 768px) {
    .client_plan_top_grid {
        margin-top: 1rem;
    }
    .container--sessions .session_header .session-name {
        width: 60%;
    }
}

@media (max-width: 576px) {
    /* Plan */
    .client_plan_top_grid .plan_options {
        display: grid;
        grid-gap: 1rem;
        .a_link {
            width: fit-content;
        }
    }

    /* Session */
    .session--header {
        display: block;
    }
    .container--sessions .session_header .session-name {
        width: 100%;
    }
    .button--new-session {
        width: 100%;
        margin: 2rem 0;
    }
}
</style>

<template>
    <div id="plan">
        <div
            :class="{
                opened_sections: showProgress,
            }"
            class="section_overlay"
        />
        <div
            v-if="showProgress"
            class="tab_overlay_content fadeIn delay fill_mode_both"
        >
            <progress-sessions
                :plan-data="
                    $store.getters.helper(
                        'match_plan',
                        $route.params.client_id,
                        $route.params.id
                    )
                "
                :sessions-to-progress="selectedIds"
                :current-week="currentWeek"
                :max-week="maxWeek"
            />
        </div>
        <div
            v-if="
                !loading && !isStatsOpen && !$parent.showOptions && !noSessions
            "
            class="tab_option icon_open_middle tab_option_small fadeIn"
            aria-label="Statistics"
            @click="(isStatsOpen = true), willBodyScroll(false)"
        >
            <inline-svg :src="require('@/assets/svg/stats.svg')" />
            <p class="text">Statistics</p>
        </div>
        <multiselect
            :type="'session'"
            :options="multiselectOption"
            @response="resolve_session_multiselect"
        />
        <div class="mt-16">
            <!-- Plan controls -->
            <div class="grid w-full md:w-2/3 m-auto">
                <txt-input
                    aria-label="Plan name"
                    type="text"
                    name="name"
                    :value="plan.name"
                    :is-disabled="silentLoading"
                    :on-blur="() => updatePlan()"
                    @output="(data) => (plan.name = data)"
                />

                <plan-progress-bar class="my-4" :sessions="plan.sessions" />
                <plan-options />
            </div>

            <div class="plan_grid">
                <!-- Plan notes -->
                <editor-wrapper title="Plan Notes" class="my-16">
                    <rich-editor
                        v-model="plan.notes"
                        :item-id="'plan_notes'"
                        :editing="editSession"
                        :empty-placeholder="'What do you want to achieve in this plan?'"
                        :force-stop="forceStop"
                        @on-edit-change="resolvePlanInfoEditor"
                    />
                </editor-wrapper>

                <!-- Calendar -->
                <div>
                    <!-- Type toggle -->
                    <a
                        class="flex items-center"
                        href="javascript:void(0)"
                        @click="showMonthlyCal = !showMonthlyCal"
                    >
                        <icon svg="calendar" :icon-size="20" class="mr-2" />
                        Switch to
                        {{ !showMonthlyCal ? "month" : "week" }} view
                    </a>

                    <!-- Calendars -->
                    <week-calendar
                        v-if="!showMonthlyCal"
                        :events="sessionDates"
                        :force-update="forceUpdate"
                        :is-trainer="true"
                        class="fadeIn"
                    />
                    <month-calendar
                        v-else
                        :events="sessionDates"
                        :force-update="forceUpdate"
                        :is-trainer="true"
                        class="fadeIn"
                    />
                </div>

                <!-- Microcycle table -->
                <div class="my-16">
                    <div class="plan_table">
                        <txt type="large-body" bold>Microcycles</txt>

                        <!-- Duration -->
                        <txt-input
                            type="number"
                            name="duration"
                            min="1"
                            label="Duration:"
                            class="w-1/3 lg:w-1/4 my-4"
                            inputmode="decimal"
                            :value="plan.duration"
                            :on-blur="() => updatePlan()"
                            @output="(data) => (plan.duration = data)"
                        />

                        <!-- Week table -->
                        <div class="flex mb-4">
                            <week
                                v-for="weekNumber in planDuration(
                                    plan.duration
                                )"
                                :class="{
                                    'mr-2': weekNumber !== plan.duration,
                                }"
                                :key="weekNumber"
                                :week-number="weekNumber"
                                :current-week="currentWeek"
                            />
                        </div>
                    </div>
                    <!-- plan_table -->
                    <div class="sessions">
                        <div class="session--header">
                            <div class="session--header__left">
                                <div class="session--header__left__top">
                                    <div
                                        :style="{
                                            backgroundColor:
                                                weekColor[currentWeek - 1],
                                        }"
                                        :class="{
                                            noColor:
                                                weekColor[currentWeek - 1] ===
                                                'null',
                                        }"
                                        class="change_week_color"
                                        @click="
                                            editingWeekColor = !editingWeekColor
                                        "
                                    />
                                    <inline-svg
                                        id="info"
                                        :src="require('@/assets/svg/info.svg')"
                                        title="Info"
                                        @click="
                                            () => {
                                                $store.commit('setData', {
                                                    attr: 'previewHTML',
                                                    data: '<p><b>[ </b><i>Exercise Name</i><b>:</b> <i>Sets</i> <b>x</b> <i>Reps</i> <b>at</b> <i>Load</i> <b>]</b></p><br> <p><b>Examples</b></p><p><i>[Back Squat: 3x6 at 50kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50kg]</i></p> <p><i>[Back Squat: 3x6 at 50/55/60kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50/55/60kg]</i></p><br><hr><br><p><b>[ </b><i>Measurement</i><b>:</b> <i>Value</i> <b>]</b></p><br><p><b>Examples</b></p><p><i>[Weight: 50kg]</i></p> <p><i>[Vertical Jump: 43.3cm]</i></p> <p><i>[Body Fat (%): 12]</i></p> <p><i>[sRPE (CR10): 8]</i></p> <p><i>[sRPE (Borg): 16]</i></p><br> <p>See <i>Help</i> for more information</p><br>',
                                                });
                                                $store.dispatch('openModal', {
                                                    name: 'info',
                                                });
                                            }
                                        "
                                    />
                                </div>
                                <color-picker
                                    v-if="editingWeekColor"
                                    :injected-color.sync="
                                        weekColor[currentWeek - 1]
                                    "
                                />
                            </div>
                            <div>
                                <button
                                    class="button--new-session"
                                    @click="createNewSession()"
                                >
                                    New session
                                </button>
                            </div>
                        </div>
                        <skeleton v-if="loading" :type="'session'" />
                        <div v-else-if="!noSessions && !weekIsEmpty">
                            <div
                                v-if="plan.sessions"
                                class="container--sessions_header"
                            >
                                <a
                                    v-if="
                                        !noSessions &&
                                        selectedIds.length <
                                            plan.sessions.length &&
                                        !weekIsEmpty
                                    "
                                    href="javascript:void(0)"
                                    class="a_link"
                                    @click="selectAll('week')"
                                >
                                    Select this microcycle
                                </a>
                                <a
                                    v-if="
                                        !noSessions &&
                                        selectedIds.length <
                                            plan.sessions.length &&
                                        !weekIsEmpty
                                    "
                                    href="javascript:void(0)"
                                    class="a_link"
                                    @click="selectAll('all')"
                                >
                                    Select all
                                </a>
                                <a
                                    v-if="
                                        plan.sessions !== false &&
                                        !isEditingSession &&
                                        !weekIsEmpty
                                    "
                                    href="javascript:void(0)"
                                    class="a_link"
                                    @click="
                                        expandAll(
                                            expandedSessions.length !== 0
                                                ? 'Collapse'
                                                : 'Expand'
                                        )
                                    "
                                >
                                    {{
                                        expandedSessions.length !== 0
                                            ? "Collapse"
                                            : "Expand"
                                    }}
                                    all
                                </a>
                            </div>
                            <!-- New session -->
                            <div
                                v-if="!noSessions && !loading"
                                class="container--sessions"
                            >
                                <!-- Loop through sessions -->
                                <div
                                    v-for="(session, indexed) in sessionsSorter(
                                        plan.sessions
                                    )"
                                    v-show="session.week_id === currentWeek"
                                    :id="'session-' + session.id"
                                    :key="indexed"
                                    :style="{
                                        zIndex:
                                            session.id === editSession ? 2 : 0,
                                    }"
                                    class="editor_object_complex fadeIn"
                                >
                                    <div class="session_header">
                                        <div class="right_margin">
                                            <span
                                                v-if="
                                                    session.id !== editSession
                                                "
                                                class="text--name"
                                                :class="{
                                                    newSession:
                                                        session.name ==
                                                            'Untitled' &&
                                                        !isEditingSession,
                                                }"
                                                ><b>{{ session.name }}</b></span
                                            ><br
                                                v-if="
                                                    session.id !== editSession
                                                "
                                            />
                                            <span
                                                v-if="
                                                    session.id !== editSession
                                                "
                                                class="text--tiny"
                                                >{{ day(session.date) }}</span
                                            >
                                            <span
                                                v-if="
                                                    session.id !== editSession
                                                "
                                                class="text--tiny"
                                                >{{ session.date }}</span
                                            ><br
                                                v-if="
                                                    session.id !== editSession
                                                "
                                            />
                                            <span
                                                v-if="
                                                    session.id !== editSession
                                                "
                                                :class="{
                                                    incomplete:
                                                        session.checked === 0,
                                                    completed:
                                                        session.checked === 1,
                                                }"
                                                class="text--tiny"
                                                >{{
                                                    session.checked === 0
                                                        ? "Incomplete"
                                                        : "Complete"
                                                }}</span
                                            >
                                            <input
                                                v-if="
                                                    session.id === editSession
                                                "
                                                v-model="session.name"
                                                class="session-name small_border_radius"
                                                type="text"
                                                name="session-name"
                                                pattern="[^\/]"
                                            />
                                            <input
                                                v-if="
                                                    session.id === editSession
                                                "
                                                v-model="session.date"
                                                class="session-date small_border_radius"
                                                type="date"
                                                name="session-date"
                                            />
                                        </div>
                                        <div class="header_options">
                                            <div class="slot_1">
                                                <button
                                                    v-if="
                                                        session.feedback !==
                                                            '' &&
                                                        session.feedback !==
                                                            null
                                                    "
                                                    class="feedback_button"
                                                    @click="
                                                        () => {
                                                            $store.commit(
                                                                'setData',
                                                                {
                                                                    attr: 'previewHTML',
                                                                    data: session.feedback,
                                                                }
                                                            );
                                                            $store.dispatch(
                                                                'openModal',
                                                                {
                                                                    name: 'preview',
                                                                }
                                                            );
                                                        }
                                                    "
                                                >
                                                    Feedback
                                                </button>
                                                <checkbox
                                                    :item-id="session.id"
                                                />
                                            </div>
                                            <inline-svg
                                                v-show="!isEditingSession"
                                                id="expand"
                                                class="icon--expand"
                                                :class="{
                                                    expanded:
                                                        expandedSessions.includes(
                                                            session.id
                                                        ),
                                                }"
                                                :src="
                                                    require('@/assets/svg/expand.svg')
                                                "
                                                title="Info"
                                                @click="
                                                    toggleExpandedSessions(
                                                        session.id
                                                    )
                                                "
                                            />
                                        </div>
                                    </div>
                                    <rich-editor
                                        v-show="
                                            expandedSessions.includes(
                                                session.id
                                            )
                                        "
                                        v-model="session.notes"
                                        :item-id="session.id"
                                        :week-id="currentWeek"
                                        :editing="editSession"
                                        :empty-placeholder="'What are your looking to achieve in this session? Is it for fitness, nutrition or therapy?'"
                                        :data-for-templates="templates"
                                        :force-stop="forceStop"
                                        @on-edit-change="resolveSessionEditor"
                                    />
                                </div>
                            </div>
                        </div>
                        <p v-else class="text--holder text--small grey">
                            No sessions created yet
                        </p>
                    </div>
                    <!-- sessions -->
                </div>
                <statistics :plan="plan" :show="isStatsOpen" />
            </div>
            <!-- plan_grid -->
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
const Checkbox = () =>
    import(
        /* webpackChunkName: "components.checkbox", webpackPreload: true */ "@/components/Checkbox"
    );
const WeekCalendar = () =>
    import(
        /* webpackChunkName: "components.calendar", webpackPreload: true */ "@/components/WeekCalendar"
    );
const MonthCalendar = () =>
    import(
        /* webpackChunkName: "components.calendar", webpackPreload: true */ "@/components/MonthCalendar"
    );
const RichEditor = () =>
    import(
        /* webpackChunkName: "components.richEditor", webpackPreload: true */ "@/components/Editor"
    );
const ColorPicker = () =>
    import(
        /* webpackChunkName: "components.colorPicker", webpackPrefetch: true */ "@/components/ColorPicker"
    );
const Multiselect = () =>
    import(
        /* webpackChunkName: "components.multiselect", webpackPrefetch: true */ "@/components/Multiselect"
    );
const Statistics = () =>
    import(
        /* webpackChunkName: "components.statistics", webpackPrefetch: true */ "@/components/Stats"
    );
const ProgressSessions = () =>
    import(
        /* webpackChunkName: "components.progressSessions", webpackPrefetch: true */ "@/components/ProgressSessions"
    );
const PlanOptions = () =>
    import(
        /* webpackChunkName: "components.planOptions", webpackPrefetch: true */ "./components/PlanOptions"
    );
const PlanProgressBar = () =>
    import(
        /* webpackChunkName: "components.planProgressBar", webpackPrefetch: true */ "./components/PlanProgressBar"
    );
const EditorWrapper = () =>
    import(
        /* webpackChunkName: "components.editorWrapper", webpackPreload: true  */ "@/components/generic/EditorWrapper"
    );
const Icon = () =>
    import(
        /* webpackChunkName: "components.icon", webpackPreload: true  */ "@/components/elements/Icon"
    );
const Week = () =>
    import(
        /* webpackChunkName: "components.week", webpackPreload: true  */ "./components/Week"
    );

export default {
    components: {
        Checkbox,
        WeekCalendar,
        MonthCalendar,
        RichEditor,
        ColorPicker,
        Multiselect,
        Statistics,
        ProgressSessions,
        PlanOptions,
        PlanProgressBar,
        EditorWrapper,
        Icon,
        Week,
    },
    async beforeRouteLeave(to, from, next) {
        if (
            this.dontLeave
                ? await this.$parent.$parent.$refs.confirm_pop_up.show(
                      "Your changes might not be saved",
                      "Are you sure you want to leave?"
                  )
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
            // EDIT

            forceStop: 0,
            tempEditorStore: null,
            editingPlanNotes: false,
            isEditingSession: false,
            editSession: null,

            // Feedback

            showFeedback: false,

            // SYSTEM

            noSessions: false,
            expandedSessions: [],
            force: true,
            multiselectOption: [
                { name: "Complete", svg: "check-circle" },
                { name: "Incomplete", svg: "x-circle" },
                { name: "Progress", svg: "arrow-right" },
                { name: "Duplicate", svg: "copy" },
                { name: "Move", svg: "move" },
                { name: "Shift", svg: "corner-down-right" },
                { name: "Print", svg: "printer" },
                { name: "Delete", svg: "trash" },
                { name: "Deselect", svg: null },
            ],

            // WEEK

            weekSessions: [],
            weekIsEmpty: true,
            editingWeekColor: false,

            // Modals

            showProgress: false,
            disableDuplicatePlanButton: true,

            // STATS

            isStatsOpen: false,

            // CALENDAR

            showMonthlyCal: false,
            sessionDates: [],
            forceUpdate: 0,

            // MICROCYCLE

            allowMoreWeeks: false,
            maxWeek: 2,
        };
    },
    computed: {
        plan() {
            return this.$store.getters.helper(
                "match_plan",
                this.$route.params.client_id,
                this.$route.params.id
            );
        },
        weekColor() {
            return this.plan.block_color
                .replace("[", "")
                .replace("]", "")
                .split(",");
        },
        ...mapState([
            "currentWeek",
            "selectedIds",
            "loading",
            "silentLoading",
            "dontLeave",
            "clients",
            "templates",
            "clientDetails",
        ]),
    },
    watch: {
        editingWeekColor() {
            this.updater();
        },
    },
    async created() {
        this.$store.commit("setData", {
            attr: "loading",
            data: true,
        });
        this.willBodyScroll(true);
        this.$parent.sessions = true;
        this.noSessions =
            (await this.$store.getters.helper(
                "match_plan",
                this.$route.params.client_id,
                this.$route.params.id
            ).sessions) === false;
    },
    mounted() {
        if (!this.noSessions) {
            this.updater();
        }
        this.$store.dispatch("endLoading");
    },
    beforeDestroy() {
        this.willBodyScroll(true);
    },
    methods: {
        /**
         * Resolves the actions taken from the session multi-select.
         * @param {string} res - The action taken from the multi-select.
         */
        resolve_session_multiselect(res) {
            switch (res) {
                case "Complete":
                    this.bulkCheck(1);
                    break;
                case "Incomplete":
                    this.bulkCheck(0);
                    break;
                case "Progress":
                    this.showProgress = true;
                    this.willBodyScroll(false);
                    break;
                case "Duplicate":
                    this.duplicate();
                    this.$store.commit("setData", {
                        attr: "selectedIds",
                        data: [],
                    });
                    break;
                case "Move":
                    this.$store.dispatch("openModal", {
                        name: "move",
                    });
                    break;
                case "Shift":
                    this.$store.dispatch("openModal", {
                        name: "shift",
                    });
                    break;
                case "Print":
                    this.print();
                    break;
                case "Delete":
                    this.bulkDelete();
                    this.updater();
                    break;
                case "Deselect":
                    this.$store.commit("setData", {
                        attr: "selectedIds",
                        data: [],
                    });
                    break;
            }
        },

        /**
         * Resolves the state of the plan notes editor.
         * @param {string} state - The returned state of the editor.
         */
        resolvePlanInfoEditor(state) {
            switch (state) {
                case "edit":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    this.editingPlanNotes = true;
                    this.tempEditorStore = this.plan.notes;
                    break;
                case "save":
                    this.editingPlanNotes = false;
                    this.updatePlan();
                    break;
                case "cancel":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: false,
                    });
                    this.editingPlanNotes = false;
                    this.$store.commit("updatePlanAttr", {
                        clientId: this.clientDetails.client_id,
                        planId: this.plan.id,
                        attr: "notes",
                        data: this.tempEditorStore,
                    });
                    break;
            }
        },

        /**
         * Resolves the state of the session editor.
         * @param {string} state - The returned state of the editor.
         * @param {integer} id - The id of the session.
         */
        resolveSessionEditor(state, id) {
            const SESSION = this.$store.getters.helper(
                "match_session",
                this.$route.params.client_id,
                this.$route.params.id,
                id
            );
            switch (state) {
                case "edit":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    this.isEditingSession = true;
                    this.editSession = id;
                    this.forceStop += 1;
                    this.tempEditorStore = SESSION.notes;
                    this.goToEvent(SESSION.id, SESSION.week_id);
                    break;
                case "save":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    this.isEditingSession = false;
                    this.editSession = null;
                    this.updateSession(id);
                    this.$store("openResponsePopUp", {
                        title: "Session updated",
                        description: "Your changes have been saved",
                    });
                    this.$store.dispatch("endLoading");
                    break;
                case "cancel":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: false,
                    });
                    this.isEditingSession = false;
                    this.editSession = null;
                    SESSION.notes = this.tempEditorStore;
                    break;
            }
        },

        /**
         * Duplicates the selected sessions.
         */
        async duplicate() {
            this.$store.commit("setData", {
                attr: "loading",
                data: true,
            });
            this.$store.commit("setData", {
                attr: "dontLeave",
                data: true,
            });
            const TO_DUPLICATE = [];
            const CLIENT_ID = this.$route.params.client_id;
            const PLAN_ID = this.$route.params.id;
            const SESSIONS = this.$store.getters.helper(
                "match_plan",
                CLIENT_ID,
                PLAN_ID
            ).sessions;
            this.selectedIds.forEach((sessionId) => {
                TO_DUPLICATE.push(
                    SESSIONS.find((session) => session.id === sessionId)
                );
            });
            for (const SESSION of TO_DUPLICATE) {
                await this.addSession({
                    clientId: CLIENT_ID,
                    planId: PLAN_ID,
                    sessionName: `Copy of ${SESSION.name}`,
                    sessionDate: SESSION.date,
                    sessionNotes: SESSION.notes,
                    sessionWeek: SESSION.week_id,
                });
            }
            this.checkForWeekSessions();
            this.updater();
            this.$ga.event("Session", "duplicate");
            this.$store.dispatch("openResponsePopUp", {
                title: `${
                    this.selectedIds.length > 1 ? "Sessions" : "Session"
                } duplicated`,
                description: "Get programming!",
            });
            this.$store.dispatch("endLoading");
        },

        /**
         * Opens a new tab with the print preview of all the selected sessions.
         */
        print() {
            const NOTES_ARR = [];
            this.plan.sessions.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
            this.plan.sessions.forEach((session) => {
                if (this.selectedIds.includes(session.id)) {
                    NOTES_ARR.push(
                        `<div class="session"><h2>${session.name}</h2><h3>${
                            session.date
                        }</h3><br>${this.updateHTML(session.notes, true)}</div>`
                    );
                }
            });
            const NEW_WINDOW = window.open();
            const HTML = NOTES_ARR.join("");
            NEW_WINDOW.document.write(
                `<style>body>div{font-family: Arial, Helvetica, sans-serif;padding: 5% 10%}.session{padding: 36px 0}.session:not(:last-child){border-bottom: 1px solid #282828}@media print {.close_link {display: none}}</style><div><a class="close_link" href="javascript:void(0)" onclick="window.close()">Close print/export preview</a>${HTML}</div>`
            );
            NEW_WINDOW.stop();
            NEW_WINDOW.print();
            this.$ga.event("Plan", "print");
            this.$store.commit("setData", {
                attr: "selectedIds",
                data: [],
            });
        },

        /**
         * Toggles the complete/incomplete state of the selected sessions.
         * @param {integer} boolState - The state of the session, 1 - complete, 0 - incomplete.
         */
        async bulkCheck(boolState) {
            this.$store.commit("setData", {
                attr: "dontLeave",
                data: true,
            });
            if (this.selectedIds.length !== 0) {
                if (
                    await this.$parent.$parent.$refs.confirm_pop_up.show(
                        `Are you sure that you want to ${
                            boolState === 1 ? "complete" : "incomplete"
                        } all the selected sessions?`,
                        "You can update this later if anything changes."
                    )
                ) {
                    this.plan.sessions.forEach((session) => {
                        if (this.selectedIds.includes(session.id)) {
                            this.$store.commit("updateSessionAttr", {
                                clientId: this.$route.params.client_id,
                                planId: this.$route.params.id,
                                sessionId: session.id,
                                attr: "checked",
                                data: boolState,
                            });
                        }
                    });
                    this.batchUpdateSession(this.selectedIds);
                    this.$store.dispatch("openResponsePopUp", {
                        title:
                            this.selectedIds.length > 1
                                ? "Sessions updated"
                                : "Session updated",
                        description: "Your changes have been saved",
                    });
                    this.$store.commit("setData", {
                        attr: "selectedIds",
                        data: [],
                    });
                }
            }
            this.$store.dispatch("endLoading");
        },

        /**
         * Deletes all the selected sessions.
         */
        async bulkDelete() {
            this.$store.commit("setData", {
                attr: "dontLeave",
                data: true,
            });
            if (this.selectedIds.length !== 0) {
                if (
                    await this.$parent.$parent.$refs.confirm_pop_up.show(
                        "Are you sure that you want to delete all the selected sessions?",
                        "We will remove these sessions from our database and it won't be recoverable."
                    )
                ) {
                    try {
                        await this.$store.dispatch("deleteSession", {
                            clientId: this.$route.params.client_id,
                            planId: this.$route.params.id,
                            sessionIds: this.selectedIds,
                        });
                    } catch (e) {
                        this.$store.dispatch("resolveError", e);
                    }
                    this.checkForWeekSessions();
                    this.$store.commit("setData", {
                        attr: "selectedIds",
                        data: [],
                    });
                    this.expandAll("Collapse");
                    this.updater();
                    this.$ga.event("Session", "delete");
                    this.$store.dispatch("openResponsePopUp", {
                        title:
                            this.selectedIds.length > 1
                                ? "Sessions deleted"
                                : "Session deleted",
                        description: "Your changes have been saved",
                    });
                    this.$store.dispatch("endLoading");
                }
            }
            this.$store.dispatch("endLoading");
        },

        /**
         * Selects all the sessions in the plan or week.
         * @param mode - To select all session or all sessions in the current week ('all' or 'week').
         */
        selectAll(mode) {
            this.$store.commit("setData", {
                attr: "selectedIds",
                data: this.plan.sessions
                    .filter((session) =>
                        mode === "all"
                            ? true
                            : session.week_id === this.currentWeek
                    )
                    .map((session) => session.id),
            });
        },

        /**
         * Creates a new session.
         */
        async createNewSession() {
            this.$store.commit("setData", {
                attr: "dontLeave",
                data: true,
            });
            const NEW_SESSION_ID = await this.addSession({
                clientId: this.$route.params.client_id,
                planId: this.$route.params.id,
                sessionName: "Untitled",
                sessionDate: this.today(),
                sessionNotes: "",
                sessionWeek: this.currentWeek,
            });
            this.checkForWeekSessions();
            this.updater();
            this.goToEvent(NEW_SESSION_ID, this.currentWeek);
            this.$ga.event("Session", "new");
            this.$store.dispatch("openResponsePopUp", {
                title: "New session added",
                description: "Get programming!",
            });
            this.$store.dispatch("endLoading");
        },

        // -----------------------------
        // Misc
        // -----------------------------

        /**
         * Scrolls to session.
         * @param {integer} id - The id of the session.
         * @param {integer} week - The week containing the session.
         */
        goToEvent(id, week) {
            this.expandAll("Expand");
            this.commit("setData", {
                attr: "currentWeek",
                data: week,
            });
            setTimeout(() => {
                document
                    .getElementById(`session-${id}`)
                    .scrollIntoView({ behavior: "smooth" });
            }, 100);
        },

        /**
         * Checks if the current week has sessions.
         */
        checkForWeekSessions() {
            let arr = 0;
            const SESSIONS = this.$store.getters.helper(
                "match_plan",
                this.$route.params.client_id,
                this.$route.params.id
            ).sessions;
            this.noSessions = SESSIONS === false;
            if (SESSIONS && !this.noSessions) {
                SESSIONS.forEach((session) => {
                    if (session.week_id === this.currentWeek) {
                        arr += 1;
                        this.weekSessions.push(session.id);
                    }
                });
            }
            this.weekIsEmpty = arr === 0;
        },

        /**
         * Expands the main body of the targetted session.
         * @param {integer} id - The id of the session.
         */
        toggleExpandedSessions(id) {
            if (this.expandedSessions.includes(id)) {
                const INDEX = this.expandedSessions.indexOf(id);
                if (INDEX > -1) {
                    this.expandedSessions.splice(INDEX, 1);
                }
            } else {
                this.expandedSessions.push(id);
            }
        },

        /**
         * Updates the week color.
         */
        updateSessionColor() {
            this.$store.commit("updatePlanAttr", {
                clientId: this.clientDetails.client_id,
                planId: this.plan.id,
                attr: "block_color",
                data: JSON.stringify(this.weekColor)
                    .replace(/"/g, "")
                    .replace(/[[\]]/g, "")
                    .replace(/\//g, ""),
            });
            this.editingWeekColor = false;
            this.updatePlan();
        },

        /**
         * Switch to a different week.
         * @param {integer} - The id of the week.
         */
        changeWeek(weekID) {
            this.commit("setData", {
                attr: "currentWeek",
                data: week,
            });
            this.moveTarget = weekID;
            this.checkForWeekSessions();
        },

        /**
         * Returns the duration of the plan as an array to be iterated.
         * @param {integer} duration - The length of the plan.
         * @returns The duration array.
         */
        planDuration(duration) {
            const ARR = [];
            let i;
            for (i = 1; i < parseInt(duration, 10) + 1; i++) {
                ARR.push(i);
            }
            return ARR;
        },

        /**
         * Sorts the session.
         * @param {array} data - The sessions array to be sorted.
         * @returns The sorted sessions array.
         */
        sessionsSorter(data) {
            data = data.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
            return data;
        },

        /**
         * Updates the state of the plan page to show the correct data.
         */
        updater() {
            this.sessionDates = [];
            if (this.plan.sessions) {
                for (const SESSION of this.plan.sessions) {
                    this.sessionDates.push({
                        title: SESSION.name,
                        date: SESSION.date,
                        color: this.weekColor[SESSION.week_id - 1],
                        textColor: this.accessible_colors(
                            this.weekColor[SESSION.week_id - 1]
                        ),
                        week_id: SESSION.week_id,
                        session_id: SESSION.id,
                    });
                }
            }
            this.maxWeek = parseInt(this.plan.duration);
        },

        /**
         * Expand or unexpand all sessions.
         * @param {string} toExpand - Whether to expand or unexpand.
         */
        expandAll(toExpand) {
            try {
                if (Array.isArray(this.plan.sessions)) {
                    if (this.plan.sessions.length !== 0) {
                        this.plan.sessions.forEach((session) => {
                            if (toExpand === "Expand") {
                                this.expandedSessions.push(session.id);
                            } else {
                                let x = 0;
                                const Y = this.expandedSessions.length;
                                for (; x < Y; x++) {
                                    this.expandedSessions.pop();
                                }
                            }
                        });
                    }
                }
            } catch (e) {
                console.error(e);
            }
        },

        /**
         * Updates the details of the plan.
         */
        async updatePlan() {
            try {
                this.$store.commit("setData", {
                    attr: "loading",
                    data: true,
                });
                await this.$store.dispatch("updatePlan", this.plan);
                this.$ga.event("Plan", "update");
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /**
         * Updates the selected sessions.
         * @param {array} sessionIds - The ids of the sessions.
         */
        async batchUpdateSession(sessionIds) {
            try {
                await this.$store.dispatch("batchUpdateSession", {
                    clientId: this.$route.params.client_id,
                    planId: this.$route.params.id,
                    sessionIds,
                });
                this.$ga.event("Session", "update");
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /**
         * Updates a single session.
         * @param {integer} sessionId - The id of the session.
         */
        async updateSession(sessionId) {
            try {
                await this.$store.dispatch("updateSession", {
                    clientId: this.$route.params.client_id,
                    planId: this.$route.params.id,
                    sessionId,
                });
                this.$ga.event("Session", "update");
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /**
         * Creates a new session with our without existing data.
         * @param {object} data - Pre-existing session data.
         * @returns The id of the new session.
         */
        async addSession(data) {
            try {
                const NEW_SESSION_ID = await this.$store.dispatch(
                    "addSession",
                    {
                        client_id: parseInt(data.clientId),
                        data: {
                            programme_id: parseInt(data.planId),
                            name: data.sessionName,
                            date: data.sessionDate,
                            notes: data.sessionNotes,
                            week_id: data.sessionWeek,
                        },
                    }
                );
                return NEW_SESSION_ID;
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>
