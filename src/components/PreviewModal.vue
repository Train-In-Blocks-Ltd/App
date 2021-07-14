<style lang="scss">
@import '../assets/styles/variables.scss';
.preview_modal {
  .preview_html {
    margin: 1rem 0 2rem 0;
    &.noMedia :is(img, iframe) {
      display: none
    }
    * {
      color: $base;
      transition: $transition_standard
    }
    p {
      margin: .6rem 0
    }
    :is(h1, h2) {
      font-size: 1rem
    }
    :is(img, iframe) {
      max-width: 100%;
      border-radius: 10px;
      margin: 1rem 0
    }
  }
}
</style>

<style lang="scss" scoped>
.title_container {
  display: flex;
  justify-content: space-between;
  h3.title {
    margin-bottom: 2rem
  }
}
</style>

<template>
  <div class="preview_modal">
    <div :class="{ opened_sections: html !== '' && html !== null }" class="section_overlay" />
    <div v-if="html !== '' && html !== null" class="tab_overlay_content fadeIn delay fill_mode_both">
      <div class="title_container">
        <h3 class="title">
          {{ desc }}
        </h3>
        <inline-svg
          class="icon--options cursor"
          :src="require('../assets/svg/close.svg')"
          aria-label="Close"
          @click="$emit('close'), willBodyScroll(true)"
        />
      </div>
      <div
        class="preview_html"
        :class="{ noMedia: !showMedia }"
        @click="focused = true"
        @mouseleave="focused = false"
        v-html="updateHTML(html, !showBrackets)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    desc: String,
    type: String,
    html: String,
    showMedia: Boolean,
    showBrackets: Boolean
  }
}
</script>
