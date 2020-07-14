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
          <div v-show="!editBlockNotes" v-html="programme.notes" class="show-block-notes animate__animated animate__fadeIn"/>
        </div>
        <div class="spacer"/>
        <h2 class="sub-title no-margin">Workouts</h2>
        <div class="container--workouts" v-if="programme.workouts">
          <div class="wrapper--workout" v-for="(workout, index) in programme.workouts"
            :key="index" v-show="index == currentWorkoutIndexBlock">
            <p class="wrapper--workout__header" :id="workout.name">
              <span class="text--name"><b>{{workout.name}}</b></span><br>
              <span class="text--date">{{day(workout.date)}}</span>
              <span class="text--date">{{workout.date}}</span>
            </p>
            <div v-html="workout.notes" class="show-workout animate__animated animate__fadeIn"/>
            <div class="bottom-bar">
              <button v-if="workout.checked !== 0" @click="workout.checked = 0, update_workout(workout.id)" id="button-done" class="button">Completed</button>
              <button v-if="workout.checked === 0" @click="workout.checked = 1, update_workout(workout.id)" id="button-to-do" class="button">Incomplete</button>
            </div>
          </div>
        </div>
        <button v-show="currentWorkoutIndexBlock != 0" @click="currentWorkoutIndexBlock--">Back</button>
        <button v-show="currentWorkoutIndexBlock != maxWorkoutIndexBlock" @click="currentWorkoutIndexBlock++">Next</button>
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
      await this.get_workouts()
      this.initCountWorkoutsBlock()
      this.sortWorkoutsBlock()
    },
    methods: {
      sortWorkouts () {
        this.$parent.programmes.forEach((block) => {
          if (block.id == this.$route.params.id) {
            block.workouts.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            });
          }
        })
      },
      initCountWorkoutsBlock () {
        this.$parent.programmes.forEach((block) => {
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
      async get_workouts () {
        await this.$parent.setup()
        await this.$parent.get_programmes()
        try {
          // Loop through programmes
          var f
          for (f in this.$parent.programmes) {
            // If programme matches programme in route
            // eslint-disable-next-line
            if (this.$parent.programmes[f].id == this.$route.params.id) {
              if (!JSON.parse(localStorage.getItem('programmes'))[f].workouts) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
                // eslint-disable-next-line
                const response_programmes = await axios.get(`https://api.traininblocks.com/workouts/${this.$parent.programmes[f].id}`)

                this.$parent.programmes[f].workouts = response_programmes.data

                // Update the localstorage with the workouts
                localStorage.setItem('programmes', JSON.stringify(this.$parent.programmes))
              }
              break
            }
          }
        } catch (e) {
          console.log(e.toString())
        }
      },
      async update_workout (id) {
        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`

        let x
        // Set the programme variable to the current programme
        for (x in this.$parent.$parent.programmes) {
          //eslint-disable-next-line
          if (this.$parent.$parent.programmes[x].id == this.$route.params.id) {
            var programme = this.$parent.$parent.programmes[x]
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
          this.msg = 'Saving...'
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
        this.get_workouts()
      }
    }
  }
</script>