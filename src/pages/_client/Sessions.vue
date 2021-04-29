<style scoped>
/* Plan Info */
.client_plan_top_grid {
  display: grid;
  grid-gap: 1rem;
  margin-top: 2rem
}
.wrapper--progress-bar {
  user-select: none;
  border: 1px solid var(--base_faint);
  border-radius: 3px;
  transition: .4s all cubic-bezier(.165, .84, .44, 1)
}
#progress-bar {
  border-radius: 3px;
  padding: .3rem 1rem;
  background-color: #00800020;
  transition: 1s all cubic-bezier(.165, .84, .44, 1)
}
#progress-bar p {
  white-space: nowrap
}
#progress-bar.fullBar {
  background-color: #49AB59
}
#progress-bar.noSessions {
  background-color: #8B000020
}
#progress-bar.fullBar p {
  color: white
}
#duration {
  width: 6rem;
  font-size: 1rem;
  margin-left: 1rem
}
.icon--expand {
  cursor: pointer;
  margin: .8rem 0 0 auto;
  transition: var(--transition_smooth)
}
.icon--expand.expanded {
  transform: rotate(180deg)
}

/* Plan Options */
.plan_options {
  display: flex
}
.plan_options a {
  margin-right: 1rem
}
.plan_options a svg {
  margin-right: .4rem
}
.switch_cal {
  margin-bottom: .4rem
}
.switch_cal svg {
  margin-right: .4rem
}

/* Plan Grid */
#plan_notes {
  margin: 4rem 0
}
.a--plan_notes {
  color: var(--base);
  font-size: .8rem;
  margin-left: 1rem;
  align-self: center;
  transition: var(--transition_standard)
}
.a--plan_notes:hover {
  opacity: var(--light_opacity)
}

/* Plan Table */
.plan_table__header h3 {
  margin: 0
}
.plan_table__header {
  display: grid;
  margin: 0 0 4rem 0;
  grid-gap: 1rem
}
.plan_table {
  height: fit-content;
  margin-bottom: 2rem
}
.plan_table--container {
  display: inline-block;
  width: 100%;
  text-align: center
}
.plan_table--container--plan_duration_container {
  display: grid;
  grid-gap: 1rem .4rem;
  grid-template-columns: repeat(auto-fill, 50px);
  border: none;
  padding: 0
}

/* Week */
.container--week {
  height: 100px;
  user-select: none
}
.week__color {
  width: 50px;
  height: 6px
}
.week__number {
  padding: 1rem 0
}
.week {
  display: grid;
  grid-template-rows: 6px 90px;
  cursor: pointer;
  background-color: var(--fore);
  min-width: 50px;
  height: 74px;
  width: 100%;
  border-radius: 5px;
  transition: var(--transition_standard)
}
.week:hover {
  box-shadow: var(--low_shadow)
}
.weekActive {
  border-bottom: 2px solid #EEEEEE;
  box-shadow: var(--high_shadow);
  background-color: var(--fore);
  height: 94px
}
.week.weekActive:hover {
  box-shadow: var(--low_shadow)
}
.change_week_color {
  height: 2rem;
  width: 4rem;
  border: 2px solid var(--base);
  border-radius: 5px;
  cursor: pointer;
  transition: var(--transition_standard)
}
.change_week_color:hover {
  opacity: var(--light_opacity)
}
.change_week_color.noColor {
  /* stylelint-disable-next-line */
  background-color: var(--fore) !important
}

/* Info */
#info {
  fill: var(--base);
  margin-left: 1rem;
  cursor: pointer;
  transition: opacity 1s, transform .1s cubic-bezier(.075, .82, .165, 1)
}
#info:hover {
  opacity: var(--light_opacity)
}
#info:active {
  transform: var(--active_state)
}

/* Sessions */
.session--header {
  display: flex;
  justify-content: space-between
}
.session--header__left {
  display: grid;
  grid-gap: 1rem;
  min-height: 80px
}
.session--header__left__top {
  display: flex
}
.container--sessions_header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem
}
.container--sessions_header a {
  font-size: .8rem;
  margin-left: 1rem
}
.session_header {
  display: flex;
  justify-content: space-between
}
.header_options {
  display: flex;
  flex-direction: column;
  align-items: center
}
.header_options > .slot_1 {
  display: flex
}
.container--sessions {
  display: grid;
  grid-gap: 2rem
}
input.session-name, input.session-date {
  margin-bottom: .4rem
}
input.session-date {
  width: fit-content;
  font-size: .8rem
}
.wrapper--template-options {
  margin: 2rem 0
}
.feedback_button {
  margin-right: 1rem;
  padding: .4rem 1rem;
  border-radius: 3px
}
.newSession, .incomplete {
  color: #B80000
}
.completed {
  color: green
}
.editingChecked {
  cursor: pointer;
  text-decoration: underline
}
.editingChecked:hover {
  opacity: var(--light_opacity)
}

/* Responsive */
@media (max-width: 992px) {
  .switch_cal {
    display: none
  }
  .data-options {
    display: grid;
    grid-gap: 4rem
  }
  .data-select {
    margin-right: 0
  }
}
@media (max-width: 768px) {
  .expand-all:hover {
    opacity: 1
  }
  input.session-name {
    width: 60%
  }
  .client_plan_top_grid {
    margin-top: 1rem
  }
}

@media (max-width: 576px) {
  /* Container */
  .plan_options {
    display: grid;
    grid-gap: 1rem
  }
  .plan_options .a_link {
    width: fit-content
  }
  .plan_grid {
    display: block
  }
  .calendar, .wrapper-plan {
    margin: 4rem 0
  }

  /* Session */
  input.session-name {
    width: 100%
  }
  .session--header {
    display: block
  }
  .button--new-session {
    width: 100%;
    margin: 2rem 0
  }

  /* Protocol error */
  .protocol_error * {
    font-size: .8rem
  }
}
</style>

<template>
  <div id="plan">
    <div :class="{ opened_sections: showMove || showShift || showProgress || showDuplicate }" class="section_overlay" />
    <form
      v-if="showMove"
      class="tab_overlay_content fadeIn delay fill_mode_both"
      @submit.prevent="move_to_week(), showMove = false, will_body_scroll(true)"
    >
      <h3>
        Move to a different microcycle
      </h3>
      <p class="grey">
        This will change the colour code assigned to the sessions
      </p>
      <div class="input_section">
        <label for="range">Move to:</label>
        <input
          id="range"
          ref="range"
          v-model="moveTarget"
          class="width_300"
          name="range"
          type="number"
          min="1"
          :max="maxWeek"
          required
        >
      </div>
      <button type="submit">
        Move
      </button>
      <button class="red_button" @click.prevent="showMove = false, will_body_scroll(true)">
        Cancel
      </button>
    </form>
    <form
      v-if="showShift"
      class="tab_overlay_content fadeIn delay fill_mode_both"
      @submit.prevent="shift_across(), showShift = false, will_body_scroll(true)"
    >
      <h3>
        Shift the dates of the sessions
      </h3>
      <p class="grey">
        This will move the dates ahead or behind by the specified amount
      </p>
      <div class="input_section">
        <label for="range">Shift session dates by: </label>
        <input
          id="range"
          ref="range"
          v-model="shiftDays"
          class="width_300"
          name="range"
          type="number"
          required
        >
      </div>
      <button type="submit">
        Shift
      </button>
      <button class="red_button" @click.prevent="showShift = false, will_body_scroll(true)">
        Cancel
      </button>
    </form>
    <div v-if="showProgress" class="tab_overlay_content fadeIn delay fill_mode_both">
      <progress-sessions
        :plan-data="helper('match_plan')"
        :sessions-to-progress="selectedSessions"
        :current-week="currentWeek"
        :max-week="maxWeek"
      />
    </div>
    <form
      v-if="showDuplicate"
      class="tab_overlay_content fadeIn delay fill_mode_both"
      @submit.prevent="duplicate_plan(duplicateClientID), showDuplicate = false, will_body_scroll(true)"
    >
      <h3>
        Create a similar plan
      </h3>
      <p class="grey">
        Copy this plan to the same/different client
      </p><br>
      <select v-model="duplicateClientID" name="duplicate_client" class="width_300">
        <option disabled>
          Select a client
        </option>
        <option
          v-for="(client, index) in $parent.$parent.clients"
          :key="`client_${index}`"
          :value="client.client_id"
        >
          {{ client.name }}
        </option>
      </select><br><br>
      <button type="submit">
        Duplicate
      </button>
      <button class="red_button" @click.prevent="showDuplicate = false, will_body_scroll(true)">
        Cancel
      </button>
    </form>
    <div
      v-if="!$parent.$parent.loading && !isStatsOpen && !$parent.showOptions && !noSessions"
      :class="{ icon_open_middle: $parent.keepLoaded }"
      class="tab_option tab_option_small fadeIn"
      aria-label="Statistics"
      @click="isStatsOpen = true, will_body_scroll(false)"
    >
      <inline-svg :src="require('../../assets/svg/stats.svg')" />
      <p class="text">
        Statistics
      </p>
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
      @close="previewDesc = null, previewHTML = null"
    />
    <!-- Loop through plans and v-if plan matches route so that plan data object is available throughout -->
    <div
      v-for="(plan, index) in $parent.$parent.client_details.plans"
      :key="index"
    >
      <div v-if="plan.id == $route.params.id">
        <div class="client_plan_top_grid">
          <input
            v-model="plan.name"
            class="allow_text_overflow"
            aria-label="Plan name"
            type="text"
            name="name"
            :disabled="$parent.$parent.silent_loading"
            @blur="update_plan()"
          >
          <div class="wrapper--progress-bar">
            <div id="progress-bar" :class="{ fullBar: sessionsDone === sessionsTotal && sessionsTotal !== 0, noSessions: noSessions }">
              <p v-if="!noSessions" class="grey">
                Completed {{ sessionsDone }} of {{ sessionsTotal }} sessions
              </p>
              <p v-if="noSessions" class="grey">
                Add some sessions to see programme adherence here...
              </p>
            </div>
          </div>
          <div class="plan_options">
            <router-link
              :to="`/client/${$route.params.client_id}/`"
              class="a_link"
              href="javascript:void(0)"
            >
              <inline-svg id="back" :src="require('../../assets/svg/arrow-left.svg')" />
              Back to profile
            </router-link>
            <a
              class="a_link"
              href="javascript:void(0)"
              @click="showDuplicate = true, will_body_scroll(false)"
            >
              <inline-svg :src="require('../../assets/svg/copy.svg')" />
              Duplicate plan
            </a>
            <a
              class="a_link text--red"
              href="javascript:void(0)"
              @click="delete_plan()"
            >
              <inline-svg :src="require('../../assets/svg/bin.svg')" />
              Delete plan
            </a>
          </div>
        </div>
        <div class="plan_grid">
          <div class="calendar">
            <div
              id="plan_notes"
              class="editor_object_standard"
            >
              <h3>
                Plan Notes
              </h3>
              <rich-editor
                v-model="plan.notes"
                :item-id="'plan_notes'"
                :editing="editSession"
                :empty-placeholder="'What do you want to achieve in this plan?'"
                :force-stop="forceStop"
                @on-edit-change="resolve_plan_info_editor"
              />
            </div>
            <div class="wrapper--calendar">
              <a
                class="a_link switch_cal"
                href="javascript:void(0)"
                @click="showMonthlyCal = !showMonthlyCal"
              >
                <inline-svg :src="require('../../assets/svg/calendar.svg')" />
                Switch to {{ !showMonthlyCal ? 'month' : 'week' }} view
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
                <h3>
                  Microcycles
                </h3>
                <div class="wrapper-duration">
                  <label for="duration">Duration: </label>
                  <input
                    id="duration"
                    v-model="plan.duration"
                    type="number"
                    name="duration"
                    inputmode="decimal"
                    min="1"
                    @change="update_plan(), maxWeek = plan.duration"
                  >
                </div>
              </div>
              <div class="plan_table--container">
                <div class="plan_table--container--plan_duration_container">
                  <div
                    v-for="item in plan_duration(plan.duration)"
                    :key="item"
                    class="container--week"
                    @click="change_week(item)"
                  >
                    <div :class="{ weekActive: item === currentWeek }" class="week">
                      <div :style="{ backgroundColor: weekColor.backgroundColor[item - 1] }" class="week__color" />
                      <div class="week__number">
                        {{ item }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> <!-- plan_table -->
            <div class="sessions">
              <div class="session--header">
                <div class="session--header__left">
                  <div class="session--header__left__top">
                    <div
                      :style="{ backgroundColor: weekColor.backgroundColor[currentWeek - 1] }"
                      :class="{ noColor: weekColor.backgroundColor[currentWeek - 1] === 'null' }"
                      class="change_week_color"
                      @click="editingWeekColor = !editingWeekColor"
                    />
                    <inline-svg
                      id="info"
                      :src="require('../../assets/svg/info.svg')"
                      title="Info"
                      @click="previewDesc = 'How to track exercises to visualise in the Statistics tab', previewHTML = '<p><b>[ </b><i>Exercise Name</i><b>:</b> <i>Sets</i> <b>x</b> <i>Reps</i> <b>at</b> <i>Load</i> <b>]</b></p><br> <p><b>Examples</b></p><p><i>[Back Squat: 3x6 at 50kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50kg]</i></p> <p><i>[Back Squat: 3x6 at 50/55/60kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50/55/60kg]</i></p><br><hr><br><p><b>[ </b><i>Measurement</i><b>:</b> <i>Value</i> <b>]</b></p><br><p><b>Examples</b></p><p><i>[Weight: 50kg]</i></p> <p><i>[Vertical Jump: 43.3cm]</i></p> <p><i>[Body Fat (%): 12]</i></p> <p><i>[sRPE (CR10): 8]</i></p> <p><i>[sRPE (Borg): 16]</i></p><br> <p>See <i>Help</i> for more information</p><br>', will_body_scroll(false)"
                    />
                  </div>
                  <color-picker v-if="editingWeekColor" :injected-color.sync="weekColor.backgroundColor[currentWeek - 1]" />
                </div>
                <div>
                  <button class="button--new-session" @click="new_session()">
                    New session
                  </button>
                </div>
              </div>
              <p v-if="!$parent.$parent.loading && (noSessions || weekIsEmpty)" class="text--holder text--small grey">
                No sessions created yet
              </p>
              <div v-if="!$parent.$parent.loading">
                <div v-if="plan.sessions" class="container--sessions_header">
                  <a
                    v-if="!noSessions && selectedSessions.length < plan.sessions.length && !weekIsEmpty"
                    href="javascript:void(0)"
                    class="a_link"
                    @click="select_all('week')"
                  >
                    Select this microcycle
                  </a>
                  <a
                    v-if="!noSessions && selectedSessions.length < plan.sessions.length && !weekIsEmpty"
                    href="javascript:void(0)"
                    class="a_link"
                    @click="select_all('all')"
                  >
                    Select all
                  </a>
                  <a
                    v-if="plan.sessions !== false && !isEditingSession && !weekIsEmpty"
                    href="javascript:void(0)"
                    class="a_link"
                    @click="expand_all(expandedSessions.length !== 0 ? 'Collapse' : 'Expand')"
                  >
                    {{ expandedSessions.length !== 0 ? 'Collapse' : 'Expand' }} all
                  </a>
                </div>
                <!-- New session -->
                <div v-if="!noSessions" class="container--sessions">
                  <!-- Loop through sessions -->
                  <div
                    v-for="(session, indexed) in plan.sessions"
                    v-show="session.week_id === currentWeek"
                    :id="'session-' + session.id"
                    :key="indexed"
                    class="editor_object_complex fadeIn"
                  >
                    <div class="session_header">
                      <div class="right_margin">
                        <span v-if="session.id !== editSession" class="text--name" :class="{newSession: session.name == 'Untitled' && !isEditingSession}"><b>{{ session.name }}</b></span><br v-if="session.id !== editSession">
                        <span v-if="session.id !== editSession" class="text--tiny">{{ day(session.date) }}</span>
                        <span v-if="session.id !== editSession" class="text--tiny">{{ session.date }}</span><br v-if="session.id !== editSession">
                        <span v-if="session.id !== editSession" :class="{incomplete: session.checked === 0, completed: session.checked === 1}" class="text--tiny">{{ session.checked === 0 ? 'Incomplete' : 'Complete' }}</span>
                        <input
                          v-if="session.id === editSession"
                          v-model="session.name"
                          class="session-name small_border_radius"
                          type="text"
                          name="session-name"
                          pattern="[^\/]"
                        >
                        <input
                          v-if="session.id === editSession"
                          v-model="session.date"
                          class="session-date small_border_radius"
                          type="date"
                          name="session-date"
                        >
                      </div>
                      <div class="header_options">
                        <div class="slot_1">
                          <button
                            v-if="session.feedback !== '' && session.feedback !== null"
                            class="feedback_button"
                            @click="previewHTML = session.feedback, previewDesc = `${session.name} on ${session.date}`, will_body_scroll(false)"
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
                          :class="{ expanded: expandedSessions.includes(session.id) }"
                          :src="require('../../assets/svg/expand.svg')"
                          title="Info"
                          @click="toggle_expanded_sessions(session.id)"
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
                      :data-for-templates="$parent.$parent.templates"
                      :force-stop="forceStop"
                      @on-edit-change="resolve_session_editor"
                    />
                  </div>
                </div>
              </div>
              <skeleton v-else type="session" />
            </div><!-- sessions -->
          </div>
          <statistics :plan="plan" :show="isStatsOpen" />
        </div> <!-- plan_grid -->
      </div>
    </div>
  </div>
</template>

<script>
const Checkbox = () => import(/* webpackChunkName: "components.checkbox", webpackPreload: true */ '../../components/Checkbox')
const WeekCalendar = () => import(/* webpackChunkName: "components.calendar", webpackPreload: true */ '../../components/WeekCalendar')
const MonthCalendar = () => import(/* webpackChunkName: "components.calendar", webpackPreload: true */ '../../components/MonthCalendar')
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true */ '../../components/Editor')
const ColorPicker = () => import(/* webpackChunkName: "components.colorpicker", webpackPrefetch: true */ '../../components/ColorPicker')
const Multiselect = () => import(/* webpackChunkName: "components.multiselect", webpackPrefetch: true */ '../../components/Multiselect')
const PreviewModal = () => import(/* webpackChunkName: "components.previewModal", webpackPrefetch: true */ '../../components/PreviewModal')
const Statistics = () => import(/* webpackChunkName: "components.statistics", webpackPrefetch: true */ '../../components/Stats')
const ProgressSessions = () => import(/* webpackChunkName: "components.progressSessions", webpackPrefetch: true */ '../../components/ProgressSessions')

export default {
  components: {
    Checkbox,
    WeekCalendar,
    MonthCalendar,
    RichEditor,
    ColorPicker,
    Multiselect,
    PreviewModal,
    Statistics,
    ProgressSessions
  },
  async beforeRouteLeave (to, from, next) {
    if (this.$parent.$parent.dontLeave ? await this.$parent.$parent.$refs.confirm_pop_up.show('Your changes might not be saved', 'Are you sure you want to leave?') : true) {
      this.$parent.$parent.dontLeave = false
      next()
    }
  },
  data () {
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
        { name: 'Complete', svg: 'svg/tick.svg' },
        { name: 'Incomplete', svg: 'svg/cross.svg' },
        { name: 'Progress', svg: 'svg/arrow-right.svg' },
        { name: 'Duplicate', svg: 'svg/copy.svg' },
        { name: 'Move', svg: 'svg/move.svg' },
        { name: 'Shift', svg: 'svg/shift.svg' },
        { name: 'Print', svg: 'svg/print.svg' },
        { name: 'Delete', svg: 'svg/bin.svg' },
        { name: 'Deselect', svg: null }
      ],

      // WEEK

      weekSessions: [],
      weekIsEmpty: true,
      editingWeekColor: false,
      weekColor: {
        backgroundColor: ''
      },

      // ADHERANCE

      sessionsDone: 0,
      sessionsTotal: 0,

      // Modals

      showMove: false,
      showShift: false,
      showProgress: false,
      showDuplicate: false,

      // MANIPULATION

      moveTarget: 1,
      daysDiff: 7,
      selectedSessions: [],
      shiftDays: 1,
      duplicateClientID: 'Select a client',

      // STATS

      isStatsOpen: false,

      // CALENDAR

      showMonthlyCal: false,
      sessionDates: [],
      forceUpdate: 0,

      // MICROCYCLE

      allowMoreWeeks: false,
      currentWeek: 1,
      maxWeek: 2
    }
  },
  watch: {
    editingWeekColor () {
      this.updater()
    }
  },
  created () {
    this.will_body_scroll(true)
    this.$parent.sessions = true
    this.noSessions = this.helper('match_plan').sessions === false
    this.$parent.$parent.get_templates()
    if (!this.noSessions) {
      this.sort_sessions(this.helper('match_plan'))
      this.check_for_new()
      this.adherence()
      this.updater()
    }
  },
  beforeDestroy () {
    this.will_body_scroll(true)
  },
  methods: {

    // Resolvers

    resolve_session_multiselect (res) {
      switch (res) {
        case 'Complete':
          this.bulk_check(1)
          break
        case 'Incomplete':
          this.bulk_check(0)
          break
        case 'Progress':
          this.showProgress = true
          this.will_body_scroll(false)
          break
        case 'Duplicate':
          this.duplicate()
          this.deselect_all()
          break
        case 'Move':
          this.showMove = true
          this.will_body_scroll(false)
          this.updater()
          break
        case 'Shift':
          this.showShift = true
          this.will_body_scroll(false)
          this.updater()
          break
        case 'Print':
          this.print()
          break
        case 'Delete':
          this.bulk_delete()
          this.updater()
          break
        case 'Deselect':
          this.deselect_all()
          break
      }
    },
    resolve_plan_info_editor (state) {
      const PLAN = this.helper('match_plan')
      switch (state) {
        case 'edit':
          this.$parent.$parent.dontLeave = true
          this.editingPlanNotes = true
          this.tempEditorStore = PLAN.notes
          break
        case 'save':
          this.editingPlanNotes = false
          this.update_plan()
          break
        case 'cancel':
          this.$parent.$parent.dontLeave = false
          this.editingPlanNotes = false
          PLAN.notes = this.tempEditorStore
          break
      }
    },
    resolve_session_editor (state, id) {
      const SESSION = this.helper('match_session', id)
      switch (state) {
        case 'edit':
          this.$parent.$parent.dontLeave = true
          this.isEditingSession = true
          this.editSession = id
          this.forceStop += 1
          this.tempEditorStore = SESSION.notes
          this.go_to_event(SESSION.id, SESSION.week_id)
          break
        case 'save':
          this.isEditingSession = false
          this.editSession = null
          this.update_session(id)
          this.$parent.$parent.$refs.response_pop_up.show('Session updated', 'Your changes have been saved')
          break
        case 'cancel':
          this.$parent.$parent.dontLeave = false
          this.isEditingSession = false
          this.editSession = null
          SESSION.notes = this.tempEditorStore
          break
      }
    },

    // Background

    updater () {
      const PLAN = this.helper('match_plan')
      this.sessionDates = []
      this.weekColor.backgroundColor = PLAN.block_color.replace('[', '').replace(']', '').split(',')
      for (const session of PLAN.sessions) {
        this.sessionDates.push({
          title: session.name,
          date: session.date,
          color: this.weekColor.backgroundColor[session.week_id - 1],
          textColor: this.accessible_colors(this.weekColor.backgroundColor[session.week_id - 1]),
          week_id: session.week_id,
          session_id: session.id
        })
      }
      this.maxWeek = PLAN.duration
    },
    helper (type, sessionId) {
      switch (type) {
        case 'match_plan':
          try {
            return this.$parent.$parent.client_details.plans.find(plan => plan.id === parseInt(this.$route.params.id))
          } catch {
            setTimeout(() => { this.helper('match_plan') }, 1000)
          }
          break
        case 'match_session':
          return this.helper('match_plan').sessions.find(session => session.id === sessionId)
      }
    },

    // MODALS AND TAB

    duplicate () {
      const TO_DUPLICATE = []
      const SESSIONS = this.helper('match_plan').sessions
      this.selectedSessions.forEach((sessionId) => {
        TO_DUPLICATE.push(SESSIONS.find(session => session.id === sessionId))
      })
      TO_DUPLICATE.forEach((session) => {
        this.add_session({
          programmeId: parseInt(this.$route.params.id),
          sessionName: `Copy of ${session.name}`,
          sessionDate: session.date,
          sessionNotes: session.notes,
          sessionWeek: session.week_id
        }, 'new')
      })
    },
    print () {
      const NOTES_ARR = []
      const PLAN = this.helper('match_plan')
      PLAN.sessions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })
      PLAN.sessions.forEach((session) => {
        if (this.selectedSessions.includes(session.id)) {
          NOTES_ARR.push(`<div class="session"><h2>${session.name}</h2><h3>${session.date}</h3><br>${this.update_html(session.notes, true)}</div>`)
        }
      })
      const NEW_WINDOW = window.open()
      const HTML = NOTES_ARR.join('')
      NEW_WINDOW.document.write(`<style>body>div{font-family: Arial, Helvetica, sans-serif;padding: 5% 10%}.session{padding: 36px 0}.session:not(:last-child){border-bottom: 1px solid #282828}@media print {.close_link {display: none}}</style><div><a class="close_link" href="javascript:void(0)" onclick="window.close()">Close print/export preview</a>${HTML}</div>`)
      NEW_WINDOW.stop()
      NEW_WINDOW.print()
      this.$ga.event('Plan', 'print')
      this.deselect_all()
    },
    shift_across () {
      this.helper('match_plan').sessions.forEach((session) => {
        if (this.selectedSessions.includes(session.id)) {
          session.date = this.add_days(session.date, parseInt(this.shiftDays))
          this.update_session(session.id)
        }
      })
      this.$ga.event('Session', 'shift')
      this.$parent.$parent.$refs.response_pop_up.show(this.selectedSessions.length > 1 ? 'Shifted sessions' : 'Shifted session', 'Your changes have been saved')
      this.deselect_all()
    },
    move_to_week () {
      this.helper('match_plan').sessions.forEach((session) => {
        if (this.selectedSessions.includes(session.id)) {
          session.week_id = this.moveTarget
          this.update_session(session.id)
        }
      })
      this.currentWeek = parseInt(this.moveTarget)
      this.$parent.$parent.$refs.response_pop_up.show(this.selectedSessions.length > 1 ? 'Moved sessions' : 'Moved session', 'Your changes have been saved')
      this.deselect_all()
      this.$ga.event('Session', 'move')
      this.$parent.$parent.end_loading()
    },
    async duplicate_plan (clientId) {
      const PLAN = this.helper('match_plan')
      await this.create_plan(PLAN.name, clientId, PLAN.duration, PLAN.block_color, PLAN.notes, PLAN.sessions)
      this.$router.push({ path: `/client/${clientId}/` })
      this.$ga.event('Plan', 'duplicate')
      this.$parent.$parent.$refs.response_pop_up.show('Plan duplicated', 'Access it on your client\'s profile')
    },

    // MULTI AND CHECKBOX

    async bulk_check (state) {
      if (this.selectedSessions.length !== 0) {
        if (await this.$parent.$parent.$refs.confirm_pop_up.show(`Are you sure that you want to ${state === 1 ? 'complete' : 'incomplete'} all the selected sessions?`, 'You can update this later if anything changes.')) {
          this.helper('match_plan').sessions.forEach((session) => {
            if (this.selectedSessions.includes(session.id)) {
              session.checked = state
              this.update_session(session.id)
            }
          })
          this.$parent.$parent.$refs.response_pop_up.show(this.selectedSessions.length > 1 ? 'Sessions updated' : 'Session updated', 'Your changes have been saved')
          this.deselect_all()
        }
      }
    },
    async bulk_delete () {
      if (this.selectedSessions.length !== 0) {
        if (await this.$parent.$parent.$refs.confirm_pop_up.show('Are you sure that you want to delete all the selected sessions?', 'We will remove these sessions from our database and it won\'t be recoverable.')) {
          this.selectedSessions.forEach((sessionId) => {
            this.delete_session(sessionId)
          })
          this.$ga.event('Session', 'bulk_delete')
          this.$parent.$parent.$refs.response_pop_up.show(this.selectedSessions.length > 1 ? 'Sessions deleted' : 'Session deleted', 'Your changes have been saved')
          this.deselect_all()
        }
      }
    },
    select_all (mode) {
      this.helper('match_plan').sessions.forEach((session) => {
        if (!this.selectedSessions.includes(session.id)) {
          if (mode === 'all') {
            document.getElementById(`sc-${session.id}`).checked = true
            this.selectedSessions.push(session.id)
          } else if (mode === 'week' && session.week_id === this.currentWeek) {
            document.getElementById(`sc-${session.id}`).checked = true
            this.selectedSessions.push(session.id)
          }
        }
      })
    },
    deselect_all () {
      this.helper('match_plan').sessions.forEach((session) => {
        document.getElementById(`sc-${session.id}`).checked = false
      })
      this.selectedSessions = []
    },
    change_select_checkbox (id) {
      if (!this.selectedSessions.includes(id)) {
        this.selectedSessions.push(id)
      } else {
        const IDX = this.selectedSessions.indexOf(id)
        this.selectedSessions.splice(IDX, 1)
      }
    },
    async new_session () {
      await this.add_session({
        programmeId: parseInt(this.$route.params.id),
        sessionName: 'Untitled',
        sessionDate: this.today(),
        sessionNotes: '',
        sessionWeek: this.currentWeek
      }, 'new')
    },

    // GENERAL

    go_to_event (id, week) {
      this.expand_all('Expand')
      this.currentWeek = week
      setTimeout(() => {
        document.getElementById(`session-${id}`).scrollIntoView({ behavior: 'smooth' })
      }, 100)
    },
    check_for_week_sessions () {
      let arr = 0
      const SESSIONS = this.helper('match_plan').sessions
      this.noSessions = SESSIONS === false
      if (SESSIONS && !this.noSessions) {
        SESSIONS.forEach((session) => {
          if (session.week_id === this.currentWeek) {
            arr += 1
            this.weekSessions.push(session.id)
          }
        })
      }
      this.weekIsEmpty = arr === 0
    },
    check_for_new () {
      if (!this.noSessions) {
        this.helper('match_plan').sessions.forEach((session) => {
          if (session.notes === null || session.notes === '<p><br></p>') {
            this.expandedSessions.push(session.id)
          }
        })
      }
    },
    toggle_expanded_sessions (id) {
      if (this.expandedSessions.includes(id)) {
        const INDEX = this.expandedSessions.indexOf(id)
        if (INDEX > -1) {
          this.expandedSessions.splice(INDEX, 1)
        }
      } else {
        this.expandedSessions.push(id)
      }
    },
    update_session_color () {
      const PLAN = this.helper('match_plan')
      PLAN.block_color = JSON.stringify(this.weekColor.backgroundColor).replace(/"/g, '').replace(/[[\]]/g, '').replace(/\//g, '')
      this.editingWeekColor = false
      this.update_plan()
    },
    change_week (weekID) {
      this.currentWeek = weekID
      this.moveTarget = weekID
      this.check_for_week_sessions()
    },

    // DATE/TIME

    plan_duration (duration) {
      // Turn the duration of the plan into an array to render the boxes in the table
      const ARR = []
      let i
      for (i = 1; i < parseInt(duration, 10) + 1; i++) {
        ARR.push(i)
      }
      return ARR
    },

    // INIT AND BACKGROUND

    adherence () {
      this.sessionsDone = 0
      this.sessionsTotal = 0
      this.helper('match_plan').sessions.forEach((session) => {
        this.sessionsTotal += 1
        if (session.checked === 1) {
          this.sessionsDone++
        }
      })
      const PROGRESS_BAR = document.getElementById('progress-bar')
      if (PROGRESS_BAR) {
        PROGRESS_BAR.style.width = this.sessionsDone / this.sessionsTotal * 100 + '%'
      }
    },
    expand_all (toExpand) {
      try {
        const PLAN = this.helper('match_plan')
        if (Array.isArray(PLAN.sessions)) {
          if (PLAN.sessions.length !== 0) {
            PLAN.sessions.forEach((session) => {
              if (toExpand === 'Expand') {
                this.expandedSessions.push(session.id)
              } else {
                let x = 0
                const Y = this.expandedSessions.length
                for (; x < Y; x++) {
                  this.expandedSessions.pop()
                }
              }
            })
          }
        }
      } catch (e) {
        console.error(e)
      }
    },

    // DATABASE

    async create_plan (planName, clientId, planDuration, planColors, planNotes, planSessions) {
      this.$parent.$parent.dontLeave = true
      try {
        await this.$axios.put('https://api.traininblocks.com/programmes',
          {
            name: `Copy of ${planName}`,
            client_id: clientId,
            duration: planDuration,
            block_color: planColors,
            ordered: this.$parent.$parent.client_details.plans.length
          }
        ).then((response) => {
          this.update_plan(planNotes, response.data[0]['LAST_INSERT_ID()'], planName, planDuration, planColors)
          if (planSessions) {
            planSessions.forEach((session) => {
              this.add_session({
                clientId,
                programmeId: response.data[0]['LAST_INSERT_ID()'],
                sessionName: session.name,
                sessionDate: session.date,
                sessionNotes: session.notes,
                sessionWeek: session.week_id
              }, 'duplicate')
            })
          }
        })
        await this.$parent.get_client_details(true)
        this.$ga.event('Plan', 'new')
        this.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.resolve_error(e)
      }
    },
    async update_plan (data) {
      this.$parent.$parent.silent_loading = true
      this.$parent.$parent.dontLeave = true
      const PLAN = this.helper('match_plan')
      const FORCE = data !== undefined
      try {
        this.sort_sessions(PLAN)
        const RESPONSE = await this.$axios.post('https://api.traininblocks.com/programmes',
          {
            id: FORCE ? data.id : PLAN.id,
            name: FORCE ? `Copy of ${data.name}` : PLAN.name,
            duration: FORCE ? data.duration : PLAN.duration,
            notes: FORCE ? data.notes : PLAN.notes,
            block_color: FORCE ? data.block_color : PLAN.block_color,
            ordered: PLAN.ordered
          }
        )
        // Set vue client_details data to new data
        let x
        // Loop through client_details plans
        for (x in this.$parent.$parent.client_details.plans) {
          if (this.$parent.$parent.client_details.plans[x].id === this.$route.params.id) {
            this.$parent.$parent.client_details.plans[x] = JSON.parse(JSON.stringify(Object.assign({}, RESPONSE.data)).replace('{"0":', '').replace('}}', '}'))
          }
        }
        // Set vue client plans data to new data
        x = 0
        let y
        for (x in this.$parent.$parent.clients) {
          if (this.$parent.$parent.clients[x].client_id === this.$route.params.client_id) {
            for (y in this.$parent.$parent.clients[x].plans[y]) {
              if (this.$parent.$parent.clients[x].plans[y].id === this.$route.params.id) {
                this.$parent.$parent.clients[x].plans[y] = JSON.parse(JSON.stringify(Object.assign({}, RESPONSE.data)).replace('{"0":', '').replace('}}', '}'))
              }
            }
          }
        }
        // Update the localstorage with the plans
        localStorage.setItem('clients', JSON.stringify(this.$parent.$parent.clients))
        this.$ga.event('Plan', 'update')
        this.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.resolve_error(e)
      }
    },
    async delete_plan () {
      this.$parent.$parent.dontLeave = true
      if (await this.$parent.$parent.$refs.confirm_pop_up.show('Are you sure you want to delete this plan?', 'We will remove this plan from our database and it won\'t be recoverable.')) {
        const ID = parseInt(this.$route.params.id)
        try {
          await this.$axios.delete(`https://api.traininblocks.com/programmes/${ID}`)
          await this.$parent.$parent.clients_f()
          this.$parent.$parent.clients_to_vue()
          this.$ga.event('Session', 'delete')
          this.$parent.$parent.$refs.response_pop_up.show('Plan deleted', 'Your changes have been saved')
          this.$parent.$parent.end_loading()
          this.$router.push({ path: `/client/${this.$parent.$parent.client_details.client_id}/` })
        } catch (e) {
          this.$parent.$parent.resolve_error(e)
        }
      }
    },
    async update_session (id) {
      this.$parent.$parent.dontLeave = true
      const SESSION = this.helper('match_session', id)
      try {
        await this.$axios.post('https://api.traininblocks.com/workouts',
          {
            id: SESSION.id,
            name: SESSION.name,
            date: SESSION.date,
            notes: SESSION.notes,
            week_id: SESSION.week_id,
            checked: SESSION.checked
          }
        )
        await this.$parent.get_sessions(parseInt(this.$route.params.id), parseInt(this.$route.params.client_id), true)
        await this.update_plan()
        this.adherence()
        this.$ga.event('Session', 'update')
        this.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.resolve_error(e)
      }
    },
    async add_session (data, type) {
      this.$parent.$parent.dontLeave = true
      try {
        await this.$axios.put('https://api.traininblocks.com/workouts',
          {
            name: data.sessionName,
            programme_id: data.programmeId,
            date: data.sessionDate,
            notes: data.sessionNotes,
            week_id: data.sessionWeek
          }
        )
        await this.$parent.get_sessions(data.programmeId, type === 'duplicate' ? data.clientId : parseInt(this.$route.params.client_id), true)
        if (type === 'new') {
          this.$ga.event('Session', 'new')
          this.$parent.$parent.$refs.response_pop_up.show('New session added', 'Get programming!')
        } else if (type === 'duplicate') {
          this.$ga.event('Session', 'duplicate')
          this.$parent.$parent.$refs.response_pop_up.show(`${this.selectedSessions.length > 1 ? 'Sessions' : 'Session'} duplicated`, 'Get programming!')
        } else if (type === 'progress') {
          this.$parent.$parent.$refs.response_pop_up.show('Sessions have been progressed', 'Please go through them to make sure that you\'re happy with it')
        }
        if (type !== 'progress') {
          this.sort_sessions(this.helper('match_plan'))
          this.check_for_new()
          this.adherence()
          this.check_for_week_sessions()
        }
        this.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.resolve_error(e)
      }
    },
    async delete_session (id) {
      this.$parent.$parent.dontLeave = true
      try {
        await this.$axios.delete(`https://api.traininblocks.com/workouts/${id}`)
        await this.$parent.get_sessions(parseInt(this.$route.params.id), parseInt(this.$route.params.client_id), true)
        await this.update_plan()

        this.$ga.event('Session', 'delete')
        this.check_for_week_sessions()
        this.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.resolve_error(e)
      }
    }
  }
}
</script>
