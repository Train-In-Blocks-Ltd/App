<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
.input_pop_up {
  position: fixed;
  width: 60%;
  top: 1rem;
  left: calc(38px + 3rem);
  background-color: $overlay_glass;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: $low_shadow;
  border-radius: 5px;
  padding: 1rem;
  z-index: 1000;
  input {
    margin-top: 1rem
  }
  svg {
    cursor: pointer;
    height: 1.2rem;
    width: 1.2rem;
    position: fixed;
    padding: .2rem;
    right: -.5rem;
    top: -.5rem;
    background-color: $base;
    border: 1px solid $fore;
    border-radius: 50%;
    transition: $transition_standard;
    &:hover {
      opacity: $light_opacity
    }
  }
  .input_button_bar {
    margin-top: 1rem
  }
}

@supports not (backdrop-filter: blur(10px)) {
  .input_pop_up {
    background-color: $fore
  }
}
@media (max-width: 992px) {
  .input_pop_up svg:hover {
    fill: black;
    background-color: $fore;
    border-color: $base
  }
}
@media (max-width: 768px) {
  .input_pop_up {
    width: 80%;
    left: .4rem
  }
}
</style>

<template>
  <form
    v-if="reveal"
    class="input_pop_up"
    @submit.prevent="resolvePromise(urlLink), reveal = false"
  >
    <p>
      <b>
        {{ header }}
      </b>
    </p>
    <p>
      {{ desc }}
    </p>
    <input
      v-if="inputType === 'link'"
      v-model="urlLink"
      type="text"
      placeholder="Link URL"
      aria-label="Link URL"
      required
    >
    <input
      v-else-if="inputType === 'image'"
      id="img_uploader"
      type="file"
      accept=".png, .jpeg, .jpg, .webp, .gif"
      @change="$parent.addImg(), reveal = false"
    >
    <div class="input_button_bar">
      <button v-if="inputType !== 'image'">
        Submit
      </button>
      <button class="red_button" @click="resolvePromise(false), reveal = false">
        Cancel
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      header: null,
      desc: null,
      reveal: false,
      resolvePromise: undefined,
      urlLink: null,
      inputType: null
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

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Shows the input alert.
     * @param {string} inputType - The mode of the alert.
     * @param {string} header - The title of the alert.
     * @param {string} desc - The description of the alert.
     * @returns A promise to resolve the state of the alert.
     */
    show (inputType, header, desc) {
      this.inputType = inputType
      this.reveal = true
      this.header = header
      this.desc = desc
      this.urlLink = null
      return new Promise((resolve) => {
        this.resolvePromise = resolve
      })
    }
  }
}
</script>
