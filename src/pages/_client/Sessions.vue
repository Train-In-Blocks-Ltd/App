<style scoped>
  /* Animation */
  .section--a, .section--b {
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    background-color: #F4F4F4;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .section--a {
    height: 50%
  }
  .section--b {
    height: 50%;
    top: 50%;
    transition-delay: .2s
  }
  .section--a.openedStats,  .section--b.openedStats {
    width: 100%;
    z-index: 2
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
  #duration, .plan_info input#start {
    font-size: 1rem;
    margin-left: 1rem
  }
  .multi-select {
    display: grid;
    grid-gap: .4rem;
    position: fixed;
    top: 0;
    right: 0;
    text-align: right;
    background-color: white;
    box-shadow: 0 0 20px 10px #28282810;
    width: 100%;
    z-index: 9;
    padding: 2rem
  }
  .multi-select a {
    color: #282828;
    text-decoration: none;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .multi-select a:hover {
    opacity: .6
  }
  .floating_nav__icon {
    cursor: pointer
  }
  .section--top {
    display: flex;
    justify-content: space-between
  }
  .section-title {
    margin: 0 0 2rem 0
  }
  .text--selected {
    font-size: .8rem
  }
  .icon--expand {
    cursor: pointer;
    vertical-align: middle;
    margin-top: .8rem;
    transition: all .4s
  }
  .icon--expand.expanded {
    transform: rotate(180deg)
  }

  /* Plan Grid */
  .plan_grid {
    display: grid;
    grid-gap: 6rem;
    margin-top: 4rem
  }
  .plan-notes {
    grid-area: b;
    margin: 0 0 4rem 0
  }
  .plan-notes__header {
    display: flex
  }
  .a--plan-notes {
    color: #282828;
    font-size: .8rem;
    margin-left: 1rem;
    align-self: center;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .a--plan-notes:hover {
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
  #duration {
    width: 6rem
  }
  .plan_table {
    height: fit-content
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
  #info {
    fill: #282828
  }

  /* Week */
  .week-color-picker {
    margin: auto 0;
    height: 28px;
    border: #282828
  }
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
    box-shadow: 0 0 14px 08px #28282808;
    background-color: #F2F2F2;
    min-width: 50px;
    height: 74px;
    width: 100%;
    border-radius: 6px;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .week:hover {
    box-shadow: inset 0 20px 30px -30px #28282840
  }
  .weekActive {
    border-bottom: 2px solid #EEEEEE;
    box-shadow: 0 0 20px 10px #28282815;
    background-color: white;
    height: 94px
  }
  .week.weekActive:hover {
    box-shadow: 0 0 20px 10px #28282808
  }

  /* Copy */
  #copy, #info {
    margin: auto 0 auto 1rem;
    cursor: pointer;
    transition: opacity 1s, transform .1s cubic-bezier(.075, .82, .165, 1)
  }
  #copy:hover, #info:hover {
    opacity: .6
  }
  #copy:active, #info:active {
    transform: scale(.9)
  }

  /* Sessions */
  .session--header {
    display: flex;
    justify-content: space-between;
    align-items: center
  }
  .session--header__left {
    display: flex
  }
  .expand-all {
    text-align: right;
    margin: 2rem 0;
    font-size: .8rem;
    cursor: pointer;
    opacity: 1;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .expand-all:hover {
    opacity: .6
  }
  .wrapper--session {
    display: grid;
    box-shadow: 0 0 20px 10px #28282810;
    padding: 2rem;
    border-radius: 3px
  }
  .wrapper--session__header {
    display: flex;
    justify-content: space-between
  }
  .header-options {
    display: flex;
    flex-direction: column;
    align-items: center
  }
  .select-checkbox {
    vertical-align: middle;
    height: 1.4rem;
    width: 1.4rem;
    cursor: pointer
  }
  .container--sessions {
    display: grid;
    grid-gap: 4rem
  }
  input.session-name, input.session-date {
    text-overflow: ellipsis;
    border: 0;
    border-bottom: 1px solid #282828;
    outline-width: 0;
    padding: 0
  }
  input.session-name {
    cursor: pointer;
    font-size: 1rem
  }
  input.session-name:hover {
    opacity: .6
  }
  input.session-date {
    cursor: pointer;
    width: fit-content;
    font-size: .8rem
  }
  .show-feedback {
    margin: 1rem 0;
    padding: 0
  }
  .bottom-bar .button {
    margin: 0
  }
  .newSession {
    color: #B80000
  }
  .incomplete {
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
    padding: 4rem 20vw 10rem calc(2rem + 38px + 20vw);
    top: 0;
    left: 0;
    z-index: 2;
    height: 100%;
    width: 100%;
    overflow-x: auto
  }
  .container--content {
    display: flex;
    flex-direction: column
  }
  .data-select {
    display: grid;
    grid-gap: 2rem;
    width: fit-content
  }
  .data-select__options {
    display: grid;
    grid-gap: 1rem;
    width: fit-content
  }
  .data-select__options select {
    background-color: transparent;
    border: 0;
    font-size: 1.6rem;
    width: fit-content;
    padding: .2rem 1rem .2rem 0;
    margin: .4rem 0
  }
  #chart {
    margin: 4rem 0;
    position: relative
  }
  .data-desc {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 4rem
  }
  .data-desc__value {
    margin: .4rem 0 2rem 0;
    font-size: 2.4rem
  }

  @media (max-width: 992px) {
    .graph {
      padding: 4rem 10vw
    }
    .expand-all:hover {
      opacity: 1
    }
  }
  @media (max-width: 768px) {
    .graph {
      padding: 2rem 5vw 4rem 5vw
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
      width: 100%
    }
  }
</style>

<template>
    <div id="plan">
      <modal name="info" height="100%" width="100%" :adaptive="true" :clickToClose="false">
        <div class="modal--info">
          <div class="wrapper--centered-item">
            <p><b>The format for tracking data</b></p><br>
            <p><b>[ </b><em>Exercise Name</em><b>:</b> <em>Sets</em> <b>x</b> <em>Reps</em> <b>at</b> <em>Load</em> <b>]</b></p><br>
            <p><b>Examples</b></p><br>
            <p><i>[Back Squat: 3x6 at 50kg]</i></p>
            <p><i>[Back Squat: 3x6/4/3 at 50kg]</i></p>
            <p><i>[Back Squat: 3x6 at 50/55/60kg]</i></p>
            <p><i>[Back Squat: 3x6/4/3 at 50/55/60kg]</i></p><br>
            <p><b>[ </b><em>Measurement</em><b>:</b> <em>Value</em> <b>]</b></p><br>
            <p><b>Examples</b></p><br>
            <p><i>[Weight: 5okg]</i></p>
            <p><i>[Vertical Jump: 43.3cm]</i></p>
            <p><i>[Body Fat (%): 12]</i></p>
            <p><i>[sRPE (CR10): 8]</i></p>
            <p><i>[sRPE (Borg): 16]</i></p><br>
            <p>See <i>Help</i> for more information</p><br>
            <button class="cancel" @click="$modal.hide('info'), $parent.$parent.willBodyScroll(true)">Close</button>
          </div>
        </div>
      </modal>
      <modal name="move" height="100%" width="100%" :adaptive="true" :clickToClose="false">
        <form @submit.prevent="initMove(), $modal.hide('move'), $parent.$parent.willBodyScroll(true)" class="modal--move">
          <div class="wrapper--centered-item">
            <label for="range">Move to:</label>
            <input class="input--modal" name="range" type="number" v-model="moveTarget" min="1" :max="maxWeek" required/><br><br>
            <button type="submit">Move</button>
            <button class="cancel" @click.prevent="$modal.hide('move'), $parent.$parent.willBodyScroll(true)">Cancel</button>
          </div>
        </form>
      </modal>
      <modal name="shift" height="100%" width="100%" :adaptive="true" :clickToClose="false">
        <form @submit.prevent="shiftAcross(), $parent.$parent.willBodyScroll(true)" class="modal--shift">
          <div class="wrapper--centered-item">
            <label for="range">Shift session dates by: </label>
            <input class="input--modal" v-model="shiftDays" name="range" type="number" min="1" required/><br>
            <button type="submit">Shift</button>
            <button class="cancel" @click.prevent="$modal.hide('shift'), $parent.$parent.willBodyScroll(true)">Cancel</button>
          </div>
        </form>
      </modal>
      <modal name="copy" height="100%" width="100%" :adaptive="true" :clickToClose="false">
        <form @submit.prevent="copyAcross(), $parent.$parent.willBodyScroll(true)" class="modal--copy">
            <div class="wrapper--centered-item">
              <label for="range">From {{currentWeek}} to: </label>
              <input class="input--modal" v-model="copyTarget" name="range" type="number" :min="currentWeek + 1" :max="maxWeek" required/><br>
              <label for="range">Days until next sessions: </label>
              <input class="input--modal" v-model="daysDiff" name="range" type="number" min="1" required/><br>
              <button type="submit">Copy</button>
              <button class="cancel" @click.prevent="$modal.hide('copy'), $parent.$parent.willBodyScroll(true)">Cancel</button>
            </div>
        </form>
      </modal>
      <div class="icon--open-stats" v-show="!isStatsOpen && $parent.showOptions === false" @click="isStatsOpen = true, $parent.$parent.willBodyScroll(false)" aria-label="Menu">
        <inline-svg :src="require('../../assets/svg/stats.svg')" aria-label="Statistics"/>
        <p class="text">Statistics</p>
      </div>
      <div class="open-stats-animation">
        <div :class="{openedStats: isStatsOpen}" class="section--a" />
        <div :class="{openedStats: isStatsOpen}" class="section--b"/>
      </div>
      <transition enter-active-class="animate animate__fadeIn animate__faster" leave-active-class="animate animate__fadeOut animate__faster">
        <div class="multi-select" v-if="selectedSessions.length !== 0">
          <p class="text--selected">
            <b>Selected {{selectedSessions.length}} <span v-if="selectedSessions.length === 1">Session</span><span v-if="selectedSessions.length !== 1">Sessions</span> to ...</b>
          </p>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="$modal.show('copy'), $parent.$parent.willBodyScroll(false)">Copy Across</a>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="$modal.show('move'), $parent.$parent.willBodyScroll(false)">Move</a>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="$modal.show('shift'), $parent.$parent.willBodyScroll(false)">Shift</a>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="bulkDelete()">Delete</a>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="deselectAll()">Deselect</a>
        </div>
      </transition>
      <!-- Loop through plans and v-if plan matches route so that plan data object is available throughout -->
      <div v-for="(plan, index) in this.$parent.$parent.client_details.plans"
        :key="index">
        <div v-if="plan.id == $route.params.id">
          <div class="top_grid">
            <div class="client_info">
              <input @blur="$parent.update_client()" class="text--large allow-text-overflow" type="text" aria-label="Client Name" autocomplete="name" v-model="$parent.$parent.client_details.name" />
               <!-- Update the plan info -->
              <form class="plan_info">
                <input class="text--small allow-text-overflow" aria-label="Session name" type="text" name="name" v-model="plan.name" @blur="update_plan()">
              </form>
            </div>  <!-- client_info -->
          </div> <!-- top_grid -->
          <div class="plan_grid">
            <div class="calendar">
              <div class="plan-notes">
                <div class="plan-notes__header">
                  <p class="text--small">Plan Notes</p>
                  <a class="a--plan-notes" href="javascript:void(0)" v-show="!editPlanNotes" @click="editingPlanNotes(true), cancelSessionNotes()">
                    Edit
                  </a>
                </div>
                <quill v-show="editPlanNotes" v-model="plan.notes" output="html" class="quill animate animate__fadeIn" :config="$parent.$parent.quill_config"/>
                <div v-if="!editPlanNotes  && plan.notes !== '' && plan.notes !== null" v-html="plan.notes" class="show-plan-notes animate animate__fadeIn"/>
                <p v-if="!editPlanNotes && (plan.notes === '' || plan.notes === null)" class="show-plan-notes">No plan notes added...</p>
                <div class="bottom-bar">
                  <div>
                    <button v-show="editPlanNotes" @click="editingPlanNotes(false)" class="button--save">Save</button>
                    <button v-show="editPlanNotes" @click="cancelPlanNotes()" class="cancel">Cancel</button>
                  </div>
                </div>
              </div>
              <div class="wrapper--calendar">
                <FullCalendar defaultView="dayGridMonth" :firstDay="1" :plugins="calendarPlugins" :header="calendarToolbarHeader" :footer="calendarToolbarFooter" :events="sessionDates" />
              </div>
            </div>
            <div class="wrapper-plan">
              <div class="plan_table">
                <div class="plan_table__header">
                  <p class="text--small">Microcycles</p>
                  <div class="wrapper-duration">
                    <label for="duration">Duration: </label>
                    <input id="duration" type="number" name="duration" inputmode="decimal" v-model="plan.duration" min="1" required @blur="update_plan()" @change="weekConfirm(plan.duration), maxWeek = plan.duration"/>
                  </div>
                </div>
                <div class="plan_table--container">
                  <div class="plan_table--container--plan_duration_container">
                    <div @click="changeWeek(item), sortSessions()" v-for="item in plan_duration(plan.duration)" :key="item" class="container--week">
                      <div :class="{ weekActive: item === currentWeek }" class="week">
                        <div :style="{ backgroundColor: weekColor.backgroundColor[item - 1] }" class="week__color"/>
                        <div class="week__number">{{item}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> <!-- plan_table -->
              <div class="sessions">
                <div class="session--header">
                  <div class="session--header__left">
                    <input @blur="updateSessionColor()" class="week-color-picker" v-model="weekColor.backgroundColor[currentWeek - 1]" type="color" aria-label="Week Color" />
                    <inline-svg id="info" :src="require('../../assets/svg/info.svg')" title="Info" @click="$modal.show('info'), $parent.$parent.willBodyScroll(false)"/>
                  </div>
                  <button class="button--new-session" @click="createSession()">New session</button>
                </div>
                <p v-if="$parent.no_sessions">No sessions yet. You can add one below.</p>
                <p v-if="$parent.loading_sessions">Loading sessions...</p>
                <div>
                  <p class="expand-all" @click="expandAll(expandText(expandedSessions))">{{ expandText(expandedSessions) }} all</p>
                  <!-- New session -->
                  <div class="container--sessions" v-if="!$parent.no_sessions">
                    <!-- Loop through sessions -->
                    <div :id="'session-' + session.id" class="wrapper--session" :class="{showingFeedback: session.id === showFeedback}" v-show="session.week_id === currentWeek" v-for="(session, index) in plan.sessions"
                      :key="index">
                      <div class="wrapper--session__header">
                        <div>
                          <span v-if="session.id !== editSession" class="text--name" :class="{newSession: session.name == 'Untitled' && !isEditingSession}"><b>{{session.name}}</b></span><br v-if="session.id !== editSession">
                          <span v-if="session.id !== editSession" class="text--date">{{day(session.date)}}</span>
                          <span v-if="session.id !== editSession" class="text--date">{{session.date}}</span><br v-if="session.id !== editSession">
                          <span v-if="session.id !== editSession" :class="{incomplete: session.checked === 0, completed: session.checked === 1}" class="text--checked">{{isCompleted(session.checked)}}</span>
                          <input @blur="scan()" v-if="session.id === editSession" class="session-name" type="text" name="session-name" pattern="[^\/]" v-model="session.name" /><br>
                          <input @blur="scan()" v-if="session.id === editSession" class="session-date" type="date" name="session-date" v-model="session.date" /><br>
                          <span @click="session.checked = toggleComplete(session.checked)" v-if="session.id === editSession" :class="{incomplete: session.checked === 0, completed: session.checked === 1, editingChecked: session.id === editSession}" class="text--checked">{{isCompleted(session.checked)}}</span>
                        </div>
                        <div class="header-options">
                          <input name="select-checkbox" :id="'sc-' + session.id" class="select-checkbox" type="checkbox" @change="changeSelectCheckbox(session.id)" aria-label="Select this session">
                          <inline-svg id="expand" class="icon--expand" :class="{expanded: expandedSessions.includes(session.id)}" :src="require('../../assets/svg/expand.svg')" title="Info" @click="toggleExpandedSessions(session.id)"/>
                        </div>
                      </div>
                      <quill v-if="session.id === editSession && expandedSessions.includes(session.id)" v-model="session.notes" output="html" class="quill animate animate__fadeIn" :config="$parent.$parent.quill_config"/>
                      <div v-if="session.id !== editSession && expandedSessions.includes(session.id)" v-html="removeBracketsAndBreaks(session.notes)" tabindex="0" class="show-session animate animate__fadeIn"/>
                      <div v-if="session.id === showFeedback" class="show-feedback animate animate__fadeIn">
                        <p><b>Feedback</b></p><br>
                        <div v-html="session.feedback" />
                      </div>
                      <div class="bottom-bar" v-if="expandedSessions.includes(session.id)">
                        <div>
                          <button v-show="!isEditingSession" v-if="session.id !== editSession" @click="editingSessionNotes(session.id, true), cancelPlanNotes()">Edit</button>
                          <button v-if="session.id === editSession" @click="editingSessionNotes(session.id, false)">Save</button>
                          <button class="cancel" v-if="session.id === editSession" @click="cancelSessionNotes()">Cancel</button>
                          <button class="delete" v-show="isEditingSession" @click="soloDelete(session.id)">Delete</button>
                          <button v-if="session.feedback !== '' && session.feedback !== null && session.id !== showFeedback" @click="showFeedback = session.id">Feedback</button>
                          <button v-if="session.feedback !== '' && session.feedback !== null && session.id === showFeedback" @click="showFeedback = null">Close Feedback</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div><!-- sessions -->
            </div>
            <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
              <div class="graph" v-if="isStatsOpen">
                <div class="section--top">
                  <h3 class="section-title">Statistics</h3>
                  <inline-svg v-show="isStatsOpen" @click="isStatsOpen = false, $parent.$parent.willBodyScroll(true)" class="icon--options" :src="require('../../assets/svg/close.svg')" aria-label="Close"/>
                </div>
                <div>
                  <p v-if="protocolError.length !== 0" class="text--error">There are some problems with your tracked exercises. Please check that the following measurements/exercises are using the correct format.</p><br>
                  <p v-show="protocolError.length !== 0" class="text--error" v-for="(error, index) in protocolError" :key="index"><b>{{error.prot}} for {{error.exercise}} from {{error.sessionName}}</b></p>
                </div><br>
                <div class="container--content">
                  <div class="data-options">
                    <div class="data-select">
                      <div class="data-select__options">
                        <label for="measure">
                          <b>Measurement: </b><br>
                          <select v-model="selectedDataName" @change="sortSessions(), scan(), selection()" name="measure">
                            <option v-for="optionName in optionsForDataName" :value="optionName.value" :key="'M' + optionName.id">
                              {{optionName.text}}
                            </option>
                          </select>
                        </label>
                      </div>
                      <div class="data-select__options" v-show="showType">
                        <label for="measure-type">
                          <b>Data type: </b><br>
                          <select v-model="selectedDataType" @change="sortSessions(), scan(), selection()" name="measure-type">
                            <option value="Sets">Sets</option>
                            <option value="Reps">Reps</option>
                            <option v-for="optionData in optionsForDataType" :value="optionData.value" :key="'DT-' + optionData.id">
                              {{optionData.text}}
                            </option>
                          </select>
                        </label>
                      </div>
                    </div>
                    <div v-show="showType" class="data-desc">
                      <div class="container--data-desc">
                        <p class="data-desc__desc"><b>{{ p1.desc }}</b></p>
                        <p class="data-desc__value">{{ p1.value }}</p>
                      </div>
                      <div class="container--data-desc">
                        <p class="data-desc__desc"><b>{{ p2.desc }}</b></p>
                        <p class="data-desc__value">{{ p2.value }}</p>
                      </div>
                      <div class="container--data-desc">
                        <p class="data-desc__desc"><b>{{ p3.desc }}</b></p>
                        <p class="data-desc__value">{{ p3.value }}</p>
                      </div>
                      <div class="container--data-desc">
                        <p class="data-desc__desc"><b>{{ p4.desc }}</b></p>
                        <p class="data-desc__value">{{ p4.value }}</p>
                      </div>
                      <div class="container--data-desc">
                        <p class="data-desc__desc">{{ p5.desc }}</p>
                        <p class="data-desc__value">{{ p5.value }}</p>
                      </div>
                    </div>
                  </div>
                  <line-chart id="chart" :chart-data="dataCollection" :options="options" aria-label="Graph"/>
                </div>
              </div>
            </transition>
          </div> <!-- plan_grid -->
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import LineChart from '../../components/LineChart.js'
  import InlineSvg from 'vue-inline-svg'

  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import '@fullcalendar/core/main.min.css'
  import '@fullcalendar/daygrid/main.css'

  export default {
    components: {
      LineChart,
      InlineSvg,
      FullCalendar
    },
    data () {
      return {
        force: true,

        // BLOCK DATA //
        isStatsOpen: false,
        showFeedback: '',
        weekColor: {
          backgroundColor: ''
        },
        response: '',
        editPlanNotes: false,
        todayDate: '',
        expandedSessions: [],

        // SESSION DATA //
        isEditingSession: false,
        editSession: null,
        movingSession: null,
        moveTarget: 1,
        copyTarget: 2,
        daysDiff: 7,
        new_session: {
          name: 'Untitled',
          date: ''
        },
        selectedSessions: [],
        shiftDays: 1,

        // REGEX DATA //
        str: [],
        yData: [],
        xLabel: [],
        dataPacketStore: [],
        regexExtract: /\[\s*(.*?)\s*:\s*(.*?)\]/gi,
        regexSetsReps: /(\d*)x((\d*\/*)*)/gi,
        regexLoadCapture: /(at|@)(.+)/gi,
        regexNumberBreakdown: /[0-9.]+/gi,
        protocolError: [],

        // CHART METHODS //
        dataCollection: null,
        options: null,

        // CALENDAR DATA //
        calendarToolbarHeader: {
          left: 'title',
          right: ''
        },
        calendarToolbarFooter: {
          right: 'today prev, next'
        },
        calendarPlugins: [ dayGridPlugin ],
        sessionDates: [],

        // STATISTICS DATA //
        p1: '',
        p2: '',
        p3: '',
        p4: '',
        p5: '',
        selectedDataName: 'Session Overview',
        optionsForDataName: [],
        optionsForDataType: [],
        selectedDataType: 'Sets',
        showType: true,

        // MICROCYCLE DATA //
        allowMoreWeeks: false,
        currentWeek: 1,
        maxWeek: '2'
      }
    },
    created () {
      this.$parent.sessions = true
      this.$parent.showDeletePlan = true
    },
    async mounted () {
      await this.$parent.get_client_details()
      this.today()
      this.scan()
    },
    beforeDestroy () {
      this.$parent.showDeletePlan = false
    },
    methods: {

      // MODALS AND CHILD METHODS //-------------------------------------------------------------------------------

      shiftAcross () {
        this.$parent.$parent.client_details.plans.forEach((plan) => {
          // eslint-disable-next-line
          if (plan.id == this.$route.params.id) {
            plan.sessions.forEach((session) => {
              if (this.selectedSessions.includes(session.id)) {
                session.date = this.addDays(session.date, parseInt(this.shiftDays))
                this.update_session(session.id)
              }
            })
          }
        })
        this.$modal.hide('shift')
        this.deselectAll()
      },
      copyAcross () {
        var copysessions = []
        let weekCount = 2
        this.$parent.$parent.client_details.plans.forEach((plan) => {
          // eslint-disable-next-line
          if (plan.id == this.$route.params.id) {
            plan.sessions.forEach((session) => {
              if (this.selectedSessions.includes(session.id)) {
                copysessions.push({ name: session.name, date: session.date, notes: session.notes })
              }
            })
          }
        })
        for (; weekCount <= this.copyTarget; weekCount++) {
          this.currentWeek = weekCount
          copysessions.forEach((session) => {
            this.new_session.name = session.name
            this.new_session.date = this.addDays(session.date, this.daysDiff * (weekCount - 1))
            this.currentCopysessionNotes = session.notes
            this.add_session()
          })
        }
        this.currentCopysessionNotes = ''
        this.copyTarget = 1
        this.new_session.name = 'Untitled'
        this.today()
        this.update_plan()
        this.$parent.$parent.loading = false
        this.$modal.hide('copy')
        this.deselectAll()
      },
      initMove () {
        this.$parent.$parent.client_details.plans.forEach((plan) => {
          // eslint-disable-next-line
          if (plan.id == this.$route.params.id) {
            plan.sessions.forEach((session) => {
              if (this.selectedSessions.includes(session.id)) {
                session.week_id = this.moveTarget
                this.updateSessionNotes(session.id)
              }
            })
          }
        })
        this.deselectAll()
        this.currentWeek = parseInt(this.moveTarget)
      },

      // SESSION METHODS //-------------------------------------------------------------------------------

      soloDelete (id) {
        if (confirm('Are you sure you want to delete this session?')) {
          this.delete_session(id, true)
        }
      },
      bulkDelete () {
        if (this.selectedSessions.length !== 0) {
          var ready = confirm('Are you sure you want to delete all the selected session?')
          this.selectedSessions.forEach((sessionId) => {
            this.delete_session(sessionId, ready)
          })
          this.deselectAll()
        }
      },
      deselectAll () {
        this.$parent.$parent.client_details.plans.forEach((plan) => {
          // eslint-disable-next-line
          if (plan.id == this.$route.params.id) {
            plan.sessions.forEach((session) => {
              var selEl = document.getElementById('sc-' + session.id)
              if (selEl.checked === true) {
                selEl.checked = false
                var idx = this.selectedSessions.indexOf(session.id)
                this.selectedSessions.splice(idx, 1)
              }
            })
          }
        })
      },
      changeSelectCheckbox (id) {
        if (this.selectedSessions.includes(id) === false) {
          this.selectedSessions.push(id)
        } else {
          var idx = this.selectedSessions.indexOf(id)
          this.selectedSessions.splice(idx, 1)
        }
      },
      cancelSessionNotes () {
        this.editSession = null
        this.isEditingSession = false
        window.removeEventListener('keydown', this.quickSaveSessionNotes)
      },
      async createSession () {
        this.$parent.$parent.loading = true
        await this.add_session()
        this.$parent.$parent.loading = false
      },
      editingSessionNotes (id, state) {
        this.isEditingSession = state
        this.editSession = id
        if (state) {
          window.addEventListener('keydown', this.quickSaveSessionNotes)
        } else {
          this.updateSessionNotes(id)
          window.removeEventListener('keydown', this.quickSaveSessionNotes)
        }
      },
      quickSaveSessionNotes (key, state) {
        if (key.keyCode === 13 && key.ctrlKey === true) {
          this.updateSessionNotes(this.editSession)
          window.removeEventListener('keydown', this.quickSaveSessionNotes)
        }
      },
      updateSessionNotes (id) {
        this.update_session(id)
        this.isEditingSession = false
        this.editSession = null
        this.scan()
      },
      toggleComplete (value) {
        var out
        if (value === 0) {
          out = 1
        }
        if (value === 1) {
          out = 0
        }
        return out
      },
      isCompleted (value) {
        var out
        if (value === 0) {
          out = 'Incomplete'
        }
        if (value === 1) {
          out = 'Completed'
        }
        return out
      },

      // BLOCK METHODS //-------------------------------------------------------------------------------

      toggleExpandedSessions (id) {
        if (this.expandedSessions.includes(id)) {
          const index = this.expandedSessions.indexOf(id)
          if (index > -1) {
            this.expandedSessions.splice(index, 1)
          }
        } else {
          this.expandedSessions.push(id)
        }
      },
      cancelPlanNotes () {
        this.editPlanNotes = false
        window.removeEventListener('keydown', this.quickSavePlanNotes)
      },
      updateSessionColor () {
        this.$parent.$parent.client_details.plans.forEach((plan) => {
          // eslint-disable-next-line
          if (plan.id == this.$route.params.id) {
            plan.block_color = JSON.stringify(this.weekColor.backgroundColor).replace(/"/g, '').replace(/[[\]]/g, '').replace(/\//g, '')
          }
        })
        this.update_plan()
        this.scan()
      },
      editingPlanNotes (state) {
        this.editPlanNotes = state
        if (state) {
          window.addEventListener('keydown', this.quickSavePlanNotes)
        } else {
          this.updatePlanNotes()
          window.removeEventListener('keydown', this.quickSavePlanNotes)
        }
      },
      quickSavePlanNotes (key, state) {
        if (key.keyCode === 13 && key.ctrlKey === true) {
          this.updatePlanNotes()
          window.removeEventListener('keydown', this.quickSavePlanNotes)
        }
      },
      updatePlanNotes () {
        this.update_plan()
        this.editPlanNotes = false
      },
      changeWeek (weekID) {
        this.currentWeek = weekID
        this.moveTarget = weekID
      },

      // CHART METHODS //-------------------------------------------------------------------------------

      fillData () {
        this.dataCollection = {
          labels: this.xLabel,
          datasets: [
            {
              label: this.selectedDataType,
              borderColor: '#282828',
              backgroundColor: 'transparent',
              data: this.yData
            }
          ]
        }
        this.options = {
          legend: {
            display: false
          },
          chartOptions: {
            responsive: true,
            maintainAspectRatio: false
          },
          scales: {
            yAxes: [{
              ticks: {
                suggestedMin: 0,
                beginAtZero: false
              }
            }]
          }
        }
      },

      // This is called at the start and after @change. It scans the current values selected and fills the chart.
      selection () {
        this.showType = true
        this.yData.length = 0
        this.xLabel.length = 0
        var dataForName = this.selectedDataName
        var dataForType = this.selectedDataType
        var dataForSum = 0
        var overviewStore = []
        this.protocolError.length = 0
        this.optionsForDataType.length = 0
        if (dataForName === 'Session Overview') {
          this.optionsForDataType.push({ id: 1, text: 'Load', value: 'Load' })
          this.optionsForDataType.push({ id: 2, text: 'Volume', value: 'Volume' })
        }
        this.dataPacketStore.forEach((item) => {
          overviewStore.length = 0
          item.forEach((exerciseDataPacket) => {
            const tidyA = dataForName.replace(/\(/g, '\\(')
            const tidyB = tidyA.replace(/\)/g, '\\)')
            const regex = RegExp(tidyB, 'gi')
            var protocol = exerciseDataPacket[2].replace(/\s/g, '')
            if (regex.test(exerciseDataPacket[1]) === true) {
              this.xLabel.push(exerciseDataPacket[0])
              if (exerciseDataPacket[2].includes('at') && this.optionsForDataType.length !== 2 && this.protocolError.length === 0) {
                this.optionsForDataType.push({ id: 1, text: 'Load', value: 'Load' })
                this.optionsForDataType.push({ id: 2, text: 'Volume', value: 'Volume' })
              }
              if ((dataForType === 'Sets' || dataForType === 'Reps') && exerciseDataPacket[2].includes('x') === true) {
                this.yData.push(this.setsReps(exerciseDataPacket, protocol, dataForType))
              }
              if (dataForType === 'Load' && exerciseDataPacket[2].includes('at') === true) {
                this.yData.push(this.load(exerciseDataPacket, protocol))
              }
              if (dataForType === 'Volume' && exerciseDataPacket[2].includes('at') === true) {
                var agg = this.setsReps(exerciseDataPacket, protocol, 'Reps') * this.load(exerciseDataPacket, protocol)
                this.yData.push(agg)
              }
              if (exerciseDataPacket[2].includes('x') !== true) {
                this.showType = false
                this.yData.push(this.otherMeasures(protocol))
              }
            }
            if (dataForName === 'Session Overview' && exerciseDataPacket[2].includes('at') === true) {
              if (dataForType === 'Sets' || dataForType === 'Reps') {
                dataForSum = this.setsReps(exerciseDataPacket, protocol, dataForType)
              }
              if (dataForType === 'Load') {
                dataForSum = this.load(exerciseDataPacket, protocol)
              }
              if (dataForType === 'Volume') {
                dataForSum = this.setsReps(exerciseDataPacket, protocol, 'Reps') * this.load(exerciseDataPacket, protocol)
              }
              overviewStore.push(dataForSum)
            }
          })
          if (dataForName === 'Session Overview' && overviewStore.length !== 0) {
            this.yData.push(overviewStore.reduce((a, b) => a + b))
          }
        })
        if (dataForName === 'Session Overview') {
          let x = 1
          for (; x <= this.yData.length; x++) {
            this.xLabel.push('session ' + x)
          }
        }
        if (this.yData.length !== 0) {
          this.descStats(dataForType)
          this.fillData()
        }
      },

      // DATE/TIME METHODS //-------------------------------------------------------------------------------

      weekConfirm (dur) {
        if (parseInt(dur) > 12 && this.allowMoreWeeks === false) {
          if (confirm('Are you sure that you want a cycle of over 3 months? Maybe it\'s best to create a new session.')) {
            this.allowMoreWeeks = true
          } else {
            this.allowMoreWeeks = false
          }
        }
      },
      today () {
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()
        this.new_session.date = `${yyyy}-${mm}-${dd}`
        this.todayDate = `${yyyy}-${mm}-${dd}`
      },
      addDays (date, days) {
        var d = new Date(date)
        d.setDate(d.getDate() + days)
        var year = d.getFullYear()
        var month = d.getMonth() + 1
        var dayDate = d.getDate()
        return `${year}-${month}-${dayDate}`
      },
      day (date) {
        var weekday = new Array(7)
        weekday[0] = 'Sun'
        weekday[1] = 'Mon'
        weekday[2] = 'Tue'
        weekday[3] = 'Wed'
        weekday[4] = 'Thu'
        weekday[5] = 'Fri'
        weekday[6] = 'Sat'
        var d = new Date(date)
        return weekday[d.getDay()]
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

      // INIT AND BACKGROUND METHODS //-------------------------------------------------------------------------------

      pasteHtmlAtCaret (html) {
        let caretPosition = document.getSelection()
        if (caretPosition.focusNode.parentNode.offsetParent.attributes[0].nodeValue === 'ui attached segment ql-container ql-snow') {
          if (caretPosition.focusNode.nodeType !== 3) {
            caretPosition.focusNode.insertAdjacentHTML('afterend', html)
          } else {
            caretPosition.focusNode.parentNode.insertAdjacentHTML('afterend', html)
          }
        }
      },
      expandAll (toExpand) {
        this.$parent.$parent.client_details.plans.forEach((plan) => {
          // eslint-disable-next-line
          if (plan.id == this.$route.params.id) {
            plan.sessions.forEach((session) => {
              if (toExpand === 'Expand') {
                this.expandedSessions.push(session.id)
              } else {
                let x = 0
                let y = this.expandedSessions.length
                for (; x < y; x++) {
                  this.expandedSessions.pop()
                }
              }
            })
          }
        })
      },
      expandText (array) {
        if (array.length !== 0) {
          return 'Collapse'
        } else {
          return 'Expand'
        }
      },
      accessibleColors (hex) {
        if (hex !== undefined) {
          hex = hex.replace('#', '')
          var r, g, b
          r = parseInt(hex.substring(0, 2), 16)
          g = parseInt(hex.substring(2, 4), 16)
          b = parseInt(hex.substring(4, 6), 16)
          var result = ((((r * 299) + (g * 587) + (b * 114)) / 1000) - 128) * -1000
          var color = `rgb(${result}, ${result}, ${result})`
          return color
        }
      },
      removeBracketsAndBreaks (dataIn) {
        if (dataIn !== null) {
          return dataIn.replace(/[[\]]/g, '')
        } else {
          return dataIn
        }
      },
      sortSessions () {
        this.$parent.$parent.client_details.plans.forEach((plan) => {
          // eslint-disable-next-line
          if (plan.id == this.$route.params.id && this.$parent.no_sessions === false) {
            plan.sessions.sort((a, b) => {
              return new Date(a.date) - new Date(b.date)
            })
          }
        })
      },
      scan () {
        this.dataPacketStore.length = 0
        this.sessionDates.length = 0
        this.$parent.$parent.client_details.plans.forEach((plan) => {
          // eslint-disable-next-line
          if (plan.id == this.$route.params.id) {
            this.weekColor.backgroundColor = plan.block_color.replace('[', '').replace(']', '').split(',')
            this.str = plan.sessions
            this.maxWeek = plan.duration
            if (this.str !== null && this.$parent.no_sessions === false) {
              this.str.forEach((object) => {
                this.sessionDates.push({ title: object.name, date: object.date, color: this.weekColor.backgroundColor[object.week_id - 1], textColor: this.accessibleColors(this.weekColor.backgroundColor[object.week_id - 1]) })
                if (object.notes !== null) {
                  var pulledProtocols = this.pullProtocols(object.name, object.notes)
                  this.dataPacketStore.push(this.chunkArray(pulledProtocols))
                }
              })
              // Appends the options to the select
              if (this.dataPacketStore !== null) {
                this.dropdownInit()
                this.selection()
              }
            }
          }
        })
      },

      // Extracts the protocols and measures and stores it all into a temporary array
      pullProtocols (sessionName, text) {
        var textNoHTML = text.replace(/<[^>]*>?/gm, '')
        var tempStore = []
        let m
        while ((m = this.regexExtract.exec(textNoHTML)) !== null) {
          if (m.index === this.regexExtract.lastIndex) {
            this.regexExtract.lastIndex++
          }
          m.forEach((match, groupIndex) => {
            if (groupIndex === 0) {
              tempStore.push(sessionName)
            }
            if (groupIndex === 1 || groupIndex === 2) {
              tempStore.push(match)
            }
          })
        }
        if (tempStore !== null) {
          return tempStore
        }
      },

      // Breaks down the temporary array into data packets of length 2
      // Data Packet format: ['NAME', 'PROTOCOL/MEASURE/NUMBERS']
      chunkArray (myArray) {
        var index = 0
        var tempArray = []
        for (index = 0; index < myArray.length; index += 3) {
          var dataPacket = myArray.slice(index, index + 3)
          tempArray.push(dataPacket)
        }
        return tempArray
      },

      // Init the dropdown selection with validation
      dropdownInit () {
        this.optionsForDataName = [{ id: 0, text: 'Session Overview', value: 'Session Overview' }]
        var tempItemStore = []
        var tempItemStoreLate = []
        var continueValue = 0
        this.dataPacketStore.forEach((item) => {
          item.forEach((exerciseDataPacket) => {
            const tidyA = exerciseDataPacket[1].replace(/\(/g, '\\(')
            const tidyB = tidyA.replace(/\)/g, '\\)')
            const regexA = RegExp(tidyB, 'gi')
            var itemCased = this.properCase(exerciseDataPacket[1])
            if (regexA.test(tempItemStore) !== true && exerciseDataPacket[2].includes('at') === true) {
              tempItemStore.push(itemCased)
            }
            if (regexA.test(tempItemStoreLate) !== true && exerciseDataPacket[2].includes('at') !== true) {
              tempItemStoreLate.push(exerciseDataPacket[1])
            }
          })
        })
        tempItemStore.forEach((item, index) => {
          continueValue = index + 1
          this.optionsForDataName.push({ id: continueValue, text: item, value: item })
        })
        tempItemStoreLate.forEach((item, index) => {
          this.optionsForDataName.push({ id: continueValue + index + 1, text: item, value: item })
        })
      },

      // Creates proper casing, works in conjuction with dropdownAppend to validate if exercise is already in the list.
      properCase (string) {
        var sentence = string.toLowerCase().split(' ')
        for (var i = 0; i < sentence.length; i++) {
          sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
        }
        return sentence.join(' ')
      },

      // REGEX METHODS //-------------------------------------------------------------------------------

      // Extracts anything for Sets and Reps
      setsReps (exerciseDataPacket, protocol, dataForType) {
        var setStore = null
        var extractedSetsReps = null
        var tempSetsRepsStore = []
        let m
        while ((m = this.regexSetsReps.exec(protocol)) !== null) {
          if (m.index === this.regexSetsReps.lastIndex) {
            this.regexSetsReps.lastIndex++
          }
          m.forEach((match, groupIndex) => {
            if (groupIndex === 1) {
              setStore = parseInt(match)
            }
            if (dataForType === 'Sets' && groupIndex === 1) {
              if (match === '') {
                this.protocolError.push({ sessionName: exerciseDataPacket[0], exercise: exerciseDataPacket[1], prot: exerciseDataPacket[2] })
              }
              extractedSetsReps = parseInt(match)
            }
            if (dataForType === 'Reps' && groupIndex === 2) {
              if (match === '') {
                this.protocolError.push({ sessionName: exerciseDataPacket[0], exercise: exerciseDataPacket[1], prot: exerciseDataPacket[2] })
              }
              if (match.includes('/') === true) {
                let n
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

      // Extracts anything for Loads
      load (exerciseDataPacket, protocol) {
        var tempLoadStore = []
        let sum = 0
        let isMultiple = false
        const sets = this.setsReps(exerciseDataPacket, protocol, 'Sets')
        let m
        while ((m = this.regexLoadCapture.exec(protocol)) !== null) {
          if (m.index === this.regexLoadCapture.lastIndex) {
            this.regexLoadCapture.lastIndex++
          }
          m.forEach((loadMatch, groupIndex) => {
            if (groupIndex === 2 && /\d/g.test(loadMatch) === false) {
              this.protocolError.push({ sessionName: exerciseDataPacket[0], exercise: exerciseDataPacket[1], prot: exerciseDataPacket[2] })
            }
            if (groupIndex === 2) {
              let n
              while ((n = this.regexNumberBreakdown.exec(loadMatch)) !== null) {
                if (n.index === this.regexNumberBreakdown.lastIndex) {
                  this.regexNumberBreakdown.lastIndex++
                }
                n.forEach((loadMatchExact) => {
                  if (loadMatch.includes('/') === true) {
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

      // Extracts any other measures
      otherMeasures (protocol) {
        var data = 0
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
      descStats (dataForType) {
        var storeMax = 0
        var store = 0
        var sum = this.yData.reduce((a, b) => a + b)

        // Sets descriptive data with its corresponding info.
        this.p1 = {desc: 'Total ' + dataForType + ': ', value: sum}
        this.p2 = {desc: 'Average ' + dataForType + ': ', value: (sum / this.yData.length).toFixed(1)}

        this.yData.forEach((value) => {
          storeMax = Math.max(storeMax, value)
        })
        this.p3 = { desc: 'Maximum ' + dataForType + ': ', value: storeMax }
        store = storeMax
        this.yData.forEach((value) => {
          store = Math.min(store, value)
        })
        this.p4 = { desc: 'Minimum ' + dataForType + ': ', value: store }
        this.p5 = { desc: 'Percentage Change: ', value: (((storeMax / store) - 1) * 100).toFixed(1) + '%' }
      },

      // DATABASE METHODS //-------------------------------------------------------------------------------

      async update_plan () {
        this.$parent.$parent.dontLeave = true
        var plan
        // Set the plan variable to the current plan
        for (var x in this.$parent.$parent.client_details.plans) {
          // eslint-disable-next-line
          if (this.$parent.$parent.client_details.plans[x].id == this.$route.params.id) {
            plan = this.$parent.$parent.client_details.plans[x]
          }
        }
        try {
          this.sortSessions()
          const response = await axios.post(`https://api.traininblocks.com/programmes`,
            {
              'id': plan.id,
              'name': plan.name,
              'duration': plan.duration,
              'start': plan.start,
              'notes': plan.notes,
              'block_color': plan.block_color,
              'type': plan.type
            },
            {
              headers: {
                'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
              }
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
          this.$ga.event('Session', 'update')
          this.scan()
          this.$parent.$parent.dontLeave = false
        } catch (e) {
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
          this.$parent.$parent.errorMsg = e
          this.$parent.$parent.$modal.show('error')
          console.error(e)
        }
      },
      async update_session (id) {
        this.$parent.$parent.loading = true
        this.$parent.$parent.dontLeave = true
        // Set the plan variable to the current plan
        for (var x in this.$parent.$parent.client_details.plans) {
          //eslint-disable-next-line
          if (this.$parent.$parent.client_details.plans[x].id == this.$route.params.id) {
            var plan = this.$parent.$parent.client_details.plans[x]
            var y
            for (y in plan.sessions) {
              if (plan.sessions[y].id === id) {
                var sessionsId = plan.sessions[y].id
                var sessionsName = plan.sessions[y].name
                var sessionsDate = plan.sessions[y].date
                var sessionsNotes = plan.sessions[y].notes
                var sessionsWeek = plan.sessions[y].week_id
                var sessionsChecked = plan.sessions[y].checked
              }
            }
          }
        }
        try {
          await axios.post(`https://api.traininblocks.com/workouts`,
            {
              'id': sessionsId,
              'name': sessionsName,
              'date': sessionsDate,
              'notes': sessionsNotes,
              'week_id': sessionsWeek,
              'checked': sessionsChecked
            },
            {
              headers: {
                'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
              }
            }
          )
          await this.$parent.get_sessions(this.force)
          await this.update_plan()
          this.$ga.event('Session', 'update')
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
        } catch (e) {
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
          this.$parent.$parent.errorMsg = e
          this.$parent.$parent.$modal.show('error')
          console.error(e)
        }
      },
      async add_session () {
        try {
          this.$parent.$parent.loading = true
          this.$parent.$parent.dontLeave = true
          const response = await axios.put('https://api.traininblocks.com/workouts',
            {
              'name': this.new_session.name,
              'programme_id': this.$route.params.id,
              'date': this.new_session.date,
              'notes': this.currentCopysessionNotes,
              'week_id': this.currentWeek
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
              }
            }
          )
          this.response = response.data
          // Get the sessions from the API because we've just created a new one
          await this.$parent.get_sessions(this.force)
          this.new_session = {
            name: 'Untitled',
            date: this.todayDate,
            notes: '',
            week_id: '',
            block_color: ''
          }
          this.sortSessions()
          this.scan()
          this.$ga.event('Session', 'new')
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
        } catch (e) {
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
          this.$parent.$parent.errorMsg = e
          this.$parent.$parent.$modal.show('error')
          console.error(e)
        }
      },
      async delete_session (id, ready) {
        if (ready) {
          try {
            this.$parent.$parent.loading = true
            this.$parent.$parent.dontLeave = true
            await axios.delete(`https://api.traininblocks.com/workouts/${id}`,
              {
                headers: {
                  'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
                }
              }
            )
            await this.$parent.get_sessions(this.force)
            await this.update_plan()

            this.$ga.event('Session', 'delete')
            this.$parent.$parent.loading = false
            this.$parent.$parent.dontLeave = false
          } catch (e) {
            this.$parent.$parent.loading = false
            this.$parent.$parent.dontLeave = false
            this.$parent.$parent.errorMsg = e
            this.$parent.$parent.$modal.show('error')
            console.error(e)
          }
        }
      }
    }
  }
</script>