<style lang="scss" scoped>
/* Other */
.dark_overlay {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
  min-height: stretch;
  min-height: calc(100vh - env(safe-area-inset-bottom));
  background-color: #00000060;
}

.switch_cal {
  margin-bottom: 0.4rem;
  svg {
    margin-right: 0.4rem;
  }
}

/* Plan Grid */
#plan_notes {
  margin: 4rem 0;
}

/* Plan Table */
.plan_table {
  height: fit-content;
  margin-bottom: 2rem;
  .plan_table__header {
    display: grid;
    margin: 0 0 4rem 0;
    grid-gap: 1rem;
    h3 {
      margin: 0;
    }
    #duration {
      width: 6rem;
      font-size: 1rem;
      margin-left: 1rem;
    }
  }
  .week-button-container {
    display: grid;
    grid-gap: 1rem 0.4rem;
    grid-template-columns: repeat(auto-fill, 50px);
    border: none;
    padding: 0;
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
  .plan_grid {
    display: block;
    .calendar {
      margin: 4rem 0;
    }
  }
  .wrapper-plan {
    margin: 4rem 0;
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
        :sessions-to-progress="selectedSessions"
        :current-week="currentWeek"
        :max-week="maxWeek"
      />
    </div>
    <div
      v-if="!loading && !isStatsOpen && !$parent.showOptions && !noSessions"
      class="tab_option icon_open_middle tab_option_small fadeIn"
      aria-label="Statistics"
      @click="(isStatsOpen = true), willBodyScroll(false)"
    >
      <inline-svg :src="require('../../assets/svg/stats.svg')" />
      <p class="text">Statistics</p>
    </div>
    <multiselect
      :type="'session'"
      :options="multiselectOption"
      :selected="selectedSessions"
      @response="resolve_session_multiselect"
    />
    <preview-modal
      :desc="previewDesc"
      :html="previewHTML"
      :show-media="true"
      :show-brackets="true"
      @close="(previewDesc = null), (previewHTML = null)"
    />
    <div v-show="editSession !== null" class="dark_overlay fadeIn" />
    <div>
      <plan-header />
      <div class="plan_grid">
        <div class="calendar">
          <div id="plan_notes" class="editor_object_standard">
            <h3>Plan Notes</h3>
            <rich-editor
              v-model="plan.notes"
              :item-id="'plan_notes'"
              :editing="editSession"
              :empty-placeholder="'What do you want to achieve in this plan?'"
              :force-stop="forceStop"
              @on-edit-change="resolvePlanInfoEditor"
            />
          </div>
          <div class="wrapper--calendar">
            <a
              class="a_link switch_cal"
              href="javascript:void(0)"
              @click="showMonthlyCal = !showMonthlyCal"
            >
              <inline-svg :src="require('../../assets/svg/calendar.svg')" />
              Switch to {{ !showMonthlyCal ? "month" : "week" }} view
            </a>
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
        </div>
        <div class="wrapper-plan">
          <div class="plan_table">
            <div class="plan_table__header">
              <h3>Microcycles</h3>
              <div class="wrapper-duration">
                <label for="duration">Duration: </label>
                <input
                  id="duration"
                  v-model="plan.duration"
                  type="number"
                  name="duration"
                  inputmode="decimal"
                  min="1"
                  @change="updatePlan(), (maxWeek = plan.duration)"
                />
              </div>
            </div>

            <!-- Week buttons -->
            <div class="week-button-container">
              <week-button
                v-for="item in planDuration(plan.duration)"
                :class="{ active: currentWeek === item }"
                :key="item"
                :week-color="
                  weekColor[item - 1]
                    ? weekColor[item - 1]
                    : 'var(--base_faint)'
                "
                :number="item"
              />
            </div>
          </div>
          <!-- plan_table -->
          <div class="sessions">
            <plan-control-bar />
            <skeleton v-if="loading" :type="'session'" />
            <div v-else-if="!noSessions && !weekIsEmpty">
              <div v-if="plan.sessions" class="container--sessions_header">
                <a
                  v-if="
                    !noSessions &&
                    selectedSessions.length < plan.sessions.length &&
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
                    selectedSessions.length < plan.sessions.length &&
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
                    plan.sessions !== false && !isEditingSession && !weekIsEmpty
                  "
                  href="javascript:void(0)"
                  class="a_link"
                  @click="
                    expandAll(
                      expandedSessions.length !== 0 ? 'Collapse' : 'Expand'
                    )
                  "
                >
                  {{ expandedSessions.length !== 0 ? "Collapse" : "Expand" }}
                  all
                </a>
              </div>
              <!-- New session -->
              <div v-if="!noSessions && !loading" class="container--sessions">
                <!-- Loop through sessions -->
                <div
                  v-for="(session, indexed) in sessionsSorter(plan.sessions)"
                  v-show="session.week_id === currentWeek"
                  :id="'session-' + session.id"
                  :key="indexed"
                  :style="{ zIndex: session.id === editSession ? 2 : 0 }"
                  class="editor_object_complex fadeIn"
                >
                  <div class="session_header">
                    <div class="right_margin">
                      <span
                        v-if="session.id !== editSession"
                        class="text--name"
                        :class="{
                          newSession:
                            session.name == 'Untitled' && !isEditingSession,
                        }"
                        ><b>{{ session.name }}</b></span
                      ><br v-if="session.id !== editSession" />
                      <span
                        v-if="session.id !== editSession"
                        class="text--tiny"
                        >{{ day(session.date) }}</span
                      >
                      <span
                        v-if="session.id !== editSession"
                        class="text--tiny"
                        >{{ session.date }}</span
                      ><br v-if="session.id !== editSession" />
                      <span
                        v-if="session.id !== editSession"
                        :class="{
                          incomplete: session.checked === 0,
                          completed: session.checked === 1,
                        }"
                        class="text--tiny"
                        >{{
                          session.checked === 0 ? "Incomplete" : "Complete"
                        }}</span
                      >
                      <input
                        v-if="session.id === editSession"
                        v-model="session.name"
                        class="session-name small_border_radius"
                        type="text"
                        name="session-name"
                        pattern="[^\/]"
                      />
                      <input
                        v-if="session.id === editSession"
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
                            session.feedback !== '' && session.feedback !== null
                          "
                          class="feedback_button"
                          @click="
                            (previewHTML = session.feedback),
                              (previewDesc = `${session.name} on ${session.date}`),
                              willBodyScroll(false)
                          "
                        >
                          Feedback
                        </button>
                        <checkbox
                          :item-id="session.id"
                          :type="'v1'"
                          aria-label="Select this session"
                        />
                      </div>
                      <inline-svg
                        v-show="!isEditingSession"
                        id="expand"
                        class="icon--expand"
                        :class="{
                          expanded: expandedSessions.includes(session.id),
                        }"
                        :src="require('../../assets/svg/expand.svg')"
                        title="Info"
                        @click="toggleExpandedSessions(session.id)"
                      />
                    </div>
                  </div>
                  <rich-editor
                    v-show="expandedSessions.includes(session.id)"
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
const PlanHeader = () =>
  import(
    /* webpackChunkName: "components.planHeader", webpackPreload: true */ "./components/PlanHeader"
  );
const WeekButton = () =>
  import(
    /* webpackChunkName: "components.weekButton", webpackPrefetch: true */ "./components/WeekButton"
  );
const PlanControlBar = () =>
  import(
    /* webpackChunkName: "components.planControlBar", webpackPrefetch: true */ "./components/PlanControlBar"
  );
const Checkbox = () =>
  import(
    /* webpackChunkName: "components.checkbox", webpackPreload: true */ "../../components/Checkbox"
  );
const WeekCalendar = () =>
  import(
    /* webpackChunkName: "components.calendar", webpackPreload: true */ "../../components/WeekCalendar"
  );
const MonthCalendar = () =>
  import(
    /* webpackChunkName: "components.calendar", webpackPreload: true */ "../../components/MonthCalendar"
  );
const RichEditor = () =>
  import(
    /* webpackChunkName: "components.richeditor", webpackPreload: true */ "../../components/Editor"
  );
const Multiselect = () =>
  import(
    /* webpackChunkName: "components.multiselect", webpackPrefetch: true */ "../../components/Multiselect"
  );
const PreviewModal = () =>
  import(
    /* webpackChunkName: "components.previewModal", webpackPrefetch: true */ "../../components/PreviewModal"
  );
const Statistics = () =>
  import(
    /* webpackChunkName: "components.statistics", webpackPrefetch: true */ "../../components/Stats"
  );
const ProgressSessions = () =>
  import(
    /* webpackChunkName: "components.progressSessions", webpackPrefetch: true */ "../../components/ProgressSessions"
  );

export default {
  components: {
    PlanHeader,
    WeekButton,
    Checkbox,
    WeekCalendar,
    MonthCalendar,
    RichEditor,
    Multiselect,
    PreviewModal,
    Statistics,
    ProgressSessions,
    PlanControlBar,
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
      previewHTML: null,
      previewDesc: null,

      // SYSTEM

      noSessions: false,
      expandedSessions: [],
      force: true,
      multiselectOption: [
        { name: "Complete", svg: "svg/tick.svg" },
        { name: "Incomplete", svg: "svg/cross.svg" },
        { name: "Progress", svg: "svg/arrow-right.svg" },
        { name: "Duplicate", svg: "svg/copy.svg" },
        { name: "Move", svg: "svg/move.svg" },
        { name: "Shift", svg: "svg/shift.svg" },
        { name: "Print", svg: "svg/print.svg" },
        { name: "Delete", svg: "svg/bin.svg" },
        { name: "Deselect", svg: null },
      ],

      // WEEK

      weekSessions: [],
      weekIsEmpty: true,

      // Modals

      showProgress: false,

      // MANIPULATION

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
  computed: mapState([
    "loading",
    "silentLoading",
    "dontLeave",
    "plan",
    "clients",
    "templates",
    "clientDetails",
    "selectedSessions",
    "currentWeek",
    "weekColor",
  ]),
  created() {
    this.$store.commit("setData", {
      attr: "loading",
      data: true,
    });
    this.willBodyScroll(true);
    this.$store.dispatch("setCurrentPlan", this.$route.params.id);
    this.$store.dispatch("endLoading");
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
          this.deselectAll();
          break;
        case "Move":
          this.$store.dispatch("openModal", {
            name: "move",
          });
          this.willBodyScroll(false);
          this.updater();
          break;
        case "Shift":
          this.$store.dispatch("openModal", {
            name: "shift",
          });
          this.willBodyScroll(false);
          this.updater();
          break;
        case "Print":
          this.print();
          break;
        case "Delete":
          this.bulkDelete();
          this.updater();
          break;
        case "Deselect":
          this.deselectAll();
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
      this.selectedSessions.forEach((sessionId) => {
        TO_DUPLICATE.push(SESSIONS.find((session) => session.id === sessionId));
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
          this.selectedSessions.length > 1 ? "Sessions" : "Session"
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
        if (this.selectedSessions.includes(session.id)) {
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
      this.deselectAll();
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
      if (this.selectedSessions.length !== 0) {
        if (
          await this.$parent.$parent.$refs.confirm_pop_up.show(
            `Are you sure that you want to ${
              boolState === 1 ? "complete" : "incomplete"
            } all the selected sessions?`,
            "You can update this later if anything changes."
          )
        ) {
          this.plan.sessions.forEach((session) => {
            if (this.selectedSessions.includes(session.id)) {
              this.$store.commit("updateSessionAttr", {
                clientId: this.$route.params.client_id,
                planId: this.$route.params.id,
                sessionId: session.id,
                attr: "checked",
                data: boolState,
              });
            }
          });
          this.batchUpdateSession(this.selectedSessions);
          this.$store.dispatch("openResponsePopUp", {
            title:
              this.selectedSessions.length > 1
                ? "Sessions updated"
                : "Session updated",
            description: "Your changes have been saved",
          });
          this.deselectAll();
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
      if (this.selectedSessions.length !== 0) {
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
              sessionIds: this.selectedSessions,
            });
          } catch (e) {
            this.$parent.$parent.resolveError(e);
          }
          this.checkForWeekSessions();
          this.deselectAll();
          this.expandAll("Collapse");
          this.updater();
          this.$ga.event("Session", "delete");
          this.$store.dispatch("openResponsePopUp", {
            title:
              this.selectedSessions.length > 1
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
     * @param {string} mode - To select all session or all sessions in the current week ('all' or 'week').
     */
    selectAll(mode) {
      this.plan.sessions.forEach((session) => {
        if (!this.selectedSessions.includes(session.id)) {
          if (mode === "all") {
            document.getElementById(`sc-${session.id}`).checked = true;
            this.selectedSessions.push(session.id);
          } else if (mode === "week" && session.week_id === this.currentWeek) {
            document.getElementById(`sc-${session.id}`).checked = true;
            this.selectedSessions.push(session.id);
          }
        }
      });
    },

    /**
     * Deselects all the sessions.
     */
    deselectAll() {
      this.selectedSessions.forEach((id) => {
        document.getElementById(`sc-${id}`).checked = false;
      });
      this.$store.dispatch("deselectAllSessions");
    },

    /**
     * Toggles the state of the custom checkbox component.
     */
    changeSelectCheckbox(id) {
      this.$store.dispatch(
        this.$store.state.selectedSessions.includes(id)
          ? "removeSelectedSession"
          : "addSelectedSession",
        id
      );
    },

    /**
     * Scrolls to session.
     * @param {integer} id - The id of the session.
     * @param {integer} week - The week containing the session.
     */
    goToEvent(id, week) {
      this.expandAll("Expand");
      this.$store.commit("setData", {
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
        this.$parent.$parent.resolveError(e);
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
        this.$parent.$parent.resolveError(e);
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
        this.$parent.$parent.resolveError(e);
      }
    },

    /**
     * Creates a new session with our without existing data.
     * @param {object} data - Pre-existing session data.
     * @returns The id of the new session.
     */
    async addSession(data) {
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
        return NEW_SESSION_ID;
      } catch (e) {
        this.$parent.$parent.resolveError(e);
      }
    },
  },
};
</script>
