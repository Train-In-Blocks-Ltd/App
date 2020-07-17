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
      <div class="guide-item">
        <img class="img--gif" src="../../assets/guide/gif/add-client.gif" alt="Adding a new client">
        <div>
          <h2>Adding a new client</h2>
          <p>Text</p>
        </div>
      </div>
      <div class="guide-item">
        <img class="img--gif" src="../../assets/guide/gif/client-notes.gif" alt="Adding client notes">
        <div>
          <h2> Adding client notes</h2>
          <p>Text</p>
        </div>
      </div>
      <div class="guide-item">
        <img class="img--gif" src="../../assets/guide/gif/add-block.gif" alt="Adding a new block">
        <div>
          <h2>Adding a new block</h2>
          <p>Text</p>
        </div>
      </div>
    </div>
  </div>
</template>