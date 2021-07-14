<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
.check {
  cursor: pointer;
  position: relative;
  margin: auto;
  width: 1rem;
  height: 1rem;
  -webkit-tap-highlight-color: transparent;
  transform: translate3d(0, 0, 0);
  svg {
    position: relative;
    z-index: 1;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: $base_faint;
    stroke-width: 1.5;
    transform: translate3d(0, 0, 0);
    transition: all .2s ease;
    path {
      stroke-dasharray: 60;
      stroke-dashoffset: 0
    }
    polyline {
      stroke-dasharray: 22;
      stroke-dashoffset: 66
    }
  }
  &:hover {
    svg {
      stroke: $base
    }
  }
}
.checked_box:checked + .check svg {
  stroke: $base;
  path {
    stroke-dashoffset: 60;
    transition: all .3s linear
  }
  polyline {
    stroke-dashoffset: 42;
    transition: all .2s linear;
    transition-delay: .15s
  }
}
</style>

<template>
  <div>
    <input
      v-if="type === 'v1'"
      :id="`sc-${itemId}`"
      :name="`sc-${itemId}`"
      class="checked_box"
      type="checkbox"
      style="display: none"
      @change="$parent.changeSelectCheckbox(itemId)"
    >
    <input
      v-else-if="type === 'v2'"
      :id="`sc-${itemId}`"
      :name="`sc-${itemId}`"
      class="checked_box"
      type="checkbox"
      style="display: none"
      @change="$parent.$parent.changeSelectCheckbox(itemId)"
    >
    <label :for="`sc-${itemId}`" class="check">
      <svg width="18px" height="18px" viewBox="0 0 18 18" class="no_fill">
        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
        <polyline points="1 9 7 14 15 4" />
      </svg>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    itemId: [Number, Boolean],
    type: String
  }
}
</script>
