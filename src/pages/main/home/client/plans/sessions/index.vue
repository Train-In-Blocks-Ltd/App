<template>
    <div id="plan" class="mt-16">
        <multiselect
            type="session"
            :options="multiselectOption"
            @response="handleMultiselectResponse"
        />
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
                :placeholder="'What do you want to achieve in this plan?'"
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
                :aria-label="`Switch to ${
                    !showMonthlyCal ? 'month' : 'week'
                } view`"
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
                :is-trainer="true"
                :on-event-press="goToEvent"
            />
            <month-calendar
                v-else
                :events="sessionDates"
                :is-trainer="true"
                :on-event-press="goToEvent"
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
                <div v-if="loading" class="skeleton-box animate-pulse p-4 mb-8">
                    <div class="skeleton-item w-1/3" />
                    <div class="skeleton-item w-2/3" />
                    <div class="skeleton-item w-5/12" />
                    <div class="skeleton-item w-1/2" />
                    <div class="skeleton-item w-1/4" />
                </div>
                <div v-else>
                    <div class="flex items-center justify-between mb-8 sm:mb-4">
                        <!-- Left side -->
                        <div
                            class="grid gap-2 sm:gap-0 sm:flex sm:items-center"
                        >
                            <a
                                v-if="
                                    hasSessions &&
                                    selectedIds.length < plan.sessions.length &&
                                    !weekIsEmpty
                                "
                                href="javascript:void(0)"
                                aria-label="Select microcycle"
                                class="mr-4 text-sm"
                                @click="selectAll('week')"
                            >
                                Select microcycle
                            </a>
                            <a
                                v-if="
                                    hasSessions &&
                                    selectedIds.length < plan.sessions.length
                                "
                                href="javascript:void(0)"
                                aria-label="Select all"
                                class="mr-4 text-sm"
                                @click="selectAll('all')"
                            >
                                Select all
                            </a>
                            <a
                                v-if="hasSessions && !isEditingSession"
                                href="javascript:void(0)"
                                :aria-label="
                                    expandedSessions.length !== 0
                                        ? 'Collapse'
                                        : 'Expand'
                                "
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
                                :on-click="handleOpenInfo"
                                :icon-size="28"
                                class="mr-4"
                                aria-label="Info"
                                title="Info"
                            />
                            <icon-button
                                svg="plus"
                                :on-click="() => createNewSession()"
                                :icon-size="28"
                                aria-label="New session"
                                title="New session"
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
                            v-for="(session, sessionIndex) in plan.sessions"
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
                                            () =>
                                                handleOpenFeedback(
                                                    session.feedback
                                                )
                                        "
                                        ><txt type="tiny" bold>Feedback</txt></a
                                    >

                                    <!-- Checkbox and expand -->
                                    <div class="flex flex-col items-center">
                                        <checkbox
                                            v-if="!isDemo"
                                            :item-id="session.id"
                                            class="mb-2"
                                        />
                                        <icon-button
                                            v-if="!isEditingSession"
                                            :svg="
                                                expandedSessions.includes(
                                                    session.id
                                                )
                                                    ? 'corner-right-up'
                                                    : 'corner-right-down'
                                            "
                                            class="ml-auto"
                                            :icon-size="20"
                                            :on-click="
                                                () =>
                                                    toggleExpandedSessions(
                                                        session.id
                                                    )
                                            "
                                            aria-label="Expand"
                                            title="Expand"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Editor -->
                            <rich-editor
                                v-show="expandedSessions.includes(session.id)"
                                v-model="session.notes"
                                :item-id="session.id"
                                :editing="editSession"
                                :placeholder="'What are your looking to achieve in this session? Is it for fitness, nutrition or therapy?'"
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
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import appState from "../../../../../../store/modules/appState";
import clientsStore from "../../../../../../store/modules/clients";
import planStore from "../../../../../../store/modules/plan";
import utilsStore from "../../../../../../store/modules/utils";
import clientStore from "../../../../../../store/modules/client";
import { NavigationGuardNext, Route } from "vue-router";
import {
    EditorState,
    MultiselectOption,
    Session as SessionType,
} from "../../../../../../store/modules/types";
import GeneralMixins from "../../../../../..//generalMixins";

const Checkbox = () =>
    import(
        /* webpackChunkName: "components.checkbox", webpackPreload: true */ "../../../../../../components/generic/Checkbox.vue"
    );
const WeekCalendar = () =>
    import(
        /* webpackChunkName: "components.calendar", webpackPreload: true */ "../../../../../../components/generic/WeekCalendar.vue"
    );
const MonthCalendar = () =>
    import(
        /* webpackChunkName: "components.calendar", webpackPreload: true */ "../../../../../../components/generic/MonthCalendar.vue"
    );
const ColorPicker = () =>
    import(
        /* webpackChunkName: "components.colorPicker", webpackPrefetch: true */ "../../../../../../components/generic/ColorPicker.vue"
    );
const Multiselect = () =>
    import(
        /* webpackChunkName: "components.multiselect", webpackPrefetch: true */ "../../../../../../components/generic/Multiselect.vue"
    );
const PlanOptions = () =>
    import(
        /* webpackChunkName: "components.planOptions", webpackPrefetch: true */ "./components/PlanOptions.vue"
    );
const PlanProgressBar = () =>
    import(
        /* webpackChunkName: "components.planProgressBar", webpackPrefetch: true */ "./components/PlanProgressBar.vue"
    );
const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "../../../../../../components/generic/LabelWrapper.vue"
    );
const Week = () =>
    import(
        /* webpackChunkName: "components.week", webpackPreload: true  */ "./components/Week.vue"
    );
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "../../../../../../components/generic/CardWrapper.vue"
    );

@Component({
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
})
export default class Session extends Mixins(GeneralMixins) {
    get plan() {
        return planStore.plan;
    }
    set plan(value) {
        planStore.setPlan(value);
    }
    get hasSessions() {
        return planStore.plan?.sessions && planStore.plan.sessions.length > 0;
    }
    get weekIsEmpty() {
        if (!planStore.plan?.sessions) return [];
        return (
            planStore.plan?.sessions.filter(
                (session) => session.week_id === this.currentWeek
            ).length === 0
        );
    }
    get currentWeek() {
        return planStore.currentWeek;
    }
    get selectedIds() {
        return utilsStore.selectedIds;
    }
    get loading() {
        return appState.loading;
    }
    get silentLoading() {
        return appState.silentLoading;
    }
    get dontLeave() {
        return appState.dontLeave;
    }
    get clients() {
        return clientsStore.clients;
    }
    get clientDetails() {
        return clientStore.clientDetails;
    }
    get isDemo() {
        return appState.isDemo;
    }

    forceStop: number = 0;
    tempEditorStore: string | null = "";
    isEditingSession: boolean = false;
    editSession: number | null = null;

    // SYSTEM

    expandedSessions: number[] = [];
    multiselectOption: MultiselectOption[] = [
        { name: "Complete", svg: "check-circle" },
        { name: "Incomplete", svg: "x-circle" },
        { name: "Progress", svg: "arrow-right" },
        { name: "Duplicate", svg: "copy" },
        { name: "Move", svg: "move" },
        { name: "Shift", svg: "corner-down-right" },
        { name: "Print", svg: "printer" },
        { name: "Delete", svg: "trash" },
        { name: "Deselect", svg: undefined },
    ];

    // WEEK

    weekSessions: number[] = [];
    weekColor: string[] = [];

    // CALENDAR

    showMonthlyCal: boolean = false;
    sessionDates: any[] = [];

    // MICROCYCLE

    allowMoreWeeks: boolean = false;

    async beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext) {
        if (
            this.dontLeave
                ? await utilsStore.confirmPopUpRef?.open({
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            appState.setDontLeave(true);
            next();
        }
    }

    created() {
        planStore.setCurrentPlan(parseInt(this.$route.params.id));
    }

    /** Loads new data into the plan. */
    loadPlanData() {
        this.__getWeekColor();
        this.__getCalendarSessions();
    }

    /** Gets the week colors. */
    __getWeekColor() {
        this.weekColor =
            this.plan?.block_color
                .replace("[", "")
                .replace("]", "")
                .split(",") ?? [];
    }

    /** Updates calendar events. */
    __getCalendarSessions() {
        if (!this.plan?.sessions) return [];

        this.sessionDates = this.plan.sessions
            // @ts-expect-error
            .sort((a, b) => new Date(a.date) < new Date(b.date))
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
    }

    handleOpenInfo() {
        utilsStore.openModal({
            name: "info",
            previewHTML:
                "<p><b>[ </b><i>Exercise Name</i><b>:</b> <i>Sets</i> <b>x</b> <i>Reps</i> <b>at</b> <i>Load</i> <b>]</b></p><br> <p><b>Examples</b></p><p><i>[Back Squat: 3x6 at 50kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50kg]</i></p> <p><i>[Back Squat: 3x6 at 50/55/60kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50/55/60kg]</i></p><br><hr><br><p><b>[ </b><i>Measurement</i><b>:</b> <i>Value</i> <b>]</b></p><br><p><b>Examples</b></p><p><i>[Weight: 50kg]</i></p> <p><i>[Vertical Jump: 43.3cm]</i></p> <p><i>[Body Fat (%): 12]</i></p> <p><i>[sRPE (CR10): 8]</i></p> <p><i>[sRPE (Borg): 16]</i></p><br> <p>See <i>Help</i> for more information</p><br>",
        });
    }

    handleOpenFeedback(previewHTML: string) {
        utilsStore.openModal({
            name: "preview",
            previewTitle: "Feedback",
            previewHTML,
        });
    }

    /** Resolves the actions taken from the session multi-select. */
    handleMultiselectResponse(res: string) {
        switch (res) {
            case "Complete":
                this.useUpdateCheckedMutation(1);
                break;
            case "Incomplete":
                this.useUpdateCheckedMutation(0);
                break;
            case "Progress":
                utilsStore.openModal({
                    name: "progress",
                });
                break;
            case "Duplicate":
                this.duplicate();
                utilsStore.deselectAll();
                break;
            case "Move":
                utilsStore.openModal({
                    name: "move",
                });
                break;
            case "Shift":
                utilsStore.openModal({
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
                utilsStore.deselectAll();
                break;
        }
    }

    /** Resolves the state of the plan notes editor. */
    handlePlanNotesChange(state: EditorState) {
        switch (state) {
            case "edit":
                appState.setDontLeave(true);
                this.tempEditorStore = this.plan?.notes ?? "";
                break;
            case "save":
                this.useUpdatePlanMutation();
                break;
            case "cancel":
                appState.setDontLeave(false);
                this.$store.commit("updatePlanAttr", {
                    clientId: this.clientDetails?.client_id,
                    planId: this.plan?.id,
                    attr: "notes",
                    data: this.tempEditorStore,
                });
                break;
        }
    }

    /** Resolves the state of the session editor. */
    handleSessionNotesChange(state: EditorState, id: number) {
        const SESSION = this.$store.getters.getSession({
            clientId: this.$route.params.client_id,
            planId: this.$route.params.id,
            sessionId: id,
        });
        switch (state) {
            case "edit":
                appState.setDontLeave(true);
                this.isEditingSession = true;
                this.editSession = id;
                this.forceStop += 1;
                this.tempEditorStore = SESSION.notes;
                this.goToEvent(SESSION.id, SESSION.week_id);
                break;
            case "save":
                appState.setDontLeave(true);
                this.isEditingSession = false;
                this.editSession = null;
                this.useUpdateSessionMutation(id);
                utilsStore.responsePopUpRef?.open({
                    title: "Session updated",
                    text: "Your changes have been saved",
                });
                appState.stopLoaders();
                break;
            case "cancel":
                appState.setDontLeave(false);
                this.isEditingSession = false;
                this.editSession = null;
                SESSION.notes = this.tempEditorStore;
                break;
        }
    }

    /** Duplicates the selected sessions. */
    async duplicate() {
        appState.setDontLeave(true);
        appState.setLoading(true);
        const TO_DUPLICATE: SessionType[] = [];
        const CLIENT_ID = this.$route.params.client_id;
        const PLAN_ID = this.$route.params.id;
        const SESSIONS = this.$store.getters.getPlan({
            clientId: this.$route.params.client_id,
            planId: this.$route.params.id,
        }).sessions;
        this.selectedIds.forEach((sessionId) => {
            TO_DUPLICATE.push(
                SESSIONS.find(
                    (session: SessionType) => session.id === sessionId
                )
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
        utilsStore.responsePopUpRef?.open({
            title: `${
                this.selectedIds.length > 1 ? "Sessions" : "Session"
            } duplicated`,
            text: "Get programming!",
        });
        appState.stopLoaders();
    }

    /** Opens a new tab with the print preview of all the selected sessions. */
    print() {
        const NOTES_ARR: string[] = [];
        this.plan?.sessions?.sort(
            // @ts-expect-error
            (a, b) => new Date(a.date) > new Date(b.date)
        );
        this.plan?.sessions?.forEach((session) => {
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
        NEW_WINDOW?.document.write(
            `<style>body>div{font-family: Arial, Helvetica, sans-serif;padding: 5% 10%}.session{padding: 36px 0}.session:not(:last-child){border-bottom: 1px solid #282828}@media print {.close_link {display: none}}</style><div><a class="close_link" href="javascript:void(0)" onclick="window.close()">Close print/export preview</a>${HTML}</div>`
        );
        NEW_WINDOW?.stop();
        NEW_WINDOW?.print();
        this.$ga.event("Plan", "print");
        utilsStore.deselectAll();
    }

    /** Toggles the complete/incomplete state of the selected sessions. */
    async useUpdateCheckedMutation(boolState: number) {
        appState.setDontLeave(true);
        if (this.selectedIds.length !== 0) {
            if (
                await utilsStore.confirmPopUpRef?.open({
                    title: `Are you sure that you want to ${
                        boolState === 1 ? "complete" : "incomplete"
                    } all the selected sessions?`,
                    text: "You can update this later if anything changes.",
                })
            ) {
                this.plan?.sessions?.forEach((session) => {
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
                utilsStore.responsePopUpRef?.open({
                    title:
                        this.selectedIds.length > 1
                            ? "Sessions updated"
                            : "Session updated",
                    text: "Your changes have been saved",
                });
                utilsStore.deselectAll();
            }
        }
        appState.stopLoaders();
    }

    /** Deletes all the selected sessions. */
    async useDeleteSessionMutation() {
        appState.setDontLeave(true);
        if (this.selectedIds.length !== 0) {
            if (
                await utilsStore.confirmPopUpRef?.open({
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
                    utilsStore.resolveError(e as string);
                }
                utilsStore.deselectAll();
                this.toggleExpandAll("Collapse");
                this.$ga.event("Session", "delete");
                utilsStore.responsePopUpRef?.open({
                    title:
                        this.selectedIds.length > 1
                            ? "Sessions deleted"
                            : "Session deleted",
                    text: "Your changes have been saved",
                });
                appState.stopLoaders();
            }
        }
        appState.stopLoaders();
    }

    /** Selects all the sessions in the plan or week. */
    selectAll(mode: string) {
        utilsStore.selectAll(
            this.plan?.sessions
                ?.filter((session) =>
                    mode === "all" ? true : session.week_id === this.currentWeek
                )
                .map((session) => session.id) ?? []
        );
    }

    /** Creates a new session. */
    async createNewSession() {
        appState.setDontLeave(true);
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
        utilsStore.responsePopUpRef?.open({
            title: "New session added",
            text: "Get programming!",
        });
        appState.stopLoaders();
    }

    /** Scrolls to session. */
    goToEvent(id: number, week: number) {
        this.toggleExpandAll("Expand");
        planStore.setCurrentWeek(week);
        setTimeout(() => {
            document
                .getElementById(`session-${id}`)
                ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }

    /** Expands the main body of the targetted session. */
    toggleExpandedSessions(id: number) {
        if (this.expandedSessions.includes(id)) {
            this.expandedSessions = this.expandedSessions.filter(
                (sId) => sId !== id
            );
        } else this.expandedSessions.push(id);
    }

    /** Switch to a different week. */
    changeWeek(weekID: number) {
        planStore.setCurrentWeek(weekID);
    }

    /** Returns the duration of the plan as an array to be iterated. */
    planDuration(duration: number) {
        return new Array(duration).map((_, i) => i);
    }

    /** Expand or de-expand all sessions. */
    toggleExpandAll(toExpand: string) {
        try {
            if (Array.isArray(this.plan?.sessions)) {
                if (this.plan?.sessions.length !== 0) {
                    this.plan?.sessions.forEach((session) => {
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
    }

    /** Updates the details of the plan. */
    async useUpdatePlanMutation() {
        try {
            appState.setLoading(true);
            await this.$store.dispatch("updatePlan", this.plan);
            this.loadPlanData();
            this.$ga.event("Plan", "update");
            appState.stopLoaders();
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }

    /** Updates the selected sessions. */
    async useUpdateSessionsMutation(sessionIds: number[]) {
        try {
            await this.$store.dispatch("batchUpdateSession", {
                clientId: this.$route.params.client_id,
                planId: this.$route.params.id,
                sessionIds,
            });
            this.loadPlanData();
            this.$ga.event("Session", "update");
            appState.stopLoaders();
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }

    /** Updates a single session. */
    async useUpdateSessionMutation(sessionId: number) {
        try {
            await this.$store.dispatch("updateSession", {
                clientId: this.$route.params.client_id,
                planId: this.$route.params.id,
                sessionId,
            });
            this.loadPlanData();
            this.$ga.event("Session", "update");
            appState.stopLoaders();
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }

    /** Creates a new session with our without existing data. */
    async useCreateSessionMutation(data: any) {
        try {
            const NEW_SESSION_ID = await this.$store.dispatch("addSession", {
                client_id: parseInt(data.clientId),
                data: {
                    programme_id: parseInt(data.planId),
                    name: data.sessionName,
                    date: data.sessionDate,
                    notes: data.sessionNotes,
                    week_id: data.sessionWeek,
                },
            });
            this.loadPlanData();
            return NEW_SESSION_ID;
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }

    /** Updates the week color. */
    async useUpdateWeekColorMutation() {
        this.$store.dispatch("updatePlanAttr", {
            clientId: this.clientDetails?.client_id,
            planId: this.plan?.id,
            attr: "block_color",
            data: JSON.stringify(this.weekColor)
                .replace(/"/g, "")
                .replace(/[[\]]/g, "")
                .replace(/\//g, ""),
        });
        try {
            await this.$store.dispatch("updatePlan", this.plan);
            this.loadPlanData();
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }
}
</script>
