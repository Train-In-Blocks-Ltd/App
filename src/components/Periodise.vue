<style>
/* Preview HTML */
.preview_html {
  font-size: .8rem;
  margin-top: .4rem
}
.preview_html * {
  color: var(--base);
  transition: var(--transition_standard)
}
.preview_html p {
  margin: .4rem 0
}
.preview_html h1,
.preview_html h2 {
  font-size: 1rem
}
.preview_html img,
.preview_html iframe,
.preview_html a {
  display: none
}
</style>

<style scoped>
/* Plan and periodise */
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

/* Plan ordered and links */
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

/* Other */
button.red_button {
  margin-top: 2rem;
  width: 100%
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
          <button class="red_button" @click="preview = null, $modal.hide('preview'), will_body_scroll(true)">
            Close
          </button>
          <div class="spacer" />
        </div>
      </div>
    </modal>
    <div
      v-for="(plan, planIndex) in client_plans"
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
              v-if="plan.ordered !== 0"
              :src="require('../assets/svg/arrow.svg')"
              class="left"
              @click="change_order(plan.ordered, 'back')"
            />
            <inline-svg
              v-if="plan.ordered !== client_plans.length - 1"
              :src="require('../assets/svg/arrow.svg')"
              class="right"
              @click="change_order(plan.ordered, 'next')"
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
    plans: [Array, Boolean]
  },
  data () {
    return {
      client_plans: this.plans,
      preview: null
    }
  },
  watch: {
    plans () {
      this.client_plans = this.plans
    }
  },
  created () {
    this.sort_plans()
  },
  methods: {
    sort_plans () {
      if (this.plans !== false) {
        this.client_plans.forEach((plan, index) => {
          if (plan.ordered === null) {
            plan.ordered = index
            this.$emit('update:plans', this.client_plans)
          }
        })
        this.client_plans.sort((a, b) => {
          return new Date(a.ordered) - new Date(b.ordered)
        })
        this.$emit('update:plans', this.client_plans)
      }
    },
    change_order (planOrder, direction) {
      switch (direction) {
        case 'next':
          this.client_plans[planOrder + 1].ordered = planOrder
          this.update_plan(this.client_plans[planOrder + 1].id)
          this.client_plans[planOrder].ordered = planOrder + 1
          this.update_plan(this.client_plans[planOrder].id)
          this.sort_plans()
          break
        case 'back':
          this.client_plans[planOrder - 1].ordered = planOrder
          this.update_plan(this.client_plans[planOrder - 1].id)
          this.client_plans[planOrder].ordered = planOrder - 1
          this.update_plan(this.client_plans[planOrder].id)
          this.sort_plans()
          break
      }
    },
    async update_plan (id) {
      this.$parent.$parent.$parent.silent_loading = true
      this.$parent.$parent.$parent.dontLeave = true
      const plan = this.client_plans.find(plan => plan.id === id)
      try {
        this.sort_sessions(plan)
        await this.$axios.post('https://api.traininblocks.com/programmes',
          {
            id: plan.id,
            name: plan.name,
            duration: plan.duration,
            notes: plan.notes,
            block_color: plan.block_color,
            ordered: plan.ordered
          }
        )
        localStorage.setItem('clients', JSON.stringify(this.$parent.$parent.$parent.clients))
        this.$ga.event('Plan', 'update')
        this.$parent.$parent.$parent.responseHeader = 'Plan updated'
        this.$parent.$parent.$parent.responseDesc = 'Your changes have been saved'
        this.$parent.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.$parent.resolve_error(e)
      }
    }
  }
}
</script>
