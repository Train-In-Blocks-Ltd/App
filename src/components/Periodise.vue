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
        v-for="(plan, planIndex) in clientDetails.plans"
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
            <div v-if="isTrainer" class="plan_order">
              <inline-svg
                v-if="plan.ordered !== 0"
                :src="require('../assets/svg/arrow-left.svg')"
                class="left no_fill"
                @click="change_order(plan.ordered, 'back')"
              />
              <inline-svg
                v-if="plan.ordered !== clientDetails.plans.length - 1"
                :src="require('../assets/svg/arrow-right.svg')"
                class="right no_fill"
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
    clientDetails () {
      return this.$store.state[this.isTrainer ? 'clientDetails' : 'clientUser']
    },
    isTrainer () {
      return this.$store.state.isTrainer
    }
  },
  methods: {
    sortPlans () {
      if (this.plans !== false) {
        this.clientDetails.plans.forEach((plan, index) => {
          if (plan.ordered === null || plan.ordered !== index) {
            this.$store.dispatch('updatePlan', {
              clientId: this.$route.params.client_id,
              planId: plan.id,
              planName: plan.name,
              planDuration: plan.duration,
              planNotes: plan.notes,
              planBlockColor: plan.block_color,
              planOrdered: index
            })
          }
        })
        this.clientDetails.plans.sort((a, b) => {
          return new Date(a.ordered) - new Date(b.ordered)
        })
      }
    },
    change_order (planOrder, direction) {
      switch (direction) {
        case 'next':
          this.$store.commit('updatePlanAttr', {
            clientId: this.$route.params.client_id,
            planId: this.clientDetails.plans[planOrder + 1].id,
            attr: 'ordered',
            data: planOrder
          })
          this.$store.commit('updatePlanAttr', {
            clientId: this.$route.params.client_id,
            planId: this.clientDetails.plans[planOrder].id,
            attr: 'ordered',
            data: planOrder + 1
          })
          this.sortPlans()
          this.$store.dispatch('updatePlan', {
            clientId: this.$route.params.client_id,
            planId: this.clientDetails.plans[planOrder + 1].id,
            planName: this.clientDetails.plans[planOrder + 1].name,
            planDuration: this.clientDetails.plans[planOrder + 1].duration,
            planNotes: this.clientDetails.plans[planOrder + 1].notes,
            planBlockColor: this.clientDetails.plans[planOrder + 1].block_color,
            planOrdered: this.clientDetails.plans[planOrder + 1].ordered
          })
          this.$store.dispatch('updatePlan', {
            clientId: this.$route.params.client_id,
            planId: this.clientDetails.plans[planOrder].id,
            planName: this.clientDetails.plans[planOrder].name,
            planDuration: this.clientDetails.plans[planOrder].duration,
            planNotes: this.clientDetails.plans[planOrder].notes,
            planBlockColor: this.clientDetails.plans[planOrder].block_color,
            planOrdered: this.clientDetails.plans[planOrder].ordered
          })
          break
        case 'back':
          this.$store.commit('updatePlanAttr', {
            clientId: this.$route.params.client_id,
            planId: this.clientDetails.plans[planOrder - 1].id,
            attr: 'ordered',
            data: planOrder
          })
          this.$store.commit('updatePlanAttr', {
            clientId: this.$route.params.client_id,
            planId: this.clientDetails.plans[planOrder].id,
            attr: 'ordered',
            data: planOrder - 1
          })
          this.sortPlans()
          this.$store.dispatch('updatePlan', {
            clientId: this.$route.params.client_id,
            planId: this.clientDetails.plans[planOrder - 1].id,
            planName: this.clientDetails.plans[planOrder - 1].name,
            planDuration: this.clientDetails.plans[planOrder - 1].duration,
            planNotes: this.clientDetails.plans[planOrder - 1].notes,
            planBlockColor: this.clientDetails.plans[planOrder - 1].block_color,
            planOrdered: this.clientDetails.plans[planOrder - 1].ordered
          })
          this.$store.dispatch('updatePlan', {
            clientId: this.$route.params.client_id,
            planId: this.clientDetails.plans[planOrder].id,
            planName: this.clientDetails.plans[planOrder].name,
            planDuration: this.clientDetails.plans[planOrder].duration,
            planNotes: this.clientDetails.plans[planOrder].notes,
            planBlockColor: this.clientDetails.plans[planOrder].block_color,
            planOrdered: this.clientDetails.plans[planOrder].ordered
          })
          break
      }
      const CLIENT = this.$store.state.clients.find(client => client.client_id === parseInt(this.$route.params.client_id))
      this.$store.commit('setData', {
        attr: 'clientDetails',
        data: CLIENT
      })
      this.$store.dispatch('endLoading')
    }
  }
}
</script>
