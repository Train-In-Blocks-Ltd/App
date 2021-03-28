<style>
svg#close path {
  fill: white
}
</style>

<style scoped>
.response_pop_up {
  position: fixed;
  top: 1rem;
  left: calc(38px + 3rem);
  background-color: var(--overlay_glass);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: var(--low_shadow);
  border-radius: 5px;
  padding: 1rem;
  z-index: 999
}
.response_pop_up svg {
  cursor: pointer;
  height: 1.2rem;
  width: 1.2rem;
  position: fixed;
  padding: .2rem;
  right: -.5rem;
  top: -.5rem;
  background-color: var(--base);
  border: 1px solid var(--fore);
  border-radius: 50%;
  transition: var(--transition_standard)
}
.response_pop_up svg:hover {
  opacity: .6
}

@supports not (backdrop-filter: blur(10px)) {
  .response_pop_up {
    background-color: var(--fore)
  }
}
@media (max-width: 992px) {
  .response_pop_up svg:hover {
    fill: black;
    background-color: var(--fore);
    border-color: var(--base)
  }
}
@media (max-width: 768px) {
  .response_pop_up {
    max-width: 300px;
    left: .4rem
  }
}
</style>

<template>
  <div class="response_pop_up">
    <inline-svg
      :src="require('../assets/svg/close.svg')"
      @click="$parent.responseHeader = '', $parent.responseDesc = '', $parent.responsePersist = false"
    />
    <p>
      <b>
        {{ header }}
      </b>
    </p>
    <p>
      {{ desc }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    header: String,
    desc: String
  }
}
</script>
