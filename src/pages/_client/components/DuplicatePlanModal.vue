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
        duplicatePlan(duplicateClientID);
        willBodyScroll(true);
      }
    "
  >
    <txt grey>Copy this plan to the same/different client</txt>
    <select
      :value="duplicateClientID"
      name="duplicate_client"
      required
      @input="
        () => {
          duplicateClientID = $event.target.value;
          this.disableDuplicatePlanButton = !this.duplicateClientID;
        }
      "
    >
      <option :value="null">Select a client</option>
      <option
        v-for="(client, index) in clients"
        :key="`client_${index}`"
        :value="client.client_id"
      >
        {{ client.name }}
      </option>
    </select>
    <default-button :is-disabled="disableDuplicatePlanButton" type="submit">
      Duplicate
    </default-button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      disableDuplicatePlanButton: true,
      duplicateClientID: null,
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
  },
  methods: {
    /**
     * Duplicates the plan to select client.
     * @param {integer} clientId - The client to copy the plan to.
     */
    async duplicatePlan(clientId) {
      try {
        this.$store.commit("setData", {
          attr: "dontLeave",
          data: true,
        });
        await this.$store.dispatch("duplicatePlan", {
          clientId,
          planId: this.plan.id,
          planName: this.plan.name,
          planDuration: this.plan.duration,
          blockColor: this.plan.block_color,
          planNotes: this.plan.notes,
          planSessions: this.plan.sessions,
        });
        this.$ga.event("Plan", "duplicate");
        this.$store.dispatch("openResponsePopUp", {
          title: "Plan duplicated",
          description: "Access it on your client's profile",
        });
        this.$store.dispatch("endLoading");
        this.$router.push({ path: `/client/${clientId}/` });
      } catch (e) {
        this.$parent.$parent.$parent.resolveError(e);
      }
    },
  },
};
</script>
