<style lang="scss" scoped>
.plan-header {
  margin-top: 2rem;
  display: grid;
  grid-gap: 1rem;
  .progress-bar {
    position: relative;
    border: 2px solid var(--base_faint);
    border-radius: 8px;
    padding: 0.3rem 1rem;
    transition: 1s all cubic-bezier(0.165, 0.84, 0.44, 1);
    .backdrop {
      top: 0;
      left: 0;
      border-radius: 8px;
      background-color: #00800020;
      position: absolute;
      height: 100%;
      &.full {
        background-color: var(--base_green);
      }
    }
  }
  .options {
    display: flex;
    align-items: center;
    & > a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--base);
      transition: var(--transition_standard);
      &:hover {
        opacity: var(--light_opacity);
      }
      &:not(:last-child) {
        margin-right: 1rem;
      }
      svg {
        height: 20px;
        width: 20px;
        margin-right: 0.2rem;
      }
    }
  }
}
</style>

<template>
  <div class="plan-header">
    <txt-input
      type="text"
      autocomplete="name"
      placeholder="Plan name"
      aria-label="Plan Name"
      :value="plan.name"
      :is-disabled="silentLoading"
      :on-blur="
        () => {
          $store.dispatch('updatePlanApi');
        }
      "
      @output="
        (data) => {
          $store.dispatch('updatePlanLocal', {
            client_id: $route.params.client_id,
            id: $route.params.id,
            name: data.name,
          });
        }
      "
      required
    />
    <div class="progress-bar">
      <txt v-if="plan.sessions.length !== 0" grey>
        Completed {{ getCompletedSessions() }} of
        {{ plan.sessions.length }} sessions
      </txt>
      <txt v-else grey>No sessions created yet</txt>
      <div
        class="backdrop"
        :style="{
          width: `${(getCompletedSessions() / plan.sessions.length) * 100}%`,
        }"
      />
    </div>
    <div class="options">
      <router-link
        :to="`/client/${$route.params.client_id}/`"
        href="javascript:void(0)"
      >
        <inline-svg id="back" :src="require('@/assets/svg/arrow-left.svg')" />
        <txt>Back to profile</txt>
      </router-link>
      <a href="javascript:void(0)" @click="duplicatePlan">
        <inline-svg :src="require('@/assets/svg/copy.svg')" />
        <txt>Duplicate plan</txt>
      </a>
      <a href="javascript:void(0)" @click="deletePlan()">
        <inline-svg :src="require('@/assets/svg/bin.svg')" />
        <txt>Delete plan</txt>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: mapState(["clientDetails", "plan", "silentLoading"]),
  methods: {
    getCompletedSessions() {
      return this.plan.sessions.filter((session) => session.checked === 1)
        .length;
    },
    duplicatePlan() {
      this.$store.dispatch("openModal", {
        name: "duplicate-plan",
      });
      willBodyScroll(false);
    },
    async deletePlan() {
      if (
        await this.$parent.$parent.$parent.$refs.confirm_pop_up.show(
          "Are you sure you want to delete this plan?",
          "We will remove this plan from our database and it won't be recoverable."
        )
      ) {
        try {
          this.$store.commit("setData", {
            attr: "dontLeave",
            data: true,
          });
          await this.$store.dispatch("deletePlan", {
            clientId: this.$route.params.client_id,
            planId: this.$route.params.id,
          });
          this.$ga.event("Session", "delete");
          this.$store.dispatch("openResponsePopUp", {
            title: "Plan deleted",
            description: "Your changes have been saved",
          });
          this.$store.dispatch("endLoading");
          this.$router.push({
            path: `/client/${this.clientDetails.client_id}/`,
          });
        } catch (e) {
          this.$parent.$parent.$parent.resolveError(e);
        }
      }
    },
  },
};
</script>
