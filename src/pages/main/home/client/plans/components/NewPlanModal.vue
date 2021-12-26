<style lang="scss" scoped>
form {
  display: grid;
  grid-gap: 1rem;
}
</style>

<template>
  <form name="add_plan" @submit.prevent="handleSubmit">
    <txt-input
      type="text"
      autocomplete="name"
      placeholder="Name*"
      aria-label="Name"
      :value="newPlan.name"
      :on-input="checkForm()"
      @output="(data) => (newPlan.name = data)"
      focusFirst
      required
    />
    <txt-input
      type="number"
      min="1"
      placeholder="Duration*"
      aria-label="Duration"
      :value="newPlan.duration"
      :on-input="checkForm()"
      @output="(data) => (newPlan.duration = data)"
      required
    />
    <default-button :is-disabled="disableCreatePlanButton" type="submit"
      >Save</default-button
    >
  </form>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      newPlan: {
        name: "",
        duration: "",
      },
      disableCreatePlanButton: true,
    };
  },
  computed: mapState(["dontLeave", "clientDetails", "clients"]),
  mounted() {
    this.$refs.name.focus();
  },
  methods: {
    handleSubmit() {
      this.createPlan();
      this.$store.dispatch("closeModal");
      this.willBodyScroll(true);
    },
    checkForm() {
      this.disableCreatePlanButton = !(
        this.newPlan.name && this.newPlan.duration
      );
    },

    /**
     * Creates a new plan.
     */
    async createPlan() {
      try {
        this.$store.commit("setData", {
          attr: "loading",
          data: true,
        });
        this.$store.commit("setData", {
          attr: "dontLeave",
          data: true,
        });
        await this.$store.dispatch("createPlan", {
          clientId: this.clientDetails.client_id,
          name: this.newPlan.name,
          duration: this.newPlan.duration,
        });
        this.$ga.event("Plan", "new");
        this.$store.dispatch("openResponsePopUp", {
          title: `${this.newPlan.name} created`,
          description: "You're all set, get programming",
        });
        this.newPlan = {
          name: "",
          duration: "",
        };
        this.$store.dispatch("endLoading");
      } catch (e) {
        this.$parent.$parent.$parent.resolveError(e);
      }
    },
  },
};
</script>
