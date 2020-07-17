<style scoped>
  .container--guide {
    display: grid;
    grid-template-rows: repeat(3, 400px)
  }
  .guide-item {
    display: grid;
    grid-template-columns: 1fr 1fr
  }
  .img--gif {
    height: auto;
    width: 90%
  }

  @media (max-width: 576px) {
    .container--guide {
      grid-gap: 4rem
    }
    .guide-item {
      grid-template: 1fr 1fr/1fr
    }
    .img--gif {
      width: 100%
    }
  }
</style>

<template>
  <div id="learn">
    <h1 class="main-title">Learn</h1>
    <div class="container--guide">
      <div v-for="item in guides" :key="item.id" class="guide-item">
        <img class="img--gif" :src="require('../../assets/guide/gif/' + item.gif)">
        <div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      guides: [
        { id: 1, gif: 'add-client.gif', title: 'Adding a new client', text: 'Text' },
        { id: 2, gif: 'client-notes.gif', title: 'Adding client notes', text: 'Text' },
        { id: 3, gif: 'add-block.gif', title: 'Adding a new block', text: 'Text' }
      ]
    }
  }
}
</script>