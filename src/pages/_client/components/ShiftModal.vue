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
        shiftAcross();
        willBodyScroll(true);
      }
    "
  >
    <txt grey
      >This moves the session forward or back by the specified days.</txt
    >
    <txt-input
      type="number"
      name="range"
      aria-label="Shift days"
      :value="shiftDays"
      :on-input="
        () => {
          disableMoveButton = !shiftDays;
        }
      "
      @output="(data) => (shiftDays = data)"
      focusFirst
      required
    />
    <default-button :is-disabled="disableShiftButton" type="submit"
      >Shift</default-button
    >
  </form>
</template>

<script>
export default {
  data() {
    return {
      disableShiftButton: false,
      shiftDays: 1,
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
  methods: {
    /**
     * Shifts the selected sessions by specified days.
     */
    async shiftAcross() {
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
            attr: "date",
            data: this.addDays(session.date, parseInt(this.shiftDays)),
          });
        }
      });

      // Updates all the sessions.
      await this.$store.dispatch("batchUpdateSession", {
        clientId: this.$route.params.client_id,
        planId: this.$route.params.id,
        sessionIds: this.selectedSessions,
      });

      // Generates response
      this.$store.dispatch("openResponsePopUp", {
        title: `Shifted session ${this.selectedSessions.length > 1 ? "s" : ""}`,
        description: "Your changes have been saved",
      });
      this.shiftDays = 1;

      // Deselects all sessions
      this.selectedSessions.forEach((id) => {
        document.getElementById(`sc-${id}`).checked = false;
      });
      this.$store.dispatch("deselectAllSessions");
      this.$store.dispatch("closeModal");

      this.$ga.event("Session", "shift");
      this.$store.dispatch("endLoading");
    },
  },
};
</script>
