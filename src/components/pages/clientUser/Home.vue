
<style scoped>
  /* Overall */
  .container--title {
    display: flex;
    margin: 2rem 0
  }
  .sub-title.no-margin {
    margin: 0
  }

  /* SVG */
  .title-icon {
    margin: auto .6rem auto 0
  }

  /* Blocks */
  .blocks_grid {
    display: grid;
    grid-gap: 2rem;
    margin-bottom: 2rem
  }
  .block_container:first-of-type {
    margin-left: 0
  }
  .block_container:last-of-type {
    margin-right: 0
  }
  .block_container--link {
    display: grid;
    position: relative;
    grid-gap: 1rem;
    width: 95%;
    max-width: 600px;
    min-width: 400px;
    text-decoration: none;
    color: #282828;
    padding: 1rem 0;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .block_container--link:before {
    content: '';
    position: absolute;
    opacity: .4;
    width: 95%;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: #282828;
    transition: all .6s cubic-bezier(.075, .82, .165, 1)
  }
  .block_container--link:hover:before {
    width: 100%;
    opacity: 1
  }
  .block_container--link__block-notes {
    font-size: .8rem
  }
  .block_container--link h3 {
    margin-top: 0;
    font-size: 1.4rem;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis
  }
  .more-block-info {
    margin-top: 1rem
  }
  .block_container--link p {
    font-size: .8rem;
    font-weight: 500
  }
  .block_container--link p:last-of-type {
    margin-bottom: 0
  }

  /* Modal */
  .modal--feedback-client {
    padding: 2rem
  }
  .modal--feedback-client button {
    margin-left: 1rem
  }

  @media (min-width: 1024px) {
    .block_container--link {
      grid-template: 1fr/1fr 1fr;
      grid-gap: 2rem
    }
  }
  @media (min-width: 768px) {
    .title-icon {
      height: 48px;
      width: 48px
    }
  }
  @media (max-width: 768px) {
    .container--block-links {
      flex-direction: column-reverse
    }
    .container--block-links__section {
      margin: 0
    }
    .client-notes, .block_container--link {
      margin: 0;
      min-width: 0;
      width: 100%
    }
  }

  /* For Mobile */
  @media (max-width: 576px) {
    .container--block-links {
      grid-template: .2fr 1fr/1fr;
      grid-template-areas:
        'b'
        'a'
    }
    .blocks_grid {
      grid-template-columns: 1fr
    }
    .modal--feedback-client {
      padding: 1rem
    }
  }
</style>

<template>
  <div id="home">
    <div class="container--client">
      <h1 class="main-title">Home</h1>
      <div class="container--title">
        <inline-svg :src="require('../../../assets/svg/today.svg')" class="title-icon"/>
        <h2 class="sub-title no-margin">Today</h2>
      </div>
      <p v-if="viewWorkoutsStore.length === 0 && loading === false">No workouts today...</p>
      <p v-if="loading === true">Loading workouts...</p>
      <div v-for="(programme, index) in this.$parent.programmes"
        :key="index">
        <div class="container--workouts" v-if="programme.workouts">
          <div class="wrapper--workout" v-for="(workout, index) in programme.workouts"
            :key="index" v-show="workout.id == viewWorkoutsStore[currentWorkoutIndexHome] && isToday()">
            <modal :name="'feedback-client-home-' + workout.id" height="100%" width="100%" :adaptive="true" :clickToClose="false">
              <div class="modal--feedback-client">
                <quill :config="$parent.config" v-model="workout.feedback" output="html" class="quill animate__animated animate__fadeIn"/>
                <button @click="$modal.hide('feedback-client-home-' + workout.id), $parent.update_workout(programme.id, workout.id)" class="button">Close</button>
              </div>
            </modal>
            <p class="wrapper--workout__header" :id="workout.name">
              <span class="text--name"><b>{{workout.name}}</b></span><br>
              <span class="text--date">{{$parent.day(workout.date)}}</span>
              <span class="text--date">{{workout.date}}</span>
            </p>
            <div v-html="removeBrackets(workout.notes)" class="show-workout animate__animated animate__fadeIn"/>
            <div class="bottom-bar">
              <button v-if="workout.checked !== 0" @click="workout.checked = 0, $parent.update_workout(programme.id, workout.id)" id="button-done" class="button no-margin">Completed</button>
              <button v-if="workout.checked === 0" @click="workout.checked = 1, $parent.update_workout(programme.id, workout.id)" id="button-to-do" class="button no-margin">Incomplete</button>
              <button @click="$modal.show('feedback-client-home-' + workout.id)" class="button no-margin">Give Feedback</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="viewWorkoutsStore.length !== 0">
        <button v-show="currentWorkoutIndexHome != 0" @click="currentWorkoutIndexHome--" class="button">Back</button>
        <button v-show="currentWorkoutIndexHome != maxWorkoutIndexHome" @click="currentWorkoutIndexHome++" class="button">Next</button>
      </div>
      <div class="spacer"/>
      <div class="container--title">
        <inline-svg :src="require('../../../assets/svg/programme.svg')" class="title-icon"/>
        <h2 class="sub-title no-margin">Programmes</h2>
      </div>
      <div class="blocks_grid">
        <div v-for="(block, index) in this.$parent.programmes"
          :key="'block-' + index" class="block_container">
          <router-link class="block_container--link" :to="'/clientUser/block/' + block.id">
            <div class="block_container--link__info">
              <h3>{{block.name}}</h3>
              <div class="more-block-info">
                <p><b>Duration: </b>{{block.duration}}</p>
                <p><b>Start: </b>{{block.start}}</p>
              </div>
            </div>
            <div v-html="block.notes" class="block_container--link__block-notes" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    InlineSvg
  },
  data () {
    return {
      loading: true,
      viewWorkoutsStore: [],
      maxWorkoutIndexHome: null,
      currentWorkoutIndexHome: 0,
      config: {
        modules: {
          toolbar: [
            [{'header': 1}, {'header': 2}],
            ['bold', 'italic', 'underline', 'strike'],
            [{'script': 'sub'}, {'script': 'super'}]
          ]
        },
        placeholder: 'Type away...'
      }
    }
  },
  async mounted () {
    this.$parent.claims = await this.$auth.getUser()
    await this.$parent.get_programmes()
    await this.todaysWorkout()
    await this.initCountWorkoutsHome()
    this.loading = false
  },
  methods: {
    removeBrackets (dataIn) {
      if (dataIn !== null) {
        var dataOut = dataIn.replace(/[[\]]/g, '')
        return dataOut
      } else {
        return dataIn
      }
    },
    todaysWorkout () {
      this.$parent.programmes.forEach((block) => {
        block.workouts.forEach((workout) => {
          if (workout.date === this.isToday()) {
            this.viewWorkoutsStore.push(workout.id)
          }
        })
      })
    },
    isToday () {
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0')
      var yyyy = today.getFullYear()
      today = `${yyyy}-${mm}-${dd}`
      return today
    },
    initCountWorkoutsHome () {
      var count = this.viewWorkoutsStore.length - 1
      this.maxWorkoutIndexHome = count
    }
  }
}
</script>
