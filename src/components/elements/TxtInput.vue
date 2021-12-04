<style lang="scss" scoped>
.txt_input {
  height: fit-content;
  height: -moz-fit-content;
  width: auto;
  user-select: none;
  cursor: pointer;
  align-self: center;
  input {
    outline: none;
    width: 100%;
    padding: 0.6rem;
    resize: none;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1rem;
    color: var(--base);
    border: 2px solid var(--base_faint);
    border-radius: 8px;
    background-color: transparent;
    box-shadow: none;
    transition: var(--transition_standard);
    &:not(select) {
      -moz-appearance: none;
      -webkit-appearance: none;
    }
    &:not(:focus):hover {
      opacity: var(--light_opacity);
    }
    &:focus {
      border: 2px solid var(--base);
    }
    &.small_border_radius {
      border-radius: 5px;
    }
  }
}
</style>

<template>
  <div class="txt_input">
    <label v-if="label" :for="name" :class="labelClass">
      {{ label }}
    </label>
    <input
      :name="name"
      :value="value"
      :class="inputClass"
      :type="type"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      :pattern="pattern"
      @input="handleInput"
    />
    <txt v-if="error" :class="errorClass">{{ error }}</txt>
  </div>
</template>

<script>
const Txt = () =>
  import(
    /* webpackChunkName: "components.txt", webpackPrefetch: true  */ "./Txt"
  );

export default {
  components: {
    Txt,
  },
  props: {
    name: String,
    label: String,
    error: String,
    value: String,
    inputClass: String,
    labelClass: String,
    errorClass: String,
    type: String,
    rel: String,
    inputmode: String,
    autocomplete: String,
    placeholder: String,
    ariaLabel: String,
    pattern: String,
    vModel: String,
    onInput: Function,
  },
  methods: {
    handleInput(e) {
      this.$emit("output", e.target.value);
      if (this.onInput) this.onInput();
    },
  },
};
</script>
