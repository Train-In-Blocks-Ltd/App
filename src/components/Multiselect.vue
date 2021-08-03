<style lang="scss">
.multi-select {
  z-index: 9;
  position: fixed;
  top: 0;
  right: 0;
  background-color: var(--overlay_glass);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: var(--low_shadow);
  width: 100%;
  padding: 2rem 2rem 2rem calc(38px + 4rem);
  svg #shift path {
    stroke: var(--base)
  }
  .selection_indicator {
    text-align: center;
    font-size: 1.4rem;
    margin-bottom: 2rem
  }
  .multi-select_options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    &.evenColumns {
      grid-template-columns: repeat(2, 1fr)
    }
    a {
      width: fit-content;
      margin: auto;
      font-size: 1.4rem;
      > svg {
        height: 31px;
        width: 31px;
        margin-left: .8rem
      }
    }
  }
}
@supports not (backdrop-filter: blur(10px)) {
  .multi-select {
    background-color: var(--fore)
  }
}

/* Responsiveness */
@media (max-width: 768px) {
  .multi-select {
    padding: 2rem;
    .multi-select_options a,
    .selection_indicator {
      font-size: 1rem
    }
    .multi-select_options a > svg {
      height: 22px;
      width: 22px
    }
  }
}
@media (max-width: 576px) {
  .multi-select_options {
    grid-template-columns: 1fr 1fr
  }
}
</style>

<template>
  <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
    <div v-if="selected.length !== 0" class="multi-select">
      <p class="selection_indicator">
        <b>Selected {{ selected.length }} {{ selected.length === 1 ? type : `${type}s` }} to ...</b>
      </p>
      <div
        :class="{ evenColumns: options.length % 3 !== 0 }"
        class="multi-select_options"
      >
        <a
          v-for="(option, index) in options"
          :key="`${type}_option_${index}`"
          :style="{ color: option.name === 'Delete' ? 'var(--base_red)' : 'var(--base)' }"
          class="a_link"
          href="javascript:void(0)"
          @click="$emit('response', option.name)"
        >
          {{ option.name }}
          <inline-svg v-if="option.svg !== null" :src="require(`../assets/${option.svg}`)" />
        </a>
      </div>
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
