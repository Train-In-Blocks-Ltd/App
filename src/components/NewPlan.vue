<template>
  <form
    class="form_grid add_plan"
    name="add_plan"
    @submit.prevent="
      createPlan(), ($parent.isNewPlanOpen = false), willBodyScroll(true)
    "
  >
    <div class="bottom_margin">
      <h3>
        Create a new plan and use it for exercise, nutrition or anything else
      </h3>
      <p class="grey">
        The duration is the microcycle which can be of any length
      </p>
    </div>
    <input
      ref="name"
      :value="newPlan.name"
      class="small_border_radius width_300"
      type="text"
      placeholder="Name*"
      aria-label="Name"
      required
      @input="(newPlan.name = $event.target.value), checkForm()"
    />
    <input
      :value="newPlan.duration"
      class="small_border_radius width_300"
      type="number"
      min="1"
      placeholder="Duration*"
      aria-label="Duration"
      required
      @input="(newPlan.duration = $event.target.value), checkForm()"
    />
    <div class="form_button_bar">
      <button :disabled="disableCreatePlanButton" type="submit">Save</button>
      <button
        class="red_button"
        @click.prevent="($parent.isNewPlanOpen = false), willBodyScroll(true)"
      >
        Close
      </button>
    </div>
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
    // -----------------------------
    // General
    // -----------------------------

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
