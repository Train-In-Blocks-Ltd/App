<template>
    <div id="plan">
        <multiselect
            type="session"
            :options="multiselectOption"
            @response="handleMultiselectResponse"
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
                    :on-blur="() => useUpdatePlanMutation()"
                    @output="(data) => (plan.name = data)"
                />

                <plan-progress-bar
                    v-if="hasSessions"
                    class="mt-4"
                    :sessions="plan.sessions"
                />
                <plan-options class="mt-4" />
            </div>

            <!-- Plan notes -->
            <label-wrapper title="Plan Notes" class="my-16">
                <rich-editor
                    v-model="plan.notes"
                    :item-id="'plan_notes'"
                    :editing="editSession"
                    :empty-placeholder="'What do you want to achieve in this plan?'"
                    :force-stop="forceStop"
                    @on-edit-change="handlePlanNotesChange"
                />
            </label-wrapper>

            <!-- Calendar -->
            <div>
                <!-- Type toggle -->
                <a
                    class="hidden sm:flex items-center mb-4"
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
                />
                <month-calendar
                    v-else
                    :events="sessionDates"
                    :force-update="forceUpdate"
                    :is-trainer="true"
                />
            </div>

            <!-- Microcycle table -->
            <div class="my-16">
                <div>
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
                        :on-blur="() => useUpdatePlanMutation()"
                        @output="(data) => (plan.duration = data)"
                    />

                    <!-- Week table -->
                    <div class="flex mb-4">
                        <week
                            v-for="weekNumber in planDuration(plan.duration)"
                            :class="{
                                'mr-2': weekNumber !== plan.duration,
                            }"
                            :key="weekNumber"
                            :week-number="weekNumber"
                            :week-color="weekColor"
                            :current-week="currentWeek"
                            :plan="plan"
                        />
                    </div>
                </div>

                <!-- Sessions section -->
                <div class="mt-12">
                    <!-- Options -->
                    <div
                        v-if="loading"
                        class="skeleton-box animate-pulse p-4 mb-8"
                    >
                        <div class="skeleton-item w-1/3" />
                        <div class="skeleton-item w-2/3" />
                        <div class="skeleton-item w-5/12" />
                        <div class="skeleton-item w-1/2" />
                        <div class="skeleton-item w-1/4" />
                    </div>
                    <div v-else>
                        <div class="flex items-center justify-between mb-4">
                            <!-- Left side -->
                            <div class="flex items-center">
                                <a
                                    v-if="
                                        hasSessions &&
                                        selectedIds.length <
                                            plan.sessions.length &&
                                        !weekIsEmpty
                                    "
                                    href="javascript:void(0)"
                                    class="mr-4 text-sm"
                                    @click="selectAll('week')"
                                >
                                    Select this microcycle
                                </a>
                                <a
                                    v-if="
                                        hasSessions &&
                                        selectedIds.length <
                                            plan.sessions.length
                                    "
                                    href="javascript:void(0)"
                                    class="mr-4 text-sm"
                                    @click="selectAll('all')"
                                >
                                    Select all
                                </a>
                                <a
                                    v-if="hasSessions && !isEditingSession"
                                    href="javascript:void(0)"
                                    class="mr-4 text-sm"
                                    @click="
                                        toggleExpandAll(
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

                            <!-- Right side  -->
                            <div class="flex items-center">
                                <color-picker
                                    :plan="plan"
                                    :week-color="weekColor"
                                    :current-week="currentWeek"
                                    @output="
                                        (data) => {
                                            weekColor[currentWeek - 1] = data;
                                            useUpdateWeekColorMutation();
                                        }
                                    "
                                />
                                <icon-button
                                    svg="info"
                                    :on-click="
                                        () => {
                                            $store.commit('SET_DATA', {
                                                attr: 'previewHTML',
                                                data: '<p><b>[ </b><i>Exercise Name</i><b>:</b> <i>Sets</i> <b>x</b> <i>Reps</i> <b>at</b> <i>Load</i> <b>]</b></p><br> <p><b>Examples</b></p><p><i>[Back Squat: 3x6 at 50kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50kg]</i></p> <p><i>[Back Squat: 3x6 at 50/55/60kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50/55/60kg]</i></p><br><hr><br><p><b>[ </b><i>Measurement</i><b>:</b> <i>Value</i> <b>]</b></p><br><p><b>Examples</b></p><p><i>[Weight: 50kg]</i></p> <p><i>[Vertical Jump: 43.3cm]</i></p> <p><i>[Body Fat (%): 12]</i></p> <p><i>[sRPE (CR10): 8]</i></p> <p><i>[sRPE (Borg): 16]</i></p><br> <p>See <i>Help</i> for more information</p><br>',
                                            });
                                            $store.dispatch('openModal', {
                                                name: 'info',
                                            });
                                        }
                                    "
                                    :icon-size="28"
                                    class="mr-4"
                                />
                                <icon-button
                                    svg="plus"
                                    :on-click="() => createNewSession()"
                                    :icon-size="28"
                                />
                            </div>
                        </div>

                        <!-- Sessions list -->
                        <div
                            v-if="hasSessions && !weekIsEmpty && !loading"
                            class="grid gap-8"
                        >
                            <!-- Session -->
                            <card-wrapper
                                v-for="(
                                    session, sessionIndex
                                ) in plan.sessions.sort(
                                    (a, b) =>
                                        new Date(a.date) - new Date(b.date)
                                )"
                                v-show="session.week_id === currentWeek"
                                :id="'session-' + session.id"
                                :key="`session-${sessionIndex}`"
                                class="p-4 sm:p-8"
                                no-hover
                            >
                                <div class="flex justify-between">
                                    <!-- Preview state header -->
                                    <div v-if="session.id !== editSession">
                                        <txt
                                            :class="{
                                                'text-red-700':
                                                    session.name == 'Untitled',
                                            }"
                                            bold
                                            >{{ session.name }}</txt
                                        >
                                        <txt type="tiny"
                                            >{{ day(session.date) }}
                                            {{ session.date }}</txt
                                        >
                                        <txt
                                            type="tiny"
                                            :class="
                                                session.checked === 1
                                                    ? 'text-green-700'
                                                    : 'text-red-700'
                                            "
                                            >{{
                                                session.checked === 0
                                                    ? "Incomplete"
                                                    : "Complete"
                                            }}</txt
                                        >
                                    </div>

                                    <!-- Edit state header -->
                                    <div
                                        v-else
                                        class="grid gap-2 w-full max-w-sm mr-4"
                                    >
                                        <txt-input
                                            name="session-name"
                                            type="text"
                                            pattern="[^\/]"
                                            class="w-full"
                                            :value="session.name"
                                            @output="
                                                (data) => (session.name = data)
                                            "
                                        />
                                        <txt-input
                                            type="date"
                                            name="session-date"
                                            :value="session.date"
                                            @output="
                                                (data) => (session.date = data)
                                            "
                                        />
                                    </div>

                                    <div class="flex">
                                        <!-- Feedback button -->
                                        <a
                                            v-if="
                                                session.feedback !== '' &&
                                                session.feedback !== null
                                            "
                                            class="mr-4 hover:opacity-60 transition-opacity cursor-pointer"
                                            @click="
                                                () => {
                                                    $store.commit('SET_DATA', {
                                                        attr: 'previewHTML',
                                                        data: session.feedback,
                                                    });
                                                    $store.dispatch(
                                                        'openModal',
                                                        {
                                                            name: 'preview',
                                                        }
                                                    );
                                                }
                                            "
                                            ><txt type="tiny" bold
                                                >Feedback</txt
                                            ></a
                                        >

                                        <!-- Checkbox and expand -->
                                        <div class="flex flex-col items-center">
                                            <checkbox :item-id="session.id" />
                                            <icon-button
                                                v-if="!isEditingSession"
                                                svg="chevron-down"
                                                class="ml-auto mt-2 transform transition-transform"
                                                :class="{
                                                    'rotate-180':
                                                        expandedSessions.includes(
                                                            session.id
                                                        ),
                                                }"
                                                :icon-size="28"
                                                :on-click="
                                                    () =>
                                                        toggleExpandedSessions(
                                                            session.id
                                                        )
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>

                                <!-- Editor -->
                                <rich-editor
                                    v-show="
                                        expandedSessions.includes(session.id)
                                    "
                                    v-model="session.notes"
                                    :item-id="session.id"
                                    :week-id="currentWeek"
                                    :editing="editSession"
                                    :empty-placeholder="'What are your looking to achieve in this session? Is it for fitness, nutrition or therapy?'"
                                    :force-stop="forceStop"
                                    @on-edit-change="handleSessionNotesChange"
                                    templates
                                />
                            </card-wrapper>
                        </div>
                        <txt v-else type="large-body" grey>
                            No sessions in this microcycle yet
                        </txt>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

const Checkbox = () =>
    import(
        /* webpackChunkName: "components.checkbox", webpackPreload: true */ "@/components/generic/Checkbox"
    );
const WeekCalendar = () =>
    import(
        /* webpackChunkName: "components.calendar", webpackPreload: true */ "@/components/generic/WeekCalendar"
    );
const MonthCalendar = () =>
    import(
        /* webpackChunkName: "components.calendar", webpackPreload: true */ "@/components/generic/MonthCalendar"
    );
const ColorPicker = () =>
    import(
        /* webpackChunkName: "components.colorPicker", webpackPrefetch: true */ "@/components/generic/ColorPicker"
    );
const Multiselect = () =>
    import(
        /* webpackChunkName: "components.multiselect", webpackPrefetch: true */ "@/components/generic/Multiselect"
    );
const PlanOptions = () =>
    import(
        /* webpackChunkName: "components.planOptions", webpackPrefetch: true */ "./components/PlanOptions"
    );
const PlanProgressBar = () =>
    import(
        /* webpackChunkName: "components.planProgressBar", webpackPrefetch: true */ "./components/PlanProgressBar"
    );
const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "@/components/generic/LabelWrapper"
    );
const Week = () =>
    import(
        /* webpackChunkName: "components.week", webpackPreload: true  */ "./components/Week"
    );
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );

export default {
    components: {
        Checkbox,
        WeekCalendar,
        MonthCalendar,
        ColorPicker,
        Multiselect,
        PlanOptions,
        PlanProgressBar,
        LabelWrapper,
        Week,
        CardWrapper,
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
            this.$store.dispatch("setLoading", {
                dontLeave: false,
            });
            next();
        }
    },
    data() {
        return {
            // EDIT

            forceStop: 0,
            tempEditorStore: null,
            isEditingSession: false,
            editSession: null,

            // Feedback

            showFeedback: false,

            // SYSTEM

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
            weekColor: [],

            // CALENDAR

            showMonthlyCal: false,
            sessionDates: [],
            forceUpdate: 0,

            // MICROCYCLE

            allowMoreWeeks: false,
        };
    },
    computed: {
        hasSessions() {
            return this.plan.sessions && this.plan.sessions.length > 0;
        },
        plan() {
            return this.$store.getters.helper(
                "match_plan",
                this.$route.params.client_id,
                this.$route.params.id
            );
        },
        weekIsEmpty() {
            if (!this.plan.sessions) return [];
            return (
                this.plan.sessions.filter(
                    (session) => session.week_id === this.currentWeek
                ).length === 0
            );
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
    created() {
        this.loadPlanData();
    },
    methods: {
        /** Loads new data into the plan. */
        loadPlanData() {
            this.__getWeekColor();
            this.__getCalendarSessions();
        },

        /** Gets the week colors. */
        __getWeekColor() {
            this.weekColor = this.plan.block_color
                .replace("[", "")
                .replace("]", "")
                .split(",");
        },

        /** Updates calendar events. */
        __getCalendarSessions() {
            if (!this.plan.sessions) return [];

            this.sessionDates = this.plan.sessions
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((session) => {
                    return {
                        title: session.name,
                        date: session.date,
                        color: this.weekColor[session.week_id - 1],
                        textColor: this.accessible_colors(
                            this.weekColor[session.week_id - 1]
                        ),
                        week_id: session.week_id,
                        session_id: session.id,
                    };
                });
        },

        /** Resolves the actions taken from the session multi-select. */
        handleMultiselectResponse(res) {
            switch (res) {
                case "Complete":
                    this.useUpdateCheckedMutation(1);
                    break;
                case "Incomplete":
                    this.useUpdateCheckedMutation(0);
                    break;
                case "Progress":
                    this.$store.dispatch("openModal", {
                        name: "progress",
                    });
                    break;
                case "Duplicate":
                    this.duplicate();
                    this.$store.commit("SET_DATA", {
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
                    this.useDeleteSessionMutation();
                    break;
                case "Deselect":
                    this.$store.commit("SET_DATA", {
                        attr: "selectedIds",
                        data: [],
                    });
                    break;
            }
        },

        /** Resolves the state of the plan notes editor. */
        handlePlanNotesChange(state) {
            switch (state) {
                case "edit":
                    this.$store.dispatch("setLoading", {
                        dontLeave: true,
                    });
                    this.tempEditorStore = this.plan.notes;
                    break;
                case "save":
                    this.useUpdatePlanMutation();
                    break;
                case "cancel":
                    this.$store.dispatch("setLoading", {
                        dontLeave: false,
                    });
                    this.$store.commit("updatePlanAttr", {
                        clientId: this.clientDetails.client_id,
                        planId: this.plan.id,
                        attr: "notes",
                        data: this.tempEditorStore,
                    });
                    break;
            }
        },

        /** Resolves the state of the session editor. */
        handleSessionNotesChange(state, id) {
            const SESSION = this.$store.getters.helper(
                "match_session",
                this.$route.params.client_id,
                this.$route.params.id,
                id
            );
            switch (state) {
                case "edit":
                    this.$store.dispatch("setLoading", {
                        dontLeave: true,
                    });
                    this.isEditingSession = true;
                    this.editSession = id;
                    this.forceStop += 1;
                    this.tempEditorStore = SESSION.notes;
                    this.goToEvent(SESSION.id, SESSION.week_id);
                    break;
                case "save":
                    this.$store.dispatch("setLoading", {
                        dontLeave: true,
                    });
                    this.isEditingSession = false;
                    this.editSession = null;
                    this.useUpdateSessionMutation(id);
                    this.$store.dispatch("openResponsePopUp", {
                        title: "Session updated",
                        description: "Your changes have been saved",
                    });
                    this.$store.dispatch("setLoading", false);
                    break;
                case "cancel":
                    this.$store.dispatch("setLoading", {
                        dontLeave: false,
                    });
                    this.isEditingSession = false;
                    this.editSession = null;
                    SESSION.notes = this.tempEditorStore;
                    break;
            }
        },

        /** Duplicates the selected sessions. */
        async duplicate() {
            this.$store.dispatch("setLoading", {
                loading: true,
                dontLeave: true,
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
                await this.useCreateSessionMutation({
                    clientId: CLIENT_ID,
                    planId: PLAN_ID,
                    sessionName: `Copy of ${SESSION.name}`,
                    sessionDate: SESSION.date,
                    sessionNotes: SESSION.notes,
                    sessionWeek: SESSION.week_id,
                });
            }
            this.$ga.event("Session", "duplicate");
            this.$store.dispatch("openResponsePopUp", {
                title: `${
                    this.selectedIds.length > 1 ? "Sessions" : "Session"
                } duplicated`,
                description: "Get programming!",
            });
            this.$store.dispatch("setLoading", false);
        },

        /** Opens a new tab with the print preview of all the selected sessions. */
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
            this.$store.commit("SET_DATA", {
                attr: "selectedIds",
                data: [],
            });
        },

        /** Toggles the complete/incomplete state of the selected sessions. */
        async useUpdateCheckedMutation(boolState) {
            this.$store.dispatch("setLoading", {
                dontLeave: true,
            });
            if (this.selectedIds.length !== 0) {
                if (
                    await this.$store.dispatch("openConfirmPopUp", {
                        title: `Are you sure that you want to ${
                            boolState === 1 ? "complete" : "incomplete"
                        } all the selected sessions?`,
                        text: "You can update this later if anything changes.",
                    })
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
                    this.useUpdateSessionsMutation(this.selectedIds);
                    this.$store.dispatch("openResponsePopUp", {
                        title:
                            this.selectedIds.length > 1
                                ? "Sessions updated"
                                : "Session updated",
                        description: "Your changes have been saved",
                    });
                    this.$store.commit("SET_DATA", {
                        attr: "selectedIds",
                        data: [],
                    });
                }
            }
            this.$store.dispatch("setLoading", false);
        },

        /** Deletes all the selected sessions. */
        async useDeleteSessionMutation() {
            this.$store.dispatch("setLoading", {
                dontLeave: true,
            });
            if (this.selectedIds.length !== 0) {
                if (
                    await this.$store.dispatch("openConfirmPopUp", {
                        title: "Are you sure that you want to delete all the selected sessions?",
                        text: "We will remove these sessions from our database and it won't be recoverable.",
                    })
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
                    this.$store.commit("SET_DATA", {
                        attr: "selectedIds",
                        data: [],
                    });
                    this.toggleExpandAll("Collapse");
                    this.$ga.event("Session", "delete");
                    this.$store.dispatch("openResponsePopUp", {
                        title:
                            this.selectedIds.length > 1
                                ? "Sessions deleted"
                                : "Session deleted",
                        description: "Your changes have been saved",
                    });
                    this.$store.dispatch("setLoading", false);
                }
            }
            this.$store.dispatch("setLoading", false);
        },

        /** Selects all the sessions in the plan or week. */
        selectAll(mode) {
            this.$store.commit("SET_DATA", {
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

        /** Creates a new session. */
        async createNewSession() {
            this.$store.dispatch("setLoading", {
                dontLeave: true,
            });
            const NEW_SESSION_ID = await this.useCreateSessionMutation({
                clientId: this.$route.params.client_id,
                planId: this.$route.params.id,
                sessionName: "Untitled",
                sessionDate: this.today(),
                sessionNotes: "",
                sessionWeek: this.currentWeek,
            });
            this.goToEvent(NEW_SESSION_ID, this.currentWeek);
            this.$ga.event("Session", "new");
            this.$store.dispatch("openResponsePopUp", {
                title: "New session added",
                description: "Get programming!",
            });
            this.$store.dispatch("setLoading", false);
        },

        /** Scrolls to session. */
        goToEvent(id, week) {
            this.toggleExpandAll("Expand");
            this.$store.commit("SET_DATA", {
                attr: "currentWeek",
                data: week,
            });
            setTimeout(() => {
                document
                    .getElementById(`session-${id}`)
                    .scrollIntoView({ behavior: "smooth" });
            }, 100);
        },

        /** Expands the main body of the targetted session. */
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

        /** Switch to a different week. */
        changeWeek(weekID) {
            this.$store.commit("SET_DATA", {
                attr: "currentWeek",
                data: week,
            });
            this.moveTarget = weekID;
        },

        /** Returns the duration of the plan as an array to be iterated. */
        planDuration(duration) {
            const ARR = [];
            let i;
            for (i = 1; i < parseInt(duration, 10) + 1; i++) {
                ARR.push(i);
            }
            return ARR;
        },

        /** Expand or de-expand all sessions. */
        toggleExpandAll(toExpand) {
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

        /** Updates the details of the plan. */
        async useUpdatePlanMutation() {
            try {
                this.$store.dispatch("setLoading", {
                    loading: true,
                });
                await this.$store.dispatch("updatePlan", this.plan);
                this.loadPlanData();
                this.$ga.event("Plan", "update");
                this.$store.dispatch("setLoading", false);
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /** Updates the selected sessions. */
        async useUpdateSessionsMutation(sessionIds) {
            try {
                await this.$store.dispatch("batchUpdateSession", {
                    clientId: this.$route.params.client_id,
                    planId: this.$route.params.id,
                    sessionIds,
                });
                this.loadPlanData();
                this.$ga.event("Session", "update");
                this.$store.dispatch("setLoading", false);
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /** Updates a single session. */
        async useUpdateSessionMutation(sessionId) {
            try {
                await this.$store.dispatch("updateSession", {
                    clientId: this.$route.params.client_id,
                    planId: this.$route.params.id,
                    sessionId,
                });
                this.loadPlanData();
                this.$ga.event("Session", "update");
                this.$store.dispatch("setLoading", false);
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /** Creates a new session with our without existing data. */
        async useCreateSessionMutation(data) {
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
                this.loadPlanData();
                return NEW_SESSION_ID;
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /** Updates the week color. */
        async useUpdateWeekColorMutation() {
            this.$store.dispatch("updatePlanAttr", {
                clientId: this.clientDetails.client_id,
                planId: this.plan.id,
                attr: "block_color",
                data: JSON.stringify(this.weekColor)
                    .replace(/"/g, "")
                    .replace(/[[\]]/g, "")
                    .replace(/\//g, ""),
            });
            try {
                await this.$store.dispatch("updatePlan", this.plan);
                this.loadPlanData();
            } catch {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>
