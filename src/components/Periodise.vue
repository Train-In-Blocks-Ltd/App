<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
.periodise {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 4rem;
  .plan {
    display: grid;
    border: 3px solid $base;
    border-radius: 10px;
    transition: $transition_standard;
    .plan_header {
      display: grid;
      grid-gap: 1rem;
      padding: 2rem;
      h3 {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden
      }
      .plan_header__options {
        display: flex;
        justify-content: space-between;
        .plan_a_links {
          display: flex;
          a {
            margin-right: 1rem
          }
        }
      }
    }
    .microcycles {
      display: flex;
      .microcycle {
        display: flex;
        margin-top: auto;
        flex-direction: column;
        justify-content: space-around;
        opacity: $light_opacity;
        width: 100%;
        height: 10px;
        &:first-child {
          border-radius: 0 0 0 5px
        }
        &:last-child {
          border-radius: 0 0 5px 0
        }
        &.noColor {
          border-top: 1px solid $base_faint;
          &:not(.noColor:last-child) {
            border-right: 1px solid $base_faint
          }
        }
      }
    }
  }
}

/* Responsive */
@media (max-width: 992px) {
  .periodise {
    grid-template-columns: 1fr
  }
}
</style>

<template>
  <div>
    <preview-modal
      :desc="planDesc"
      :html="planHTML"
      :show-media="true"
      :show-brackets="false"
      @close="planDesc = null, planHTML = null"
    />
    <div class="periodise">
      <div
        v-for="(plan, planIndex) in plans"
        :key="`plan_${planIndex}`"
        class="plan fadeIn"
      >
        <div class="plan_header">
          <h3>
            {{ plan.name }}
          </h3>
          <div class="plan_header__options">
            <div class="plan_a_links">
              <router-link
                :to="isTrainer ? `plan/${plan.id}` : `/clientUser/plan/${plan.id}`"
                href="javascript:void(0)"
                class="a_link"
              >
                {{ isTrainer ? 'Edit' : 'View' }}
              </router-link>
              <a
                v-if="plan.notes && plan.notes !== '<p></p>'"
                href="javascript:void(0)"
                class="a_link"
                @click="planDesc = plan.name, planHTML = plan.notes, willBodyScroll(false)"
              >
                Notes
              </a>
            </div>
          </div>
        </div>
        <div class="microcycles">
          <div
            v-for="(micro, microIndex) in plan.duration"
            :key="`plan_${planIndex}_micro_${microIndex}`"
            :style="{ backgroundColor: plan.block_color.split(',')[microIndex] }"
            :class="{ noColor: plan.block_color === '' }"
            class="microcycle"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const PreviewModal = () => import(/* webpackChunkName: "components.previewModal", webpackPrefetch: true */ './PreviewModal')

export default {
  components: {
    PreviewModal
  },
  props: {
    plans: Array,
    isTrainer: Boolean
  },
  data () {
    return {
      planDesc: null,
      planHTML: null
    }
  }
}
</script>
