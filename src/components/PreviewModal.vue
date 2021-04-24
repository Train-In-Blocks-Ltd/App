<style>
/* Preview HTML */
.preview_modal .preview_html {
  font-size: .8rem;
  margin-top: .4rem
}
.preview_modal .preview_html * {
  color: var(--base);
  transition: var(--transition_standard)
}
.preview_modal .preview_html p {
  margin: .4rem 0
}
.preview_modal .preview_html :is(h1, h2) {
  font-size: 1rem
}
.preview_modal .preview_html :is(img, iframe) {
  max-width: 100%;
  border-radius: 10px;
  margin: 1rem 0
}
.noMedia :is(img, iframe) {
  display: none
}
</style>

<style scoped>
/* Other */
h2.title {
  margin-bottom: 2rem
}
button.red_button {
  margin: 2rem 0
}
.copy_msg {
  margin-bottom: 1rem
}

/* Responsive */
@media (max-width: 768px) {
  button.red_button {
    width: 100%
  }
}
</style>

<template>
  <div class="preview_modal">
    <div :class="{ opened_sections: html !== '' && html !== null }" class="section_overlay" />
    <div v-if="html !== '' && html !== null" class="tab_overlay_content fadeIn delay fill_mode_both">
      <h3 class="title">
        {{ desc }}
      </h3>
      <p class="copy_msg">
        Select, copy, and paste it into your sessions
      </p>
      <div
        class="preview_html"
        :class="{ noMedia: !showMedia }"
        @click="focused = true"
        @mouseleave="focused = false"
        v-html="update_html(html, !showBrackets)"
      />
      <button
        class="red_button"
        @click="$emit('close'), will_body_scroll(true)"
      >
        Close
      </button>
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
