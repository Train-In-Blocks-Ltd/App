<style lang="scss" scoped>
.plan-control-bar {
  display: flex;
  justify-content: space-between;
  .left {
    display: grid;
    grid-gap: 1rem;
    min-height: 80px;
    .top {
      display: flex;
      .change_week_color {
        height: 2rem;
        width: 4rem;
        border: 2px solid var(--base);
        border-radius: 5px;
        cursor: pointer;
        transition: var(--transition_standard);
        &:hover {
          opacity: var(--light_opacity);
        }
        &.noColor {
          /* stylelint-disable-next-line */
          background-color: var(--fore) !important;
        }
      }
      .info {
        fill: var(--base);
        margin-left: 1rem;
        cursor: pointer;
        transition: opacity 1s,
          transform 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
        &:hover {
          opacity: var(--light_opacity);
        }
        &:active {
          transform: var(--active_state);
        }
      }
    }
  }
}
</style>

<template>
  <div class="plan-control-bar">
    <div class="left">
      <div class="top">
        <div
          :style="{
            backgroundColor: weekColor[currentWeek - 1],
          }"
          :class="{
            noColor: weekColor[currentWeek - 1] === 'null',
          }"
          class="change_week_color"
          @click="editingWeekColor = !editingWeekColor"
        />
        <inline-svg
          class="info"
          :src="require('@/assets/svg/info.svg')"
          title="Info"
          @click="
            (previewDesc =
              'How to track exercises to visualise in the Statistics tab'),
              (previewHTML =
                '<p><b>[ </b><i>Exercise Name</i><b>:</b> <i>Sets</i> <b>x</b> <i>Reps</i> <b>at</b> <i>Load</i> <b>]</b></p><br> <p><b>Examples</b></p><p><i>[Back Squat: 3x6 at 50kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50kg]</i></p> <p><i>[Back Squat: 3x6 at 50/55/60kg]</i></p> <p><i>[Back Squat: 3x6/4/3 at 50/55/60kg]</i></p><br><hr><br><p><b>[ </b><i>Measurement</i><b>:</b> <i>Value</i> <b>]</b></p><br><p><b>Examples</b></p><p><i>[Weight: 50kg]</i></p> <p><i>[Vertical Jump: 43.3cm]</i></p> <p><i>[Body Fat (%): 12]</i></p> <p><i>[sRPE (CR10): 8]</i></p> <p><i>[sRPE (Borg): 16]</i></p><br> <p>See <i>Help</i> for more information</p><br>'),
              willBodyScroll(false)
          "
        />
      </div>
      <color-picker v-if="editingWeekColor" />
    </div>
    <default-button :on-click="() => createNewSession()">
      New session
    </default-button>
  </div>
</template>

<script>
import { mapState } from "vuex";

const ColorPicker = () =>
  import(
    /* webpackChunkName: "components.colorPicker", webpackPrefetch: true */ "@/components/ColorPicker"
  );

export default {
  components: {
    ColorPicker,
  },
  data() {
    return {
      editingWeekColor: false,
    };
  },
  computed: mapState(["currentWeek", "plan", "weekColor"]),
  methods: {
    /**
     * Creates a new session.
     */
    async createNewSession() {
      this.$store.commit("setData", {
        attr: "dontLeave",
        data: true,
      });
      try {
        await this.$store.dispatch("addSession", {
          client_id: parseInt(this.$route.params.client_id),
          data: {
            programme_id: parseInt(this.$route.params.id),
            name: "Untitled",
            date: this.today(),
            notes: "",
            week_id: this.currentWeek,
          },
        });
      } catch (e) {
        this.$parent.$parent.$parent.resolveError(e);
      }
      // this.goToEvent(NEW_SESSION_ID, this.currentWeek);
      this.$ga.event("Session", "new");
      this.$store.dispatch("openResponsePopUp", {
        title: "New session added",
        description: "Get programming!",
      });
      this.$store.dispatch("endLoading");
    },
  },
};
</script>
