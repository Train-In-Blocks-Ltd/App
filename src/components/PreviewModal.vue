<style>
/* Preview HTML */
.preview_html {
  font-size: .8rem;
  margin-top: .4rem
}
.preview_html * {
  color: var(--base);
  transition: var(--transition_standard)
}
.preview_html p {
  margin: .4rem 0
}
.preview_html h1,
.preview_html h2 {
  font-size: 1rem
}
.preview_html img,
.preview_html iframe,
.preview_html a {
  display: none
}
</style>

<style scoped>
/* Other */
.title {
  margin-bottom: 2rem
}
button.red_button {
  width: 30%;
  margin: 2rem 0
}

/* Responsive */
@media (max-width: 768px) {
  button.red_button {
    width: 100%
  }
}
</style>

<template>
  <div>
    <div :class="{ opened_sections: html !== '' }" class="section_overlay" />
    <div v-if="html !== ''" class="tab_overlay_content fadeIn delay fill_mode_both">
      <h2 class="title">
        {{ desc[0] }} has given feedback for {{ `${desc[1]} on ${desc[2]}` }}
      </h2>
      <div v-html="html" />
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
    desc: Array,
    html: String
  }
}
</script>
