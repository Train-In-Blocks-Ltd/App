<style lang="scss" scoped>
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
  z-index: 1000;
  svg {
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
    transition: var(--transition_standard);
    &:hover {
      opacity: var(--light_opacity)
    }
  }
  .close_button {
    margin-top: .6rem
  }
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
  <div v-if="reveal" class="response_pop_up">
    <p>
      <b>
        {{ header }}
      </b>
    </p>
    <p>
      {{ desc }}
    </p>
    <button
      v-if="persist"
      class="close_button"
      @click="header = null, desc = null, persist = false, reveal = false"
    >
      Okay
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reveal: false,
      header: null,
      desc: null,
      persist: false,
      cover: false
    }
  },
  watch: {
    reveal () {
      if (this.cover) {
        this.$parent.$refs.overlay.show = this.reveal
      }
      if (!this.persist) {
        if (!this.reveal) {
          this.header = null
          this.desc = null
          this.persist = false
        }
        setTimeout(() => {
          this.reveal = false
        }, 3000)
      }
    }
  },
  methods: {

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Shows the response alert.
     * @param {string} header - The title of the alert.
     * @param {string} desc - The description of the alert.
     * @param {boolean} persist - Whether the alert will persist until the user closes it.
     * @param {boolean} cover - Whether the alert will also have a dark overlay to prevent user actions on other elements.
     */
    show (header, desc, persist, cover) {
      this.header = header
      this.desc = desc
      this.persist = persist || false
      this.cover = cover || false
      this.reveal = true
    }
  }
}
</script>
