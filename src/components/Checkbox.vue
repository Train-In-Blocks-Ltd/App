<style scoped>
.check {
  cursor: pointer;
  position: relative;
  margin: auto;
  width: 1rem;
  height: 1rem;
  -webkit-tap-highlight-color: transparent;
  transform: translate3d(0, 0, 0)
}
.check svg {
  position: relative;
  z-index: 1;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #28282860;
  stroke-width: 1.5;
  transform: translate3d(0, 0, 0);
  transition: all .2s ease
}
.check svg path {
  stroke-dasharray: 60;
  stroke-dashoffset: 0
}
.check svg polyline {
  stroke-dasharray: 22;
  stroke-dashoffset: 66
}
.check:hover svg {
  stroke: #282828
}
.checked_box:checked + .check svg {
  stroke: #282828
}
.checked_box:checked + .check svg path {
  stroke-dashoffset: 60;
  transition: all .3s linear
}
.checked_box:checked + .check svg polyline {
  stroke-dashoffset: 42;
  transition: all .2s linear;
  transition-delay: .15s
}
</style>

<template>
  <div>
    <input
      v-if="type === 'v1'"
      :id="'sc-' + itemId"
      class="checked_box"
      type="checkbox"
      style="display: none"
      @change="$parent.change_select_checkbox(itemId)"
    >
    <input
      v-if="type === 'v2'"
      :id="'sc-' + itemId"
      class="checked_box"
      type="checkbox"
      style="display: none"
      @change="$parent.$parent.change_select_checkbox(itemId, indexId)"
    >
    <label :for="'sc-' + itemId" class="check">
      <svg width="18px" height="18px" viewBox="0 0 18 18">
        <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
        <polyline points="1 9 7 14 15 4" />
      </svg>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    itemId: Number,
    indexId: Number,
    type: String
  }
}
</script>
