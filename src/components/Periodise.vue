<style scoped>
  .preview_html {
    margin: 2rem 0
  }
  .periodise {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 4rem
  }
  .plan {
    display: grid;
    background-color: var(--fore);
    box-shadow: var(--low_shadow);
    border-radius: 10px;
    transition: var(--transition_standard)
  }
  .plan:hover {
    box-shadow: var(--high_shadow)
  }
  .plan_header {
    display: grid;
    grid-gap: 1rem;
    padding: 2rem
  }
  .plan_header h2 {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
  }
  .plan_header__options {
    display: flex;
    justify-content: space-between
  }
  .plan_header__options a {
    margin-right: 1rem
  }

  /* Plan order and links */
  .plan_order, .plan_a_links {
    display: flex
  }
  .plan_order svg {
    height: 24px;
    width: 24px;
    cursor: pointer;
    transition: var(--transition_standard)
  }
  .plan_order svg:hover {
    opacity: .6
  }
  svg.left {
    transform: rotate(90deg)
  }
  svg.right {
    margin-left: 1rem;
    transform: rotate(-90deg)
  }

  /* Micros */
  .microcycles {
    display: flex
  }
  .microcycle {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    opacity: .6;
    width: 100%;
    height: 10px
  }
  .microcycle:first-child {
    border-radius: 0 0 0 10px
  }
  .microcycle:last-child {
    border-radius: 0 0 10px 0
  }
  .noColor {
    border-top: 1px solid var(--base_faint)
  }
  .noColor:not(.noColor:last-child) {
    border-right: 1px solid var(--base_faint)
  }

  /* Responsive */
  @media (max-width: 992px) {
    .periodise {
      grid-template-columns: 1fr
    }
  }
</style>

<template>
  <div class="periodise">
    <modal :name="'preview'" height="100%" width="100%" :adaptive="true" :click-to-close="false">
      <div>
        <div class="center_wrapped">
          <h2>
            Plan notes
          </h2>
          <div class="preview_html" v-html="preview" />
          <button class="close" @click="preview = null, $modal.hide('preview'), will_body_scroll(true)">
            Close
          </button>
          <div class="spacer" />
        </div>
      </div>
    </modal>
    <div
      v-for="(plan, planIndex) in plans"
      :key="`plan_${planIndex}`"
      class="plan"
    >
      <div class="plan_header">
        <h2>
          {{ plan.name }}
        </h2>
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
              v-if="plan.notes !== null && plan.notes !== '<p><br></p>' && plan.notes !== ''"
              href="javascript:void(0)"
              class="a_link"
              @click="preview = plan.notes, $modal.show('preview'), will_body_scroll(false)"
            >
              Notes
            </a>
          </div>
          <div v-if="isTrainer" class="plan_order">
            <inline-svg
              :src="require('../assets/svg/arrow.svg')"
              class="left"
            />
            <inline-svg
              :src="require('../assets/svg/arrow.svg')"
              class="right"
            />
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
</template>

<script>
export default {
  props: {
    isTrainer: Boolean,
    plans: Array
  },
  data () {
    return {
      preview: null
    }
  }
}
</script>
