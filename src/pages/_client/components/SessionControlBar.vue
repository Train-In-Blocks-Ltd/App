<style lang="scss" scoped>
.session-control-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  margin-bottom: 2rem;
  & > a:not(:last-child) {
    margin-right: 1rem;
  }
}
</style>

<template>
  <div class="session-control-bar">
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
      v-if="plan.sessions !== false && !isEditingSession && !weekIsEmpty"
      href="javascript:void(0)"
      class="a_link"
      @click="expandAll(expandedSessions.length !== 0 ? 'Collapse' : 'Expand')"
    >
      {{ expandedSessions.length !== 0 ? "Collapse" : "Expand" }}
      all
    </a>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      noSessions: false,
    };
  },
  computed: mapState([
    "plan",
    "expandedSessions",
    "selectedSessions",
    "isEditingSession",
    "weekIsEmpty",
  ]),
  created() {
    this.noSessions = this.plan.sessions.length === 0;
  },
  methods: {
    /**
     * Selects all the sessions in the plan or week.
     * @param {string} mode - To select all session or all sessions in the current week ('all' or 'week').
     */
    selectAll(mode) {
      this.$store.dispatch(
        mode === "all" ? "selectAllSessions" : "selectAllSessionsFromWeek"
      );
    },
  },
};
</script>
