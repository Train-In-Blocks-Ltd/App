<style lang="scss">
.show_html {
  > div,
  > p {
    margin: 0.6rem 0;
  }
  img {
    border-radius: 10px;
    max-width: 80%;
    margin: 1rem 0;
  }
  a {
    color: var(--link);
  }
}
</style>

<style lang="scss" scoped>
.plan_name {
  margin-bottom: 4rem;
}

/* Editor object */
.plan_notes {
  h3 {
    position: relative;
    left: 2rem;
    padding: 0.6rem;
    letter-spacing: 2px;
    width: fit-content;
    width: -moz-fit-content;
    background: var(--base);
    color: var(--fore);
    border-radius: 0 0 10px 10px;
  }
  .show_html {
    margin: 2rem;
  }
}
.container--sessions {
  margin: 4rem 0 2rem 0;
  &::-webkit-scrollbar {
    height: 4px;
  }
  .wrapper--session {
    padding: 2rem;
    .complete_button {
      margin-top: 2rem;
    }
  }
}

/* Navigate */
.show_sessions_nav {
  display: flex;
  margin: 2rem 0;
  .show_sessions_counter {
    margin: auto;
  }
  .show_sessions_left,
  .show_sessions_right {
    height: 36px;
    width: 36px;
    &:not(.disabled):active {
      transform: scale(0.8);
    }
    &.disabled,
    &.disabled:hover {
      opacity: var(--light_opacity);
      cursor: default;
    }
  }
}
hr {
  margin: 2rem 0;
}
.switch_cal {
  margin-bottom: 0.4rem;
  svg {
    margin-right: 0.4rem;
  }
}

@media (max-width: 992px) {
  .switch_cal {
    display: none;
  }
}
@media (max-width: 576px) {
  .plan_notes {
    h3 {
      left: 1rem;
    }
    #wrapper--rich_editor {
      margin: 1rem;
    }
  }
  .container--sessions .wrapper--session {
    padding: 0.8rem;
    .complete_button {
      width: 100%;
    }
  }
}
</style>

<template>
  <div id="client_side_plan" class="view_container">
    <div v-for="(plan, index) in clientUser.plans" :key="index">
      <div v-if="plan.id == $route.params.id" class="client_plan">
        <txt type="title" class="plan_name">
          {{ plan.name }}
        </txt>
        <card-wrapper class="plan_notes" noHover>
          <txt type="subtitle" class="bottom_margin">Plan Notes</txt>
          <div
            v-if="plan.notes && plan.notes !== '<p></p>'"
            class="show_html fadeIn"
            v-html="updateHTML(plan.notes, true)"
          />
          <txt
            v-else-if="
              plan.notes === null ||
              plan.notes === '<p><br></p>' ||
              plan.notes === ''
            "
            class="show_html grey"
          >
            No plan notes added...
          </txt>
        </card-wrapper>
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
        <skeleton
          v-if="loading"
          :type="'session'"
          class="container--sessions"
        />
        <div v-else-if="plan.sessions" class="container--sessions">
          <div class="show_sessions_nav">
            <inline-svg
              v-show="showing_current_session !== 0"
              :src="require('../../assets/svg/arrow-left.svg')"
              class="show_sessions_left cursor no_fill"
              @click="showing_current_session--"
            />
            <inline-svg
              v-show="showing_current_session === 0"
              :src="require('../../assets/svg/arrow-left.svg')"
              class="show_sessions_left disabled no_fill"
            />
            <txt type="subtitle" class="show_sessions_counter">
              {{ showing_current_session + 1 }}/{{ plan.sessions.length }}
            </txt>
            <inline-svg
              v-show="
                showing_current_session !== parseInt(plan.sessions.length) - 1
              "
              :src="require('../../assets/svg/arrow-right.svg')"
              class="show_sessions_right cursor no_fill"
              @click="showing_current_session++"
            />
            <inline-svg
              v-show="
                showing_current_session === parseInt(plan.sessions.length) - 1
              "
              :src="require('../../assets/svg/arrow-right.svg')"
              class="show_sessions_right disabled no_fill"
            />
          </div>
          <card-wrapper
            v-for="(session, indexed) in plan.sessions"
            v-show="showing_current_session === indexed"
            :id="`session-${session.id}`"
            :key="indexed"
            class="wrapper--session"
            noHover
          >
            <div :id="session.name" class="session_header client-side">
              <div>
                <span class="text--name"
                  ><b>{{ session.name }}</b></span
                ><br />
                <span class="text--tiny">{{ day(session.date) }}</span>
                <span class="text--tiny">{{ session.date }}</span>
              </div>
            </div>
            <div
              class="show_html fadeIn"
              v-html="updateHTML(session.notes, true)"
            />
            <div :key="check">
              <button
                v-if="session.checked === 1 && !feedbackId"
                class="complete_button green_button"
                @click="complete(plan.id, session.id, session.checked)"
              >
                Completed
              </button>
              <button
                v-if="session.checked === 0 && !feedbackId"
                class="complete_button red_button"
                @click="complete(plan.id, session.id, session.checked)"
              >
                Click to complete
              </button>
            </div>
            <div v-if="session.checked === 1">
              <hr />
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
        <div v-else>
          <txt type="subtitle">No sessions yet</txt>
          <txt type="large-body" grey>
            Please contact your trainer or coach for more details
          </txt>
          <div class="spacer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Txt from "../../components/elements/Txt.vue";

const WeekCalendar = () =>
  import(
    /* webpackChunkName: "components.calendar", webpackPreload: true  */ "../../components/WeekCalendar"
  );
const MonthCalendar = () =>
  import(
    /* webpackChunkName: "components.calendar", webpackPreload: true */ "../../components/MonthCalendar"
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
    Txt,
  },
  async beforeRouteLeave(to, from, next) {
    if (
      this.dontLeave
        ? await this.$parent.$refs.confirm_pop_up.show(
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
      // SYSTEM

      check: null,
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
  computed: mapState([
    "clientUserLoaded",
    "loading",
    "dontLeave",
    "clientUser",
  ]),
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
    // -----------------------------
    // General
    // -----------------------------

    /**
     * Resolves the state of the feedback editor.
     * @param {string} state - The returned state of the editor.
     * @param {integer} id - The id of the session.
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
     * @param {integer} id - The id of the session.
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
     * @param {integer} planId - The id of the plan.
     * @param {integer} sessionId - The id of the session.
     * @param {integer} currentChecked - The new state of the session.
     */
    complete(planId, sessionId, currentChecked) {
      this.$store.commit("updateClientUserPlanSingleSession", {
        planId,
        sessionId,
        attr: "checked",
        data: !currentChecked ? 1 : 0,
      });
      this.check = !currentChecked ? 1 : 0;
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
            textColor: this.accessible_colors(WEEK_COLOR[session.week_id - 1]),
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
