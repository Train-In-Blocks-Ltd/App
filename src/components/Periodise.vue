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
  border: 3px solid var(--base);
  border-radius: 10px;
  transition: var(--transition_standard)
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
  opacity: var(--light_opacity)
}
svg.right {
  margin-left: 1rem
}
svg:is(.left, .right):active {
  transform: scale(.8)
}

/* Micros */
.microcycles {
  display: flex
}
.microcycle {
  display: flex;
  margin-top: auto;
  flex-direction: column;
  justify-content: space-around;
  opacity: var(--light_opacity);
  width: 100%;
  height: 10px
}
.microcycle:first-child {
  border-radius: 0 0 0 5px
}
.microcycle:last-child {
  border-radius: 0 0 5px 0
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
            <!--
            <div v-if="isTrainer" class="plan_order">
              <inline-svg
                v-if="plan.ordered !== 0"
                :src="require('../assets/svg/arrow-left.svg')"
                class="left no_fill"
                @click="changeOrder(plan.ordered, 'back')"
              />
              <inline-svg
                v-if="plan.ordered !== plans.length - 1"
                :src="require('../assets/svg/arrow-right.svg')"
                class="right no_fill"
                @click="changeOrder(plan.ordered, 'next')"
              />
            </div>
            -->
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
  data () {
    return {
      planDesc: null,
      planHTML: null
    }
  },
  computed: {
    plans () {
      return this.$store.state[this.isTrainer ? 'clientDetails' : 'clientUser'].plans
    },
    isTrainer () {
      return this.$store.state.isTrainer
    }
  },
  methods: {
    /*
    async sortPlans () {
      if (this.plans !== false) {
        for (const INDEX in this.plans) {
          const PLAN = this.plans[INDEX]
          if (PLAN.ordered === null || PLAN.ordered !== INDEX) {
            await this.$store.dispatch('updatePlan', {
              client_id: this.$route.params.client_id,
              id: PLAN.id,
              name: PLAN.name,
              duration: PLAN.duration,
              notes: PLAN.notes,
              block_olor: PLAN.block_color,
              ordered: INDEX
            })
          }
        }
        this.plans.sort((a, b) => {
          return new Date(a.ordered) - new Date(b.ordered)
        })
      }
    }
    async changeOrder (planOrder, direction) {
      this.$store.commit('setData', {
        attr: 'silentLoading',
        data: true
      })
      this.$store.commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      switch (direction) {
        case 'next':
          this.$store.commit('updatePlanAttr', {
            clientId: this.$route.params.client_id,
            planId: this.plans[planOrder + 1].id,
            attr: 'ordered',
            data: planOrder
          })
          this.$store.commit('updatePlanAttr', {
            clientId: this.$route.params.client_id,
            planId: this.plans[planOrder].id,
            attr: 'ordered',
            data: planOrder + 1
          })
          this.sortPlans()
          await this.$store.dispatch('updatePlan', {
            client_id: this.$route.params.client_id,
            id: this.plans[planOrder + 1].id,
            name: this.plans[planOrder + 1].name,
            duration: this.plans[planOrder + 1].duration,
            notes: this.plans[planOrder + 1].notes,
            block_color: this.plans[planOrder + 1].block_color,
            ordered: this.plans[planOrder + 1].ordered
          })
          await this.$store.dispatch('updatePlan', {
            client_id: this.$route.params.client_id,
            id: this.plans[planOrder].id,
            name: this.plans[planOrder].name,
            duration: this.plans[planOrder].duration,
            notes: this.plans[planOrder].notes,
            block_color: this.plans[planOrder].block_color,
            ordered: this.plans[planOrder].ordered
          })
          break
        case 'back':
          this.$store.commit('updatePlanAttr', {
            clientId: this.$route.params.client_id,
            planId: this.plans[planOrder - 1].id,
            attr: 'ordered',
            data: planOrder
          })
          this.$store.commit('updatePlanAttr', {
            clientId: this.$route.params.client_id,
            planId: this.plans[planOrder].id,
            attr: 'ordered',
            data: planOrder - 1
          })
          this.sortPlans()
          await this.$store.dispatch('updatePlan', {
            client_id: this.$route.params.client_id,
            id: this.plans[planOrder - 1].id,
            name: this.plans[planOrder - 1].name,
            duration: this.plans[planOrder - 1].duration,
            notes: this.plans[planOrder - 1].notes,
            block_color: this.plans[planOrder - 1].block_color,
            ordered: this.plans[planOrder - 1].ordered
          })
          await this.$store.dispatch('updatePlan', {
            client_id: this.$route.params.client_id,
            id: this.plans[planOrder].id,
            name: this.plans[planOrder].name,
            duration: this.plans[planOrder].duration,
            notes: this.plans[planOrder].notes,
            block_color: this.plans[planOrder].block_color,
            ordered: this.plans[planOrder].ordered
          })
          break
      }
      this.$store.dispatch('endLoading')
    }
    */
  }
}
</script>
