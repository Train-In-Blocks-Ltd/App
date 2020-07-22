<style scoped>
  .modal--feedback-client {
    padding: 2rem
  }
  .modal--feedback-client button {
    margin-left: 1rem
  }

  /* Mobile */
  @media (max-width: 576px) {
    .modal--feedback-client {
      padding: 1rem
    }
  }
</style>

<template>
  <div id="block">
    <div v-for="(programme, index) in this.$parent.programmes"
      :key="index">
      <div v-if="programme.id == $route.params.id">
        <div class="workout--header">
          <h2 class="main-title">{{programme.name}}</h2>
        </div>
        <div class="block-notes">
          <div class="block-notes__header">
            <p class="block-notes__header__text"><b>Block Notes</b></p>
          </div>
          <div v-if="programme.notes !== ''" v-html="programme.notes" class="show-block-notes animate__animated animate__fadeIn" />
          <p v-if="programme.notes === ''" class="show-block-notes">No block notes added...</p>
        </div>
        <div class="spacer"/>
        <h2 class="sub-title no-margin">Workouts</h2>
        <div class="container--workouts" v-if="programme.workouts">
          <div class="wrapper--workout" v-for="(workout, index) in programme.workouts"
            :key="index" v-show="index == currentWorkoutIndexBlock">
            <modal :name="'feedback-client-block-' + workout.id" height="100%" width="100%" :adaptive="true" :clickToClose="false">
              <div class="modal--feedback-client">
                <quill :config="$parent.config" v-model="workout.feedback" output="html" class="quill animate__animated animate__fadeIn"/>
                <button @click="$modal.hide('feedback-client-block-' + workout.id), update_workout(workout.id)" class="button">Close</button>
              </div>
            </modal>
            <p class="wrapper--workout__header" :id="workout.name">
              <span class="text--name"><b>{{workout.name}}</b></span><br>
              <span class="text--date">{{day(workout.date)}}</span>
              <span class="text--date">{{workout.date}}</span>
            </p>
            <div v-html="workout.notes" class="show-workout animate__animated animate__fadeIn"/>
            <div class="bottom-bar">
              <button v-if="workout.checked === 1" @click="workout.checked = 0, update_workout(workout.id)" id="button-done" class="button">Completed</button>
              <button v-if="workout.checked === 0" @click="workout.checked = 1, update_workout(workout.id)" id="button-to-do" class="button">Incomplete</button>
              <button @click="$modal.show('feedback-client-block-' + workout.id)" class="button no-margin">Give Feedback</button>
            </div>
          </div>
        </div>
        <button class="button" v-show="currentWorkoutIndexBlock != 0" @click="currentWorkoutIndexBlock--">Back</button>
        <button class="button" v-show="currentWorkoutIndexBlock != maxWorkoutIndexBlock" @click="currentWorkoutIndexBlock++">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        editWorkout: null,
        maxWorkoutIndexBlock: null,
        currentWorkoutIndexBlock: 0
      }
    },
    async mounted () {
      this.$parent.claims = await this.$auth.getUser()
      await this.$parent.get_programmes()
      this.initCountWorkoutsBlock()
      this.sortWorkoutsBlock()
    },
    methods: {
      sortWorkoutsBlock () {
        this.$parent.programmes.forEach((block) => {
          //eslint-disable-next-line
          if (block.id == this.$route.params.id) {
            block.workouts.sort((a, b) => {
              return new Date(a.date) - new Date(b.date)
            })
          }
        })
      },
      initCountWorkoutsBlock () {
        this.$parent.programmes.forEach((block) => {
          //eslint-disable-next-line
          if (block.id == this.$route.params.id) {
            this.maxWorkoutIndexBlock = block.workouts.length - 1
          }
        })
      },
      day (date) {
        var weekday = new Array(7)
        weekday[0] = 'Sun'
        weekday[1] = 'Mon'
        weekday[2] = 'Tue'
        weekday[3] = 'Wed'
        weekday[4] = 'Thu'
        weekday[5] = 'Fri'
        weekday[6] = 'Sat'
        var d = new Date(date)
        return weekday[d.getDay()]
      },
      async update_workout (id) {
        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`

        let x
        // Set the programme variable to the current programme
        for (x in this.$parent.programmes) {
          //eslint-disable-next-line
          if (this.$parent.programmes[x].id == this.$route.params.id) {
            var programme = this.$parent.programmes[x]
            var y
            for (y in programme.workouts) {
              if (programme.workouts[y].id === id) {
                var workoutsId = programme.workouts[y].id
                var workoutsChecked = programme.workouts[y].checked
                var workoutsFeedback = programme.workouts[y].feedback
              }
            }
          }
        }
        try {
          await axios.post(`https://api.traininblocks.com/client-workouts`,
            {
              'id': workoutsId,
              'checked': workoutsChecked,
              'feedback': workoutsFeedback
            }
          )
          this.$ga.event('Workout', 'update')
        } catch (e) {
          console.log(e.toString())
        }
        await this.$parent.get_workouts()
        this.sortWorkoutsBlock()
      }
    }
  }
</script>