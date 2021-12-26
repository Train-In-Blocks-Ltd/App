<style lang="scss" scoped>
form {
  display: grid;
  grid-gap: 1rem;
}
</style>
<template>
  <form
    @submit.prevent="
      () => {
        moveToWeek();
        willBodyScroll(true);
      }
    "
  >
    <txt grey>This will change the colour code assigned to the sessions</txt>
    <txt-input
      type="number"
      name="range"
      aria-label="Move to"
      :value="moveTarget"
      :on-input="
        () => {
          this.disableMoveButton = !this.moveTarget;
        }
      "
      min="1"
      :max="maxWeek"
      @output="(data) => (moveTarget = data)"
      focusFirst
      required
    />
    <default-button :is-disabled="disableMoveButton" type="submit"
      >Move</default-button
    >
  </form>
</template>

<script>
export default {
  data() {
    return {
      moveTarget: 1,
      maxWeek: 1,
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
    selectedSessions() {
      return this.$store.state.selectedSessions;
    },
  },
  created() {
    this.maxWeek = parseInt(this.plan.duration);
  },
  methods: {
    /**
     * Moves the selected sessions to specified week.
     */
    moveToWeek() {
      this.$store.commit("setData", {
        attr: "dontLeave",
        data: true,
      });
      this.plan.sessions.forEach((session) => {
        if (this.selectedSessions.includes(session.id)) {
          this.$store.commit("updateSessionAttr", {
            clientId: this.$route.params.client_id,
            planId: this.$route.params.id,
            sessionId: session.id,
            attr: "week_id",
            data: this.moveTarget,
          });
        }
      });
      this.batchUpdateSession(this.selectedSessions);
      this.currentWeek = parseInt(this.moveTarget);
      this.$store.dispatch("openResponsePopUp", {
        title:
          this.selectedSessions.length > 1 ? "Moved sessions" : "Moved session",
        description: "Your changes have been saved",
      });
      this.moveTarget = 1;
      this.deselectAll();
      this.$ga.event("Session", "move");
      this.$store.dispatch("endLoading");
    },
  },
};
</script>
