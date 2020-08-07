<style scoped>
  .container--guide {
    display: grid;
    grid-template-rows: repeat(10, 400px)
  }
  .guide-item {
    display: grid;
    grid-template-columns: 1fr 1fr
  }
  .img--gif {
    height: auto;
    width: 90%
  }
  .text--more-help {
    text-decoration: none;
    color: #282828;
    transition: .4s all cubic-bezier(.165, .84, .44, 1)
  }
  .text--more-help:hover {
    opacity: .6
  }

  @media (max-width: 768px) {
    .container--guide {
      margin: 4rem 0;
      grid-gap: 10rem
    }
    .guide-item {
      grid-template: 1fr 1fr/1fr
    }
    .img--gif {
      width: 60%
    }
  }

  /* Mobile */
  @media (max-width: 576px) {
    .text--more-help:hover {
      opacity: 1
    }
  }
</style>

<template>
  <div id="help">
    <h1 class="main-title">Learn</h1>
    <p>Need help with something in particular? Click <a class="text--more-help" href="https://traininblocks.atlassian.net/servicedesk/customer/portal/3" target="_blank"><b>here</b></a>.</p>
    <div class="spacer"/>
    <h2 class="sub-title"> Guides</h2>
    <div class="container--guide">
      <div v-for="item in guides" :key="item.id" class="guide-item">
        <img class="img--gif" :src="require('../../assets/guide/gif/' + item.gif)">
        <div>
          <h2>{{ item.title }}</h2>
          <div v-html="item.text"/>
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
        { id: 1, gif: 'add-client.gif', title: 'Adding a new client', text: '<p>Click the <i>New Client</i> button and fill out the form. <b>You must enter the name and email.</b> Mobile numbers are optional.</p>' },
        { id: 2, gif: 'client-notes.gif', title: 'Adding client notes', text: '<p>Press the <i>Edit</i> button to add some information or data, then press <i>Save</i> or <i>Ctrl + Enter</i>. You can see these notes on the home page with your other clients. Your clients will also be able to see their <i>Client Notes</i>.</p>' },
        { id: 3, gif: 'add-block.gif', title: 'Adding a new block', text: '<p>Follow the same steps as <b><i>Adding a new client</i></b> as mentioned above.</p>' },
        { id: 4, gif: 'add-block-notes.gif', title: 'Adding block notes', text: '<p>Follow the same steps as <b><i>Adding client notes</i></b> as mentioned above.</p>' },
        { id: 5, gif: 'new-workout.gif', title: 'Adding a new workout', text: '<p>Press the <i>New Workout</i> button and start editing the workout. You can also save it by pressing <i>Ctrl + Enter</i>.</p>' },
        { id: 6, gif: 'tracking.gif', title: 'Tracking measurements in a workout', text: '<p>To track exercises or measurements, you need to use the square brackets in the following format.<br><br><b>[</b> <i>Exercise Name</i><b>:</b> <i>Sets</i> <b>x</b> <i>Reps</i> <b>at</b> <i>Load/Load/Load</i> ]<br><br><b>[</b> <i>Measurement</i><b>:</b> <i>Value</i> ]' },
        { id: 7, gif: 'view-data.gif', title: 'Selecting which data to show', text: '<p>To show all tracked data and measurements, use the dropdowns to select the exercise/measure and its data type.</p>' },
        { id: 8, gif: 'toolkit.gif', title: 'Using the toolkit', text: '<p>Click the <i>Toolkit</i> button and select a calculator to use. Fill out the required information and get an instant result.</p>' },
        { id: 9, gif: 'copy-across.gif', title: 'Progressing the workouts', text: '<p>Press the <i>Copy Across</i> icon above your workouts and specify how many microcycles to copy across. You can also state how many days to separate each workout.</p>' },
        { id: 10, gif: 'colour-code.gif', title: 'Colour coding the calendar', text: '<p>Select a microcycle which you want to colour code. Then press the colour icon above your workouts and choose a colour.</p>' }
      ]
    }
  },
  mounted () {
    this.$parent.setup()
  }
}
</script>