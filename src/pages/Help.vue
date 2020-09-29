<style scoped>
  .guide-item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 14rem 0
  }
  .guide-item:first-of-type {
    margin-top: 0
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
    <h1 class="text--large">Learn</h1>
    <p>Need help with something in particular? Click <a class="text--more-help" href="https://traininblocks.atlassian.net/servicedesk/customer/portal/3" target="_blank"><b>here</b></a>.</p>
    <h2 class="text--small"> Guides</h2>
    <div class="container--guide">
      <div v-for="item in guides" :key="item.id" class="guide-item">
        <img class="img--gif" :src="require('../assets/guide/gif/' + item.gif)" alt="">
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
        { id: 2, gif: 'add-client-notes.gif', title: 'Adding client notes', text: '<p>Press the <i>Edit</i> button to add some information or data, then press <i>Save</i> or <i>Ctrl + Enter</i>. You can see these notes on the home page with your other clients. Your clients will also be able to see their <i>Client Notes</i>.</p>' },
        { id: 3, gif: 'give-access.gif', title: 'Create an account for your clients', text: '<p>Press <i>Give Access</i> to send an email to your client to activate and access their account.</p>' },
        { id: 4, gif: 'add-plan.gif', title: 'Adding a new plan', text: '<p>Follow the same steps as <b><i>Adding a new client</i></b> as mentioned above.</p>' },
        { id: 5, gif: 'add-plan-notes.gif', title: 'Adding plan notes', text: '<p>Follow the same steps as <b><i>Adding client notes</i></b> as mentioned above.</p>' },
        { id: 6, gif: 'delete-plan.gif', title: 'Deleting a plan', text: '<p>Press <i>Delete Plan</i> in the hamburger menu to remove the current plan.</p>' },
        { id: 7, gif: 'new-session.gif', title: 'Adding a new session', text: '<p>Press the <i>New Session</i> button and start editing the session. You can also save it by pressing <i>Ctrl + Enter</i>.</p>' },
        { id: 8, gif: 'tracking.gif', title: 'Tracking measurements in a session', text: '<p>To track exercises or measurements, you need to use the square brackets in the following format.<br><br><b>[</b> <i>Exercise Name</i><b>:</b> <i>Sets</i> <b>x</b> <i>Reps</i> <b>at</b> <i>Load/Load/Load</i> ]<br><br><b>[</b> <i>Measurement</i><b>:</b> <i>Value</i> ]' },
        { id: 9, gif: 'view-data.gif', title: 'Selecting which data to show', text: '<p>To show all tracked data and measurements, use the dropdowns to select the exercise/measure and its data type.</p>' },
        { id: 10, gif: 'toolkit.gif', title: 'Using the toolkit', text: '<p>Click the <i>Toolkit</i> button and select a calculator to use. Fill out the required information and get an instant result.</p>' },
        { id: 12, gif: 'copy-across.gif', title: 'Progressing the sessions', text: '<p>Press the <i>Copy Across</i> in the top-right menu when selecting sessions and specify how many microcycles to copy across. You can also state how many days to separate each session.</p>' },
        { id: 13, gif: 'colour-code.gif', title: 'Colour coding the calendar', text: '<p>Select a microcycle which you want to colour code. Then press the colour icon above your sessions and choose a colour.</p>' }
      ]
    }
  },
  mounted () {
    this.$parent.setup()
  }
}
</script>