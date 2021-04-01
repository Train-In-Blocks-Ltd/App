<style scoped>
  /* Other */
  .dark_overlay {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vw;
    background-color: #00000060
  }

  /* Client */
  .client_info {
    display: grid;
    grid-gap: 1rem
  }

  /* Plan Info */
  .plan_info {
    display: flex;
    flex-direction: column
  }
  #plan .plan_info label {
    display: flex;
    align-items: center;
    grid-auto-columns: min-content
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
  .section--top {
    display: flex;
    justify-content: space-between
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
  .switch_cal {
    margin-bottom: .4rem
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
    opacity: .6
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
    opacity: .6
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
    opacity: .6
  }
  #info:active {
    transform: scale(.9)
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
  .wrapper--session, #plan_notes {
    display: grid;
    background-color: var(--fore);
    box-shadow: var(--low_shadow);
    padding: 2rem;
    border-radius: 10px
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
    grid-gap: 4rem
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
    padding: .2rem 1rem;
    border-radius: 3px;
    height: 20px
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
    opacity: .6
  }

  /* Graph */
  .graph {
    position: fixed;
    padding: 4rem 10vw 10rem calc(2rem + 38px + 10vw);
    top: 0;
    left: 0;
    z-index: 5;
    height: 100%;
    width: 100%;
    overflow-y: auto
  }
  .container--content {
    display: flex;
    flex-direction: column
  }
  .data-options {
    display: flex
  }
  .data-select {
    margin-right: 6rem
  }
  .data-select > div:first-child {
    margin-bottom: 2rem
  }
  .data-select__options {
    display: grid;
    grid-gap: 1rem;
    width: fit-content
  }
  .data-desc {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%
  }
  .data-desc__value {
    margin: .4rem 0 2rem 0;
    font-size: 2.4rem
  }
  .protocol_error {
    margin-top: 4rem
  }

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
    .graph {
      padding: 2rem 5vw 4rem 5vw
    }
    .expand-all:hover {
      opacity: 1
    }
    #copy:hover {
      opacity: 1
    }
    input.session-name {
      width: 60%
    }
  }

  @media (max-width: 576px) {
    /* Container */
    .plan_options {
      display: grid;
      grid-gap: 1rem
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
  }
</style>

<template>
  <div id="plan">
    <modal
      name="move"
      height="100%"
      width="100%"
      :adaptive="true"
      :click-to-close="false"
      @opened="$refs.range.focus()"
    >
      <form class="modal--move" @submit.prevent="move_to_week(), $modal.hide('move'), will_body_scroll(true)">
        <div class="center_wrapped">
          <h2>
            Move to a different microcycle
          </h2>
          <p class="grey">
            This will change the colour code assigned to the sessions
          </p><br>
          <label for="range">Move to:</label>
          <input
            id="range"
            ref="range"
            v-model="moveTarget"
            class="input--modal"
            name="range"
            type="number"
            min="1"
            :max="maxWeek"
            required
          ><br><br>
          <button type="submit">
            Move
          </button>
          <button class="red_button" @click.prevent="$modal.hide('move'), will_body_scroll(true)">
            Cancel
          </button>
        </div>
      </form>
    </modal>
    <modal
      name="shift"
      height="100%"
      width="100%"
      :adaptive="true"
      :click-to-close="false"
      @opened="$refs.range.focus()"
    >
      <form class="modal--shift" @submit.prevent="shift_across(), will_body_scroll(true)">
        <div class="center_wrapped">
          <h2>
            Shift the dates of the sessions
          </h2>
          <p class="grey">
            This will move the dates ahead or behind by the specified amount
          </p><br>
          <label for="range">Shift session dates by: </label>
          <input
            id="range"
            ref="range"
            v-model="shiftDays"
            class="input--modal"
            name="range"
            type="number"
            required
          ><br><br>
          <button type="submit">
            Shift
          </button>
          <button class="red_button" @click.prevent="$modal.hide('shift'), will_body_scroll(true)">
            Cancel
          </button>
        </div>
      </form>
    </modal>
    <modal
      name="copy"
      height="100%"
      width="100%"
      :adaptive="true"
      :click-to-close="false"
      @opened="$refs.range.focus()"
    >
      <div class="modal--copy">
        <form v-if="copyAcrossPage === 0" class="center_wrapped" @submit.prevent="copy_across_pull(), copyAcrossView = 0, copyAcrossPage += 1">
          <h2>
            Copy across to different microcycles
          </h2>
          <p class="grey">
            Progress each session in just a few clicks
          </p><br><br>
          <label for="range">From {{ currentWeek }} to: </label>
          <input
            id="range"
            ref="range"
            v-model="copyTarget"
            class="input--modal"
            name="range"
            type="number"
            :min="currentWeek + 1"
            :max="maxWeek"
            required
          >
          <br><br>
          <label for="range">Days until next sessions: </label>
          <input
            v-model="daysDiff"
            class="input--modal"
            name="range"
            type="number"
            min="1"
            required
          ><br><br>
          <button type="button" class="red_button" @click.prevent="$modal.hide('copy'), will_body_scroll(true)">
            Cancel
          </button>
          <button v-if="!simpleCopy" type="submit">
            Next
          </button>
          <button v-else @click.prevent="copy_across(), $modal.hide('copy'), will_body_scroll(true)">
            Copy
          </button>
        </form>
        <div v-else-if="copyAcrossPage !== 0 && copyAcrossPage !== selectedSessions.length + 1" class="center_wrapped">
          <form
            v-for="(protocol, protocolIndex) in copyAcrossProtocols"
            v-show="copyAcrossPage === protocolIndex + 1"
            :key="`protocol_${protocolIndex}`"
            class="bottom_margin"
            @submit.prevent="copyAcrossPage += 1, copyAcrossView = 0"
          >
            <div
              v-for="(exercises, exerciseGroupIndex) in copyAcrossInputs[protocolIndex][1]"
              v-show="copyAcrossView === exerciseGroupIndex"
              :key="`exercise_${protocolIndex}_${exerciseGroupIndex}`"
            >
              <h2>
                {{ protocol[1][exerciseGroupIndex][0] }}
              </h2>
              <p class="grey">
                {{ protocol[1][exerciseGroupIndex][1] }} {{ protocol[1][exerciseGroupIndex][2] }}
              </p>
              <div
                v-for="(exercise, exerciseIndex) in exercises"
                :key="`exercise_${protocolIndex}_${exerciseGroupIndex}_${exerciseIndex}`"
              >
                <br>
                <label :for="`${protocol[1][0][0]}_${exerciseIndex}`">
                  Week {{ currentWeek + exerciseIndex + 1 }}:
                </label>
                <input
                  v-model="copyAcrossInputs[protocolIndex][1][exerciseGroupIndex][exerciseIndex]"
                  :name="`${protocol[1][0][0]}_${exerciseIndex}`"
                  type="text"
                  required
                >
              </div>
              <br>
              <button v-if="copyAcrossView !== 0" class="red_button" type="button" @click.prevent="copyAcrossView -= 1">
                Back
              </button>
              <button v-if="copyAcrossView === 0" class="red_button" type="button" @click.prevent="copyAcrossView = copyAcrossInputs[protocolIndex - (copyAcrossPage === 1 ? 0 : 1)][1].length - 1, copyAcrossPage -= 1">
                Back
              </button>
              <button v-if="copyAcrossView === copyAcrossInputs[protocolIndex][1].length - 1" type="submit">
                Next
              </button>
              <button v-if="copyAcrossView !== copyAcrossInputs[protocolIndex][1].length - 1" @click.prevent="copyAcrossView += 1, copyAcrossViewMax = copyAcrossInputs[protocolIndex][1].length - 1">
                Next
              </button>
            </div>
          </form>
        </div>
        <form v-else-if="copyAcrossPage === selectedSessions.length + 1" class="center_wrapped" @submit.prevent="copy_across(), will_body_scroll(true)">
          <h2>
            You're all set
          </h2>
          <p class="grey">
            Are you ready to progress the {{ selectedSessions.length > 1 ? 'sessions' : 'session' }}
          </p><br>
          <button class="red_button" @click.prevent="copyAcrossView = copyAcrossViewMax, copyAcrossPage -= 1">
            Back
          </button>
          <button type="submit">
            Copy
          </button>
        </form>
      </div>
    </modal>
    <modal
      name="duplicate"
      height="100%"
      width="100%"
      :adaptive="true"
      :click-to-close="false"
    >
      <form class="modal--copy" @submit.prevent="duplicate_plan(duplicateClientID), $modal.hide('duplicate'), will_body_scroll(true)">
        <div class="center_wrapped">
          <h2>
            Create a similar plan
          </h2>
          <p class="grey">
            Copy this plan to the same/different client
          </p><br>
          <select v-model="duplicateClientID" name="duplicate_client">
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
          <button class="red_button" @click.prevent="$modal.hide('duplicate'), will_body_scroll(true)">
            Cancel
          </button>
        </div>
      </form>
    </modal>
    <div
      v-if="!$parent.$parent.loading && !isStatsOpen && !$parent.showOptions"
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
    <div :class="{opened_sections: isStatsOpen}" class="section_overlay" />
    <multiselect
      :type="'session'"
      :options="['Complete', 'Incomplete', 'Copy Across', 'Move', 'Shift', 'Print', 'Delete', 'Deselect']"
      :selected="selectedSessions"
      @response="resolve_session_multiselect"
    />
    <preview-modal
      :desc="previewDesc"
      :html="previewHTML"
      :show-media="true"
      @close="previewDesc = null, previewHTML = null"
    />
    <div v-show="editSession !== null" class="dark_overlay" />
    <!-- Loop through plans and v-if plan matches route so that plan data object is available throughout -->
    <div
      v-for="(plan, index) in $parent.$parent.client_details.plans"
      :key="index"
    >
      <div v-if="plan.id == $route.params.id">
        <div class="top_grid">
          <div class="client_info">
            <input
              v-model="$parent.$parent.client_details.name"
              class="text--large allow_text_overflow"
              type="text"
              aria-label="Client Name"
              autocomplete="name"
              :disabled="$parent.$parent.silent_loading"
              @blur="$parent.$parent.update_client()"
            >
            <!-- Update the plan info -->
            <div class="plan_info">
              <input
                v-model="plan.name"
                class="text--small allow_text_overflow"
                aria-label="Session name"
                type="text"
                name="name"
                :disabled="$parent.$parent.silent_loading"
                @blur="update_plan()"
              >
            </div>
          </div><br>  <!-- client_info -->
          <div class="wrapper--progress-bar">
            <div id="progress-bar" :class="{ fullBar: sessionsDone === sessionsTotal && sessionsTotal !== 0, noSessions: noSessions }">
              <p v-if="!noSessions" class="grey">
                Completed {{ sessionsDone }} of {{ sessionsTotal }} sessions
              </p>
              <p v-if="noSessions" class="grey">
                Add some sessions to see programme adherence here...
              </p>
            </div>
          </div><br>
          <div class="plan_options">
            <router-link
              :to="`/client/${$route.params.client_id}/`"
              class="a_link"
              href="javascript:void(0)"
            >
              <inline-svg :src="require('../../assets/svg/back.svg')" />
              Back to profile
            </router-link>
            <a
              class="a_link"
              href="javascript:void(0)"
              @click="$modal.show('duplicate'), will_body_scroll(false)"
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
        </div> <!-- top_grid -->
        <div class="plan_grid">
          <div class="calendar">
            <div id="plan_notes" :class="{ editorActive: editingPlanNotes }">
              <h2>
                Plan Notes
              </h2>
              <rich-editor
                :html-injection.sync="plan.notes"
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
                <h2>
                  Microcycles
                </h2>
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
                    @click="change_week(item), sort_sessions(plan)"
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
                      @click="previewDesc = 'How to track exercises to visualise in the Statistics tab', previewHTML = '<p><b>[ </b><em>Exercise Name</em><b>:</b> <em>Sets</em> <b>x</b> <em>Reps</em> <b>at</b> <em>Load</em> <b>]</b></p><br> <p><b>Examples</b></p><p><i>[Back Squat: 3x6 at 50kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50kg]</i></p> <p><i>[Back Squat: 3x6 at 50/55/60kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50/55/60kg]</i></p><br><hr><br><p><b>[ </b><em>Measurement</em><b>:</b> <em>Value</em> <b>]</b></p><br><p><b>Examples</b></p><p><i>[Weight: 50kg]</i></p> <p><i>[Vertical Jump: 43.3cm]</i></p> <p><i>[Body Fat (%): 12]</i></p> <p><i>[sRPE (CR10): 8]</i></p> <p><i>[sRPE (Borg): 16]</i></p><br> <p>See <i>Help</i> for more information</p><br>', will_body_scroll(false)"
                    />
                  </div>
                  <color-picker v-if="editingWeekColor" :injected-color.sync="weekColor.backgroundColor[currentWeek - 1]" />
                </div>
                <div>
                  <button class="button--new-session" @click="create_session()">
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
                    Select this week
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
                    class="wrapper--session fadeIn"
                    :class="{ editorActive: session.id === editSession }"
                    :style="{ zIndex: session.id === editSession ? 2 : 0 }"
                  >
                    <div class="session_header">
                      <div class="right_margin">
                        <span v-if="session.id !== editSession" class="text--name" :class="{newSession: session.name == 'Untitled' && !isEditingSession}"><b>{{ session.name }}</b></span><br v-if="session.id !== editSession">
                        <span v-if="session.id !== editSession" class="text--date">{{ day(session.date) }}</span>
                        <span v-if="session.id !== editSession" class="text--date">{{ session.date }}</span><br v-if="session.id !== editSession">
                        <span v-if="session.id !== editSession" :class="{incomplete: session.checked === 0, completed: session.checked === 1}" class="text--checked">{{ session.checked === 0 ? 'Incomplete' : 'Complete' }}</span>
                        <input
                          v-if="session.id === editSession"
                          v-model="session.name"
                          class="session-name small_border_radius"
                          type="text"
                          name="session-name"
                          pattern="[^\/]"
                          @blur="scan()"
                        >
                        <input
                          v-if="session.id === editSession"
                          v-model="session.date"
                          class="session-date small_border_radius"
                          type="date"
                          name="session-date"
                          @blur="scan()"
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
                      :item-id="session.id"
                      :editing="editSession"
                      :html-injection.sync="session.notes"
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
          <div v-if="isStatsOpen" class="graph fadeIn delay fill_mode_both">
            <div class="section--top">
              <h1 class="bottom_margin">
                Statistics
              </h1>
              <inline-svg v-if="isStatsOpen" class="icon--options" :src="require('../../assets/svg/close.svg')" aria-label="Close" @click="isStatsOpen = false, will_body_scroll(true)" />
            </div>
            <div class="container--content">
              <div class="data-options">
                <div class="data-select">
                  <div class="data-select__options">
                    <label for="measure">
                      Measurement:<br>
                      <select
                        v-model="selectedDataName"
                        class="small_border_radius width_300 text--small"
                        name="measure"
                        @change="sort_sessions(plan), scan(), selection()"
                      >
                        <option v-for="optionName in optionsForDataName" :key="'M' + optionName.id" :value="optionName.value">
                          {{ optionName.text }}
                        </option>
                      </select>
                    </label>
                  </div>
                  <div v-if="showType" class="data-select__options">
                    <label for="measure-type">
                      Data type:<br>
                      <select
                        v-model="selectedDataType"
                        class="small_border_radius width_300 text--small"
                        name="measure-type"
                        @change="sort_sessions(plan), scan(), selection()"
                      >
                        <option value="Sets">Sets</option>
                        <option value="Reps">Reps</option>
                        <option v-for="optionData in optionsForDataType" :key="'DT-' + optionData.id" :value="optionData.value">
                          {{ optionData.text }}
                        </option>
                      </select>
                    </label>
                  </div>
                </div>
                <div v-if="showType && descData.total.desc && !dataValues.includes(null)" class="data-desc">
                  <div class="container--data-desc">
                    <p class="data-desc__desc">
                      <b>{{ descData.total.desc }}</b>
                    </p>
                    <p class="data-desc__value">
                      {{ descData.total.value }}
                    </p>
                  </div>
                  <div class="container--data-desc">
                    <p class="data-desc__desc">
                      <b>{{ descData.average.desc }}</b>
                    </p>
                    <p class="data-desc__value">
                      {{ descData.average.value }}
                    </p>
                  </div>
                  <div class="container--data-desc">
                    <p class="data-desc__desc">
                      <b>{{ descData.max.desc }}</b>
                    </p>
                    <p class="data-desc__value">
                      {{ descData.max.value }}
                    </p>
                  </div>
                  <div class="container--data-desc">
                    <p class="data-desc__desc">
                      <b>{{ descData.min.desc }}</b>
                    </p>
                    <p class="data-desc__value">
                      {{ descData.min.value }}
                    </p>
                  </div>
                  <div class="container--data-desc">
                    <p class="data-desc__desc">
                      {{ descData.change.desc }}
                    </p>
                    <p class="data-desc__value">
                      {{ descData.change.value }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="protocol_error">
                <p v-show="protocolError.length !== 0" class="text--error">
                  There are some problems with your tracked exercises. Please check that the following measurements/exercises are using the correct format.
                </p>
                <p v-for="(error, indexer) in protocolError" v-show="protocolError.length !== 0" :key="indexer" class="text--error">
                  <b>{{ error.prot }} for {{ error.exercise }} from {{ error.sessionName }}</b>
                </p>
              </div><br>
              <simple-chart
                v-if="!dataValues.includes(null)"
                :data-points="dataValues"
                :labels="labelValues"
                :reset="resetGraph"
                aria-label="Graph"
                class="fadeIn"
              />
            </div>
          </div>
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
const SimpleChart = () => import(/* webpackChunkName: "components.simplechart", webpackPrefetch: true */ '../../components/SimpleChart')
const ColorPicker = () => import(/* webpackChunkName: "components.colorpicker", webpackPrefetch: true */ '../../components/ColorPicker')
const Multiselect = () => import(/* webpackChunkName: "components.multiselect", webpackPrefetch: true */ '../../components/Multiselect')
const PreviewModal = () => import(/* webpackChunkName: "components.previewModal", webpackPrefetch: true */ '../../components/PreviewModal')

export default {
  components: {
    Checkbox,
    WeekCalendar,
    MonthCalendar,
    RichEditor,
    SimpleChart,
    ColorPicker,
    Multiselect,
    PreviewModal
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
      todayDate: '',
      force: true,

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

      // STATS

      descData: {
        total: '',
        average: '',
        max: '',
        min: '',
        change: ''
      },
      selectedDataName: 'Plan Overview',
      optionsForDataName: [],
      optionsForDataType: [],
      selectedDataType: 'Sets',
      showType: true,
      isStatsOpen: false,
      resetGraph: 0,

      // SESSION CREATION

      new_session: {
        name: 'Untitled',
        date: ''
      },

      // MANIPULATION AND MODAL

      moveTarget: 1,
      copyTarget: 2,
      simpleCopy: true,
      copyAcrossPage: 0,
      copyAcrossView: 0,
      copyAcrossViewMax: 0,
      copyAcrossProtocols: [],
      copyAcrossInputs: [],
      daysDiff: 7,
      selectedSessions: [],
      shiftDays: 1,
      duplicateClientID: 'Select a client',

      // REGEX DATA //

      dataValues: [],
      labelValues: [],
      dataPacketStore: [],
      regexExtract: /\[\s*(.*?)\s*:\s*(.*?)\]/gi,
      regexSetsReps: /(\d*)x((\d*\/*)*)/gi,
      regexLoadCapture: /(at|@)\s*(\d*)\s*\w*/gi,
      regexNumberBreakdown: /[0-9.]+/gi,
      protocolError: [],

      // CALENDAR

      showMonthlyCal: false,
      sessionDates: [],
      forceUpdate: 0,

      // MICROCYCLE

      allowMoreWeeks: false,
      currentWeek: 1,
      maxWeek: '2'
    }
  },
  created () {
    this.will_body_scroll(true)
    this.$parent.sessions = true
    this.noSessions = this.helper('match_plan').sessions === false
    this.$parent.$parent.get_templates()
    this.today()
    this.check_for_new()
    this.adherence()
    this.scan()
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
        case 'Copy Across':
          this.copyTarget = this.maxWeek
          this.copy_across_check()
          this.$modal.show('copy')
          this.will_body_scroll(false)
          break
        case 'Move':
          this.$modal.show('move')
          this.will_body_scroll(false)
          break
        case 'Shift':
          this.$modal.show('shift')
          this.will_body_scroll(false)
          break
        case 'Print':
          this.print()
          break
        case 'Delete':
          this.bulk_delete()
          break
        case 'Deselect':
          this.deselect_all()
          break
      }
    },
    resolve_plan_info_editor (state) {
      const plan = this.helper('match_plan')
      switch (state) {
        case 'edit':
          this.$parent.$parent.dontLeave = true
          this.editingPlanNotes = true
          this.tempEditorStore = plan.notes
          break
        case 'save':
          this.editingPlanNotes = false
          this.update_plan(plan.notes)
          break
        case 'cancel':
          this.$parent.$parent.dontLeave = false
          this.editingPlanNotes = false
          plan.notes = this.tempEditorStore
          break
      }
    },
    resolve_session_editor (state, id) {
      const session = this.helper('match_session', id)
      switch (state) {
        case 'edit':
          this.$parent.$parent.dontLeave = true
          this.isEditingSession = true
          this.editSession = id
          this.forceStop += 1
          this.tempEditorStore = session.notes
          break
        case 'save':
          this.isEditingSession = false
          this.editSession = null
          this.update_session(id)
          this.scan()
          this.$parent.$parent.$refs.response_pop_up.show('Session updated', 'Your changes have been saved')
          break
        case 'cancel':
          this.$parent.$parent.dontLeave = false
          this.isEditingSession = false
          this.editSession = null
          session.notes = this.tempEditorStore
          this.scan()
          break
      }
    },

    // Background

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

    print () {
      const notesArr = []
      const plan = this.helper('match_plan')
      plan.sessions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })
      plan.sessions.forEach((session) => {
        if (this.selectedSessions.includes(session.id)) {
          notesArr.push(`<div class="session"><h1>${session.name}</h1><h2>${session.date}</h2><br>${this.remove_brackets_and_checkbox(this.update_content(session.notes))}</div>`)
        }
      })
      const newWindow = window.open()
      const html = notesArr.join('')
      newWindow.document.write(`<style>body>div{font-family: Arial, Helvetica, sans-serif;padding: 5% 10%}.session{padding: 36px 0}.session:not(:last-child){border-bottom: 1px solid #282828}</style><div>${html}</div>`)
      newWindow.stop()
      newWindow.print()
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
      this.$modal.hide('shift')
      this.$ga.event('Session', 'shift')
      this.$parent.$parent.$refs.response_pop_up.show(this.selectedSessions.length > 1 ? 'Shifted sessions' : 'Shifted session', 'Your changes have been saved')
      this.deselect_all()
    },
    copy_across_check () {
      this.simpleCopy = true
      this.helper('match_plan').sessions.forEach((session) => {
        if (this.selectedSessions.includes(session.id)) {
          if (this.pull_protocols(session.name, session.notes === null ? '' : session.notes, session.date).length !== 0) {
            this.simpleCopy = false
          }
        }
      })
    },
    copy_across_pull () {
      let ignored = 0
      this.copyAcrossInputs = []
      this.copyAcrossProtocols = []
      this.helper('match_plan').sessions.forEach((session, sessionIdx) => {
        if (this.selectedSessions.includes(session.id)) {
          this.copyAcrossProtocols.push([
            session.id,
            this.pull_protocols(session.name, session.notes, session.date)
          ])
          this.copyAcrossInputs.push([
            session.id,
            new Array(this.copyAcrossProtocols[sessionIdx - ignored][1].length)
          ])
          let i
          for (i = 0; i < this.copyAcrossProtocols[sessionIdx - ignored][1].length; i++) {
            this.copyAcrossInputs[sessionIdx - ignored][1][i] = new Array(this.copyTarget - this.currentWeek)
            let e
            for (e = 0; e < this.copyAcrossInputs[sessionIdx - ignored][1][i].length; e++) {
              this.copyAcrossInputs[sessionIdx - ignored][1][i][e] = this.copyAcrossProtocols[sessionIdx - ignored][1][i][2]
            }
          }
        } else {
          ignored++
        }
      })
    },
    copy_across_process (sessionId, sessionNotes, loc) {
      this.copyAcrossInputs.forEach((sessionItem, sessionItemId) => {
        let n = 0
        if (sessionItem[0] === sessionId) {
          sessionItem[1].forEach((exerciseGroup, exerciseGroupIndex) => {
            const regEx = new RegExp(`${this.copyAcrossProtocols[sessionItemId][1][exerciseGroupIndex][1]}\\s*:\\s*${this.copyAcrossProtocols[sessionItemId][1][exerciseGroupIndex][2]}`, 'g')
            sessionNotes = sessionNotes.replace(regEx, (match) => {
              return n === exerciseGroupIndex ? `${this.copyAcrossProtocols[sessionItemId][1][exerciseGroupIndex][1]}: ${exerciseGroup[loc - 1]}` : match
            })
            n++
          })
        }
      })
      return sessionNotes
    },
    copy_across () {
      const copysessions = []
      let weekCount = this.currentWeek + 1
      this.helper('match_plan').sessions.forEach((session) => {
        if (this.selectedSessions.includes(session.id)) {
          copysessions.push({
            id: session.id,
            name: session.name,
            date: session.date,
            notes: session.notes
          })
        }
      })
      const startWeek = this.currentWeek
      for (; weekCount <= this.copyTarget; weekCount++) {
        this.currentWeek = weekCount
        copysessions.forEach((session) => {
          this.new_session.name = session.name
          this.new_session.date = this.add_days(session.date, this.daysDiff * (weekCount - startWeek))
          this.currentCopySessionNotes = this.simpleCopy ? session.notes : this.copy_across_process(session.id, session.notes, weekCount - startWeek)
          this.add_session(true)
        })
      }
      this.currentCopySessionNotes = ''
      this.copyTarget = 1
      this.copyAcrossPage = 0
      this.copyAcrossView = 0
      this.copyAcrossViewMax = 0
      this.copyAcrossInputs = []
      this.copyAcrossProtocols = []
      this.new_session.name = 'Untitled'
      this.today()
      this.update_plan()
      this.$modal.hide('copy')
      this.deselect_all()
      this.$ga.event('Session', 'progress')
      this.$parent.$parent.end_loading()
    },
    move_to_week () {
      this.helper('match_plan').sessions.forEach((session) => {
        if (this.selectedSessions.includes(session.id)) {
          session.week_id = this.moveTarget
          this.update_session(session.id)
        }
      })
      this.currentWeek = parseInt(this.moveTarget)
      this.$ga.event('Session', 'move')
      this.$parent.$parent.$refs.response_pop_up.show(this.selectedSessions.length > 1 ? 'Moved sessions' : 'Moved session', 'Your changes have been saved')
      this.deselect_all()
    },
    async duplicate_plan (clientId) {
      const plan = this.helper('match_plan')
      await this.create_plan(plan.name, clientId, plan.duration, plan.block_color, plan.notes, plan.sessions)
      this.$router.push({ path: `/client/${this.$parent.$parent.client_details.client_id}/` })
      this.$modal.hide('duplicate')
      this.$parent.$parent.$refs.response_pop_up.show('Plan duplicated', 'Access it on your client\'s profile')
      this.$ga.event('Plan', 'duplicate')
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
        const idx = this.selectedSessions.indexOf(id)
        this.selectedSessions.splice(idx, 1)
      }
    },
    async create_session () {
      await this.add_session(false)
      this.$parent.$parent.end_loading()
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
      if (!this.noSessions) {
        this.helper('match_plan').sessions.forEach((session) => {
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
        const index = this.expandedSessions.indexOf(id)
        if (index > -1) {
          this.expandedSessions.splice(index, 1)
        }
      } else {
        this.expandedSessions.push(id)
      }
    },
    update_session_color () {
      const plan = this.helper('match_plan')
      plan.block_color = JSON.stringify(this.weekColor.backgroundColor).replace(/"/g, '').replace(/[[\]]/g, '').replace(/\//g, '')
      this.editingWeekColor = false
      this.update_plan()
      this.scan()
    },
    change_week (weekID) {
      this.currentWeek = weekID
      this.moveTarget = weekID
      this.check_for_week_sessions()
    },

    // CHART

    selection () {
      this.descData.total = ''
      this.descData.average = ''
      this.descData.max = ''
      this.descData.min = ''
      this.descData.change = ''
      this.dataValues = []
      this.labelValues = []
      this.protocolError = []
      this.optionsForDataType = []
      let overviewStore = []
      this.showType = true
      if (this.selectedDataName === 'Plan Overview') {
        this.optionsForDataType.push({
          id: 1,
          text: 'Load',
          value: 'Load'
        })
        this.optionsForDataType.push({
          id: 2,
          text: 'Volume',
          value: 'Volume'
        })
      }
      this.dataPacketStore.forEach((session) => {
        overviewStore = []
        session.forEach((exerciseDataPacket) => {
          const tidyA = this.selectedDataName.replace(/\(/g, '\\(')
          const tidyB = tidyA.replace(/\)/g, '\\)')
          const regex = RegExp(tidyB, 'gi')
          const protocol = exerciseDataPacket[2].replace(/\s/g, '')
          if (regex.test(exerciseDataPacket[1])) {
            this.labelValues.push([exerciseDataPacket[0], exerciseDataPacket[3]])
            if (exerciseDataPacket[2].includes('at') && this.optionsForDataType.length !== 2 && this.protocolError.length === 0) {
              this.optionsForDataType.push({
                id: 1,
                text: 'Load',
                value: 'Load'
              })
              this.optionsForDataType.push({
                id: 2,
                text: 'Volume',
                value: 'Volume'
              })
            }
            if ((this.selectedDataType === 'Sets' || this.selectedDataType === 'Reps') && exerciseDataPacket[2].includes('x')) {
              this.dataValues.push(this.sets_reps(exerciseDataPacket, protocol, this.selectedDataType))
            } else if (this.selectedDataType === 'Load' && exerciseDataPacket[2].includes('at')) {
              this.dataValues.push(this.load(exerciseDataPacket, protocol))
            } else if (this.selectedDataType === 'Volume' && exerciseDataPacket[2].includes('at')) {
              const agg = this.sets_reps(exerciseDataPacket, protocol, 'Reps') * this.load(exerciseDataPacket, protocol)
              this.dataValues.push(agg)
            } else if (!exerciseDataPacket[2].includes('x')) {
              this.showType = false
              this.dataValues.push(this.other_measures(protocol))
            }
          }
          if (this.selectedDataName === 'Plan Overview' && exerciseDataPacket[2].includes('at')) {
            const dataForSum = () => {
              switch (this.selectedDataType) {
                case 'Sets' || 'Reps':
                  return this.sets_reps(exerciseDataPacket, protocol, this.selectedDataType)
                case 'Load':
                  return this.load(exerciseDataPacket, protocol)
                case 'Volume':
                  return this.sets_reps(exerciseDataPacket, protocol, 'Reps') * this.load(exerciseDataPacket, protocol)
              }
            }
            overviewStore.push(dataForSum())
            if (overviewStore.length !== 0) {
              this.dataValues.push(overviewStore.reduce((a, b) => a + b))
              this.desc_stats(this.selectedDataType)
            }
            for (let x = 1; x <= this.dataValues.length; x++) {
              this.labelValues.push(['Session ' + x])
            }
          }
        })
      })
      this.resetGraph += 1
    },

    // DATE/TIME

    today () {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      this.new_session.date = `${yyyy}-${mm}-${dd}`
      this.todayDate = `${yyyy}-${mm}-${dd}`
    },
    add_days (date, days) {
      const d = new Date(date)
      d.setDate(d.getDate() + days)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const dayDate = d.getDate()
      return `${year}-${month}-${dayDate}`
    },
    plan_duration (duration) {
      // Turn the duration of the plan into an array to render the boxes in the table
      const arr = []
      let i
      for (i = 1; i < parseInt(duration, 10) + 1; i++) {
        arr.push(i)
      }
      return arr
    },

    // INIT AND BACKGROUND

    adherence () {
      this.sessionsDone = 0
      this.sessionsTotal = 0
      if (!this.noSessions) {
        this.helper('match_plan').sessions.forEach((session) => {
          this.sessionsTotal += 1
          if (session.checked === 1) {
            this.sessionsDone++
          }
        })
      }
      const bar = document.getElementById('progress-bar')
      if (bar) {
        bar.style.width = this.sessionsDone / this.sessionsTotal * 100 + '%'
      }
    },
    expand_all (toExpand) {
      try {
        const plan = this.helper('match_plan')
        if (Array.isArray(plan.sessions)) {
          if (plan.sessions.length !== 0) {
            plan.sessions.forEach((session) => {
              if (toExpand === 'Expand') {
                this.expandedSessions.push(session.id)
              } else {
                let x = 0
                const y = this.expandedSessions.length
                for (; x < y; x++) {
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
    scan () {
      this.dataPacketStore.length = 0
      this.sessionDates.length = 0
      const plan = this.helper('match_plan')
      this.weekColor.backgroundColor = plan.block_color.replace('[', '').replace(']', '').split(',')
      this.maxWeek = plan.duration
      if (plan.sessions !== null && !this.noSessions) {
        plan.sessions.forEach((object) => {
          this.sessionDates.push({
            title: object.name,
            date: object.date,
            color: this.weekColor.backgroundColor[object.week_id - 1],
            textColor: this.accessible_colors(this.weekColor.backgroundColor[object.week_id - 1]),
            week_id: object.week_id,
            session_id: object.id
          })
          if (object.notes !== null) {
            this.dataPacketStore.push(this.pull_protocols(object.name, object.notes, object.date))
          }
        })
        // Appends the options to the select
        if (this.dataPacketStore !== null) {
          this.dropdown_init()
          this.selection()
        }
      }
      this.forceUpdate += 1
      this.check_for_week_sessions()
    },

    // Init the dropdown selection with validation
    dropdown_init () {
      this.optionsForDataName = [{ id: 0, text: 'Plan Overview', value: 'Plan Overview' }]
      const tempItemStore = []
      const tempItemStoreLate = []
      let continueValue = 0
      this.dataPacketStore.forEach((item) => {
        item.forEach((exerciseDataPacket) => {
          const tidyA = exerciseDataPacket[1].replace(/\(/g, '\\(')
          const tidyB = tidyA.replace(/\)/g, '\\)')
          const regexA = RegExp(tidyB, 'gi')
          const itemCased = this.proper_case(exerciseDataPacket[1])
          if (!regexA.test(tempItemStore) && exerciseDataPacket[2].includes('at')) {
            tempItemStore.push(itemCased)
          }
          if (!regexA.test(tempItemStoreLate) && !exerciseDataPacket[2].includes('at')) {
            tempItemStoreLate.push(exerciseDataPacket[1])
          }
        })
      })
      tempItemStore.forEach((item, index) => {
        continueValue = index + 1
        this.optionsForDataName.push({
          id: continueValue,
          text: item,
          value: item
        })
      })
      tempItemStoreLate.forEach((item, index) => {
        this.optionsForDataName.push({
          id: continueValue + index + 1,
          text: item,
          value: item
        })
      })
    },

    // REGEX

    sets_reps (exerciseDataPacket, protocol, selectedDataType) {
      const tempSetsRepsStore = []
      let setStore = null
      let extractedSetsReps = null
      let m
      let n
      while ((m = this.regexSetsReps.exec(protocol)) !== null) {
        if (m.index === this.regexSetsReps.lastIndex) {
          this.regexSetsReps.lastIndex++
        }
        m.forEach((match, groupIndex) => {
          if (groupIndex === 1) {
            setStore = parseInt(match)
          }
          if (selectedDataType === 'Sets' && groupIndex === 1) {
            if (match === '' || isNaN(match)) {
              this.protocolError.push({
                sessionName: exerciseDataPacket[0],
                exercise: exerciseDataPacket[1],
                prot: exerciseDataPacket[2]
              })
            }
            extractedSetsReps = parseInt(match)
          } else if (selectedDataType === 'Reps' && groupIndex === 2) {
            if (match === '' || isNaN(match)) {
              this.protocolError.push({
                sessionName: exerciseDataPacket[0],
                exercise: exerciseDataPacket[1],
                prot: exerciseDataPacket[2]
              })
            } else if (match.includes('/')) {
              while ((n = this.regexNumberBreakdown.exec(match)) !== null) {
                if (n.index === this.regexNumberBreakdown.lastIndex) {
                  this.regexNumberBreakdown.lastIndex++
                }
                n.forEach((repsMatchExact) => {
                  tempSetsRepsStore.push(parseInt(repsMatchExact))
                })
              }
              extractedSetsReps = tempSetsRepsStore.reduce((a, b) => a + b)
            } else {
              extractedSetsReps = parseInt(match) * parseInt(setStore)
            }
          }
        })
      }
      return extractedSetsReps
    },
    load (exerciseDataPacket, protocol) {
      const tempLoadStore = []
      const sets = this.sets_reps(exerciseDataPacket, protocol, 'Sets')
      let sum = 0
      let isMultiple = false
      let m
      let n
      while ((m = this.regexLoadCapture.exec(protocol)) !== null) {
        if (m.index === this.regexLoadCapture.lastIndex) {
          this.regexLoadCapture.lastIndex++
        }
        m.forEach((loadMatch, groupIndex) => {
          if (groupIndex === 2 && isNaN(loadMatch)) {
            this.protocolError.push({
              sessionName: exerciseDataPacket[0],
              exercise: exerciseDataPacket[1],
              prot: exerciseDataPacket[2]
            })
          } else if (groupIndex === 2) {
            while ((n = this.regexNumberBreakdown.exec(loadMatch)) !== null) {
              if (n.index === this.regexNumberBreakdown.lastIndex) {
                this.regexNumberBreakdown.lastIndex++
              }
              n.forEach((loadMatchExact) => {
                if (loadMatch.includes('/')) {
                  tempLoadStore.push(parseFloat(loadMatchExact))
                  isMultiple = true
                } else {
                  sum = parseFloat(loadMatchExact) * sets
                }
              })
            }
          }
        })
      }
      if (isMultiple) {
        sum = tempLoadStore.reduce((a, b) => a + b)
      }
      return sum
    },
    other_measures (protocol) {
      let data = 0
      let m
      while ((m = this.regexNumberBreakdown.exec(protocol)) !== null) {
        if (m.index === this.regexNumberBreakdown.lastIndex) {
          this.regexNumberBreakdown.lastIndex++
        }
        m.forEach((match) => {
          data = parseFloat(match)
        })
      }
      return data
    },
    desc_stats (selectedDataType) {
      let storeMax = 0
      let store = 0
      const sum = this.dataValues.reduce((a, b) => a + b)
      this.descData.total = {
        desc: `Total ${selectedDataType}: `,
        value: sum
      }
      this.descData.average = {
        desc: `Average ${selectedDataType}: `,
        value: (sum / this.dataValues.length).toFixed(1)
      }
      this.dataValues.forEach((value) => {
        storeMax = Math.max(storeMax, value)
      })
      this.descData.max = {
        desc: `Maximum ${selectedDataType}: `,
        value: storeMax
      }
      store = storeMax
      this.dataValues.forEach((value) => {
        store = Math.min(store, value)
      })
      this.descData.min = {
        desc: `Minimum ${selectedDataType}: `,
        value: store
      }
      this.descData.change = {
        desc: 'Percentage Change: ',
        value: (((storeMax / store) - 1) * 100).toFixed(1) + '%'
      }
    },

    // DATABASE

    async create_plan (planName, clientId, planDuration, planColors, planNotes, planSessions) {
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
              this.add_session(false, [
                session.name,
                response.data[0]['LAST_INSERT_ID()'],
                session.date,
                session.notes,
                session.week_id
              ])
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
    async update_plan (forceNotes, forceID, forceName, forceDuration, forceColors) {
      this.$parent.$parent.silent_loading = true
      const plan = this.helper('match_plan')
      try {
        this.sort_sessions(plan)
        const response = await this.$axios.post('https://api.traininblocks.com/programmes',
          {
            id: forceID === undefined ? plan.id : forceID,
            name: forceName === undefined ? plan.name : `Copy of ${forceName}`,
            duration: forceDuration === undefined ? plan.duration : forceDuration,
            notes: forceNotes === undefined ? plan.notes : forceNotes,
            block_color: forceColors === undefined ? plan.block_color : forceColors,
            ordered: plan.ordered
          }
        )
        // Set vue client_details data to new data
        let x
        // Loop through client_details plans
        for (x in this.$parent.$parent.client_details.plans) {
          if (this.$parent.$parent.client_details.plans[x].id === this.$route.params.id) {
            this.$parent.$parent.client_details.plans[x] = JSON.parse(JSON.stringify(Object.assign({}, response.data)).replace('{"0":', '').replace('}}', '}'))
          }
        }
        // Set vue client plans data to new data
        x = 0
        let y
        for (x in this.$parent.$parent.clients) {
          if (this.$parent.$parent.clients[x].client_id === this.$route.params.client_id) {
            for (y in this.$parent.$parent.clients[x].plans[y]) {
              if (this.$parent.$parent.clients[x].plans[y].id === this.$route.params.id) {
                this.$parent.$parent.clients[x].plans[y] = JSON.parse(JSON.stringify(Object.assign({}, response.data)).replace('{"0":', '').replace('}}', '}'))
              }
            }
          }
        }
        // Update the localstorage with the plans
        localStorage.setItem('clients', JSON.stringify(this.$parent.$parent.clients))
        this.$ga.event('Plan', 'update')
        this.scan()
        this.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.resolve_error(e)
      }
    },
    async delete_plan () {
      if (await this.$parent.$parent.$refs.confirm_pop_up.show('Are you sure you want to delete this plan?', 'We will remove this plan from our database and it won\'t be recoverable.')) {
        const id = parseInt(this.$route.params.id)
        try {
          await this.$axios.delete(`https://api.traininblocks.com/programmes/${id}`)
          await this.$parent.$parent.clients_f()
          this.$parent.$parent.clients_to_vue()
          this.$router.push({ path: `/client/${this.$parent.$parent.client_details.client_id}/` })
          this.$ga.event('Session', 'delete')
          this.$parent.$parent.$refs.response_pop_up.show('Plan deleted', 'Your changes have been saved')
          this.$parent.$parent.end_loading()
        } catch (e) {
          this.$parent.$parent.resolve_error(e)
        }
      }
    },
    async update_session (id) {
      const session = this.helper('match_session', id)
      try {
        await this.$axios.post('https://api.traininblocks.com/workouts',
          {
            id: session.id,
            name: session.name,
            date: session.date,
            notes: session.notes,
            week_id: session.week_id,
            checked: session.checked
          }
        )
        await this.$parent.get_sessions(parseInt(this.$route.params.id), true)
        await this.update_plan()
        this.adherence()
        this.$ga.event('Session', 'update')
        this.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.resolve_error(e)
      }
    },
    async add_session (isCopy, forceArr) {
      try {
        await this.$axios.put('https://api.traininblocks.com/workouts',
          {
            name: forceArr === undefined ? this.new_session.name : forceArr[0],
            programme_id: forceArr === undefined ? this.$route.params.id : forceArr[1],
            date: forceArr === undefined ? this.new_session.date : forceArr[2],
            notes: forceArr === undefined ? this.currentCopySessionNotes : forceArr[3],
            week_id: forceArr === undefined ? this.currentWeek : forceArr[4]
          }
        )
        // Get the sessions from the API because we've just created a new one
        await this.$parent.get_sessions(parseInt(this.$route.params.id), true)
        this.sort_sessions(this.helper('match_plan'))
        this.scan()
        this.check_for_new()
        this.adherence()
        this.$ga.event('Session', 'new')
        if (!isCopy) {
          this.$parent.$parent.$refs.response_pop_up.show('New session added', 'Get programming!')
        } else {
          this.$parent.$parent.$refs.response_pop_up.show('Sessions have been progressed', 'Please go through them to make sure that you\'re happy with it')
        }
        this.new_session = {
          name: 'Untitled',
          date: this.todayDate,
          notes: null,
          week_id: '',
          block_color: ''
        }
        this.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.resolve_error(e)
      }
    },
    async delete_session (id) {
      try {
        await this.$axios.delete(`https://api.traininblocks.com/workouts/${id}`)
        await this.$parent.get_sessions(parseInt(this.$route.params.id), true)
        await this.update_plan()

        this.$ga.event('Session', 'delete')
        this.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.resolve_error(e)
      }
    }
  }
}
</script>
