<style scoped>
  .periodise {
    display: grid;
    background-color: var(--fore);
    box-shadow: var(--low_shadow);
    border-radius: 10px
  }
  p {
    text-align: center;
    padding: 2rem
  }
  .microcycles {
    display: flex
  }
  .microcycle {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    min-height: 50px
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
</style>

<template>
  <div class="periodise">
    <p>
      {{ plan.name }}
    </p>
    <div class="microcycles">
      <div
        v-for="(micro, microIndex) in plan.duration"
        :key="`micro_${microIndex}`"
        :style="{ backgroundColor: plan.block_color.split(',')[microIndex] }"
        :class="{ noColor: plan.block_color === '' }"
        class="microcycle"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    plan: Object
  }
}
</script>
