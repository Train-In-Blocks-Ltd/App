<style>
.multi-select {
  display: grid;
  grid-gap: .8rem;
  position: fixed;
  top: 0;
  right: 0;
  text-align: right;
  background-color: var(--fore);
  box-shadow: var(--low_shadow);
  width: 100%;
  z-index: 9;
  padding: 2rem;
  justify-items: end
}
.multi-select a > svg {
  margin-left: .4rem
}
</style>

<template>
  <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
    <div v-if="selected.length !== 0" class="multi-select">
      <p>
        <b>Selected {{ selected.length }} {{ selected.length === 1 ? type : `${type}s` }} to ...</b>
      </p>
      <a
        v-for="(option, index) in options"
        :key="`${type}_option_${index}`"
        :style="{ color: option.name === 'Delete' ? 'rgb(184, 0, 0)' : 'var(--base)' }"
        class="a_link"
        href="javascript:void(0)"
        @click="$emit('response', option.name)"
      >
        {{ option.name }}
        <inline-svg v-if="option.svg !== null" :src="require(`../assets/${option.svg}`)" />
      </a>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    type: String,
    options: Array,
    selected: Array
  }
}
</script>
