<style scoped>
  h1 {
    margin-bottom: 0;
    text-transform: capitalize;
  }
  .programme_info {
    display: grid;
    grid-template-columns: max-content;
  }
  .programme_info input:not([type="submit"]), #notes {
    background-color: initial!important;
    border: none;
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding: 0;
    font-size: 1rem;
  }
  #title, h3 {
    font-size: 1.25rem;
    font-weight: bold;
  }
  #duration {
    width: 3ch;
  }
  #title, #duration {
    margin-bottom: 0.25rem;
  }
  #description, #start {
    margin-top: 0.25rem;
  }
  .programme_grid {
    display: grid;
    grid-template-areas: "table notes";
    grid-template-columns: 1fr 0.33fr;
    grid-gap: 2rem;
  }
  .notes {
    grid-area: notes;
    padding-left: 1rem;
    border-left: 3px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
  }
  .notes form label b {
    display: block;
    font-size: 1.25rem;
  }
  .notes form textarea {
    display: block;
    width: 100%;
    resize: vertical;
  }
</style>

<template>
    <div id="programme" v-if="this.$parent.client_details">
      <h1>{{this.$route.params.name}}</h1>
      <div v-for="(programme, index) in $parent.client_details.programmes"
        :key="index">
        <div v-if="programme.id == $route.params.id">
          <form class="programme_info" v-on:submit.prevent="update_programme()">
            <input type="text" id="title" name="name" v-model="programme.name" v-on:click="editing()"/>
            <input type="text" id="description" name="description" v-model="programme.description" v-on:click="editing()"/>
            <label><b>Duration: </b><input type="number" id="duration" name="duration" v-model="programme.duration" required v-on:click="editing()"/> weeks</label>
            <label><b>Start: </b><input type="date" id="start" name="start" v-model="programme.start" required v-on:click="editing()"/></label>
            <div><input v-if="edit" type="submit" class="button" value="Save" /></div>
          </form>
        </div>
      </div>
      <p v-if="this.programme_update_response"><b>{{programme_update_response}}</b></p>
      <p v-if="this.programme_update_error"><b>{{programme_update_error}}</b></p>
      <div class="programme_grid">
        <div class="programme_table"></div>
        <div class="notes">
          <div v-for="(programme, index) in $parent.client_details.programmes"
            :key="index">
            <div v-if="programme.id == $route.params.id">
              <form v-on:submit.prevent="update_programme()">
                <label><b>Notes</b><textarea id="notes" name="notes" v-model="programme.notes" required v-on:click="editing1()"></textarea></label>
                <div><input v-if="edit1" type="submit" class="button" value="Save" /></div>
              </form>
            </div>
          </div>
          <p v-if="this.programme1_update_response"><b>{{programme1_update_response}}</b></p>
          <p v-if="this.programme1_update_error"><b>{{programme1_update_error}}</b></p>
        </div>
      </div>
      <div class="workouts">
        <h3>Workouts</h3>
        
        <button v-if="!creating" id="add_programme_link" class="button" v-on:click="creation()">New workout</button>
        <p class="response" v-if="!creating">{{response}}</p>
        <div class="add_new_programme_container" v-if="creating">
            <h3>Add new workout</h3>
            <form name="add_program" class="form_grid" v-on:submit.prevent="save()">
                <label for="name"><b>Name: </b></label><input type="text" id="name" name="name" v-model="new_workout.name" required/>
                <label for="start"><b>Start: </b></label><input type="date" id="date" name="date" v-model="new_workout.date" required />
                <label for="notes"><b>Description: </b></label><textarea id="description" name="description" v-model="new_workout.description"></textarea>
                <div class="form_buttons">
                    <input type="submit" class="button" value="Save" />
                    <button class="button" v-on:click="close()">Close</button>
                </div>
            </form>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    data: function () {
      return {
        creating: false,
        response: '',
        edit: false,
        edit1: false,
        programme_update_response: '',
        programme_update_error: '',
        programme1_update_response: '',
        programme1_update_error: '',
        new_workout: {
          name: '',
          date: '',
          desc: ''
        }
      }
    },
    async created () {
      await this.get_programme()
    },
    methods: {
      async update_programme () {

      },
      async get_programme () {
        if (!(typeof this.$parent.posts === 'object' && this.$parent.posts !== null) || this.$parent.posts == null) {
          await this.$parent.clients_to_vue()
        }
        var x
        for (x in this.$parent.posts) {
          if (this.$parent.posts[x].name === this.$route.params.name) {
            this.$parent.client_details = this.$parent.posts[x]
          }
        }
      },
      editing () {
        this.edit1 = false
        this.edit = true
      },
      editing1 () {
        this.edit = false
        this.edit1 = true
      },
      creation () {
        this.creating = true
      },
      close () {
        this.creating = false
        this.response = ''
      },
    }
  }
</script>