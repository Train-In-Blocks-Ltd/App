<style lang="scss" scoped>
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
  z-index: 1000;
  .confirm_button_bar {
    margin-top: 1rem;
  }
}

@supports not (backdrop-filter: blur(10px)) {
  .confirm_pop_up {
    background-color: var(--fore);
  }
}
@media (max-width: 768px) {
  .confirm_pop_up {
    max-width: 300px;
    left: 0.4rem;
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
      <button @click="resolvePromise(true), (reveal = false)">Confirm</button>
      <button
        class="red_button"
        @click="resolvePromise(false), (reveal = false)"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      header: null,
      desc: null,
      reveal: false,
      resolvePromise: undefined,
    };
  },
  watch: {
    reveal() {
      this.$parent.$refs.overlay.show = this.reveal;
      if (!this.reveal) {
        this.header = null;
        this.desc = null;
      }
    },
  },
  methods: {
    // -----------------------------
    // General
    // -----------------------------

    /**
     * Shows the confirmation alert.
     * @param {string} header - The title of the alert.
     * @param {string} desc - The description of the alert.
     * @returns A promise to resolve the state of the alert.
     */
    show(header, desc) {
      this.reveal = true;
      this.header = header;
      this.desc = desc;
      return new Promise((resolve) => {
        this.resolvePromise = resolve;
      });
    },
  },
};
</script>
