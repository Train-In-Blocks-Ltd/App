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

/* Responsive */
@media (max-width: 576px) {
  button {
    width: 100%
  }
  .update_item {
    padding: .8rem
  }
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
      <div
        v-for="(item, index) in content"
        :key="`item_${index}`"
        class="update_item"
      >
        <img v-if="item.img" :src="require(`../assets/whats-new/${item.img}`)" :alt="item.title">
        <h2>
          {{ item.title }}
        </h2>
        <p class="grey">
          {{ item.desc }}
        </p>
      </div>
    </div>
    <br>
    <button class="red_button" @click="$parent.isWhatsNewOpen = false, will_body_scroll(true), update_version()">
      Close
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: [
        { title: 'Dark mode', desc: 'Working at night? Let\'s take some strain off the eyes. You can turn on dark mode through your Account page.', img: 'dark-mode.png' },
        { title: 'New editor style', desc: 'We\'ve made a minor change to how the editor looks but it still works in a similar way. Simply click on the text to start editing.', img: 'editor-style.png' },
        { title: 'Highlight formatting', desc: 'Want to bold, italic, or underline some text? Just highlight it and get stylish! The formatter will follow you to where you are working.', img: 'highlight.png' },
        { title: 'Plan overview', desc: 'You can now organise your plans in the order that they will occur. Much like a periodised model, you can see how the number of microcycles and their colour-code in this general overview.', img: 'new-plans.png' },
        { title: 'Printing sessions', desc: 'Want a physical copy or a PDF? You can simply select all the sessions that you wish to export and print from the menu.', img: 'print.png' },
        { title: 'Client-side improvements', desc: 'Your clients will now enjoy a smoother and faster interface. With access to the portfolio, they can get additional information about your services such as transformations, payments and plans.', img: false }
      ]
    }
  },
  methods: {
    update_version () {
      localStorage.setItem('versionBuild', this.$parent.$parent.versionBuild)
      this.$parent.$parent.newBuild = false
    }
  }
}
</script>
