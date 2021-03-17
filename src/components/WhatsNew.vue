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
      Enhanced workflow, visuals, and more mobile-friendly
    </h2>
    <br><br>
    <div class="update_wrapper">
      <div class="update_item">
        <img :src="require('../assets/whats-new/new-editor.png')" alt="New editor">
        <h2>
          New editor
        </h2>
        <p class="grey">
          Try our new text editor. It's faster and more convenient. You can now access templates for your sessions in the toolbar with additional support for use on mobile devices.<br><br>**We recommend that you should create new sessions and copy it over from your current plans**
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/progress.png')" alt="Progress sessions upgrade">
        <h2>
          Progression update
        </h2>
        <p class="grey">
          Quickly spread and change the session protocols across multiple weeks/microcycles
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/calendar.png')" alt="New calendar">
        <h2>
          Updated calendar
        </h2>
        <p class="grey">
          Visualise all the sessions in our new monthly view. You can now head straight towards the session by clicking on it through the calendar.
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/graph.png')" alt="New graph">
        <h2>
          Updated graph
        </h2>
        <p class="grey">
          We've made our line-chart more interactive and responsive. You can now click on a point to get the value and find out where it occurred.
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/duplicate.png')" alt="Duplicate plans">
        <h2>
          Duplicate plans
        </h2>
        <p class="grey">
          If you need a copy of the same plan or adapting a similar plan for another client, then simply duplicate it over.
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
    <button class="cancel" @click="$parent.isWhatsNewOpen = false, $parent.$parent.will_body_scroll(true), update_version()">
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
