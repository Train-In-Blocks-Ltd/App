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
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 20px 10px #28282810
}
</style>

<template>
  <div class="bottom_margin">
    <p class="text--large">
      What's new in {{ $parent.$parent.versionName }} {{ $parent.$parent.versionBuild }}?
    </p>
    <p class="text--large grey">
      Enhanced workflow, visuals, and more mobile-friendly
    </p>
    <br><br>
    <div class="update_wrapper">
      <div class="update_item">
        <img :src="require('../assets/whats-new/new-editor.png')" alt="New editor">
        <p class="text--small">
          New editor
        </p>
        <p class="text--small grey">
          Try our new text editor. It's faster and more convenient. You can now access templates for your sessions in the toolbar with additional support for use on mobile devices.<br><br>**We recommend that you should create new sessions and copy it over from your current plans**
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/progress.png')" alt="Progress sessions upgrade">
        <p class="text--small">
          Progression update
        </p>
        <p class="text--small grey">
          Quickly spread and change the session protocols across multiple weeks/microcycles
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/calendar.png')" alt="New calendar">
        <p class="text--small">
          Updated calendar
        </p>
        <p class="text--small grey">
          Visualise all the sessions in our new monthly view. You can now head straight towards the session by clicking on it through the calendar.
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/graph.png')" alt="New graph">
        <p class="text--small">
          Updated graph
        </p>
        <p class="text--small grey">
          We've made our line-chart more interactive and responsive. You can now click on a point to get the value and find out where it occurred.
        </p>
      </div>
      <div class="update_item">
        <img :src="require('../assets/whats-new/duplicate.png')" alt="Duplicate plans">
        <p class="text--small">
          Duplicate plans
        </p>
        <p class="text--small grey">
          If you need a copy of the same plan or adapting a similar plan for another client, then simply duplicate it over.
        </p>
      </div>
      <div class="update_item">
        <p class="text--small">
          Client-side improvements
        </p>
        <p class="text--small grey">
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
