<style>
svg#confirm_close path {
  fill: white
}
</style>

<style scoped>
.confirm_pop_up {
  position: fixed;
  top: 1rem;
  left: calc(38px + 3rem);
  background-color: var(--overlay_glass);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: var(--low_shadow);
  border-radius: 5px;
  padding: 1rem;
  z-index: 1000
}
.confirm_pop_up svg {
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
.confirm_pop_up svg:hover {
  opacity: .6
}

/* Button */
.confirm_button_bar {
  margin-top: 1rem
}

@supports not (backdrop-filter: blur(10px)) {
  .confirm_pop_up {
    background-color: var(--fore)
  }
}
@media (max-width: 992px) {
  .confirm_pop_up svg:hover {
    fill: black;
    background-color: var(--fore);
    border-color: var(--base)
  }
}
@media (max-width: 768px) {
  .confirm_pop_up {
    max-width: 300px;
    left: .4rem
  }
}
</style>

<template>
  <div v-if="reveal" class="confirm_pop_up">
    <p>
      <b>
        {{ header }}
      </b>
    </p>
    <p>
      {{ desc }}
    </p>
    <div class="confirm_button_bar">
      <button @click="resolvePromise(true), reveal = false">
        Confirm
      </button>
      <button class="red_button" @click="resolvePromise(false), reveal = false">
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      header: null,
      desc: null,
      reveal: false,
      resolvePromise: undefined
    }
  },
  watch: {
    reveal () {
      this.$parent.$refs.overlay.show = this.reveal
      if (!this.reveal) {
        this.header = null
        this.desc = null
      }
    }
  },
  methods: {
    show (header, desc) {
      this.reveal = true
      this.header = header
      this.desc = desc
      return new Promise((resolve) => {
        this.resolvePromise = resolve
      })
    }
  }
}
</script>
