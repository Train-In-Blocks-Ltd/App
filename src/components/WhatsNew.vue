<style scoped>
img {
  width: 100%;
  border-radius: 10px;
  margin: 1rem 0
}
.update_wrapper {
  display: grid;
  grid-gap: 4rem
}
.update_item {
  background-color: var(--fore);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: var(--low_shadow)
}
</style>

<template>
  <div class="bottom_margin">
    <h1>
      What's new in {{ $parent.$parent.versionName }} {{ $parent.$parent.versionBuild }}?
    </h1>
    <h2 class="grey">
      Dark mode, new styles, and bug fixes
    </h2>
    <br><br>
    <div class="update_wrapper">
      <div class="update_item">
        <img :src="require('../assets/whats-new/dark-mode.png')" alt="Dark mode">
        <h2>
          Dark mode
        </h2>
        <p class="grey">
          Working at night? Let's take some strain off the eyes. You can turn on dark mode through your <strong>Account</strong> page.
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/editor-style.png')" alt="New editor style">
        <h2>
          New editor style
        </h2>
        <p class="grey">
          We've made a minor change to how the editor works. Simply click on the text to start editing.
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/highlight.png')" alt="Highlight formatting">
        <h2>
          Highlight formatting
        </h2>
        <p class="grey">
          Want to bold, italic, or underline some text? Just highlight it and get stylish!
        </p>
      </div>
      <div class="update_item">
        <h2>
          Client-side improvements
        </h2>
        <p class="grey">
          Your clients will now enjoy a smoother and faster interface. With access to the portfolio, they can get additional information about your services such as transformations, payments and plans.
        </p>
      </div>
    </div>
    <br>
    <button class="cancel" @click="$parent.isWhatsNewOpen = false, will_body_scroll(true), update_version()">
      Close
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    update_version () {
      localStorage.setItem('versionBuild', this.$parent.$parent.versionBuild)
      this.$parent.$parent.newBuild = false
    }
  }
}
</script>
