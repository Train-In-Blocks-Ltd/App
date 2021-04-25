<style scoped>
.progression_editor,
.exercise_group {
  display: grid;
  grid-gap: 1rem
}
.exercise_group:not(:last-child) {
  margin-bottom: 2rem
}
.progression_bottom_bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem
}

/* Responsiveness */
@media (max-width: 768px) {
  .progression_bottom_bar {
    grid-template-columns: 1fr
  }
}
</style>

<template>
  <div>
    <form
      v-if="progressPage === 0"
      @submit.prevent="progress_pull(), progressSection = 0, progressPage += 1"
    >
      <h3>
        Copy across to different microcycles
      </h3>
      <p class="grey">
        Progress each session in just a few clicks
      </p>
      <div class="input_section">
        <label for="range">
          From {{ currentWeek }} to:
        </label>
        <input
          id="range"
          ref="range"
          v-model="progressTarget"
          class="width_300"
          name="range"
          type="number"
          :min="currentWeek + 1"
          :max="maxWeek"
          required
        >
      </div>
      <div class="input_section">
        <label for="range">
          Days until next sessions:
        </label>
        <input
          v-model="daysBetweenEachSession"
          class="width_300"
          name="range"
          type="number"
          min="1"
          required
        >
      </div>
      <button
        type="button"
        class="red_button"
        @click.prevent="$parent.showProgress = false, will_body_scroll(true)"
      >
        Cancel
      </button>
      <button type="submit">
        Next
      </button>
    </form>
    <div v-else-if=" progressPage === 1">
      <form
        v-for="(session, sessionIndex) in progressDataInputs"
        v-show="progressSection === sessionIndex"
        :key="`session_${sessionIndex}`"
        class="progression_editor"
        @submit.prevent="sessionIndex === progressDataInputs.length - 1 ? progressPage += 1 : progressSection += 1"
      >
        <div>
          <h3>
            {{ session.sessionName }}
          </h3>
          <p class="grey">
            {{ session.sessionDate }}
          </p>
        </div>
        <div
          v-for="(exercise, exerciseIndex) in session.sessionExercises"
          :key="`exercise_${sessionIndex}_${exerciseIndex}`"
          class="exercise_group"
        >
          <p class="exercise_name">
            <b>{{ exercise.exerciseName }}</b><br>Week {{ currentWeek }}: {{ exercise.exerciseProtocol }}
          </p>
          <div
            v-for="(progression, progressionIndex) in exercise.progression"
            :key="`exercise_${sessionIndex}_${exerciseIndex}_${progressionIndex}`"
          >
            <p>
              Week {{ currentWeek + progressionIndex + 1 }}:
            </p>
            <input
              v-model="exercise.progression[progressionIndex]"
              :aria-label="`${exercise.exerciseName}_${progressionIndex}`"
              type="text"
              required
            >
          </div>
          <hr v-if="exerciseIndex !== session.sessionExercises.length - 1">
        </div>
        <div class="progression_bottom_bar">
          <button
            class="red_button"
            type="button"
            @click.prevent="sessionIndex === 0 ? progressPage -= 1 : progressSection -= 1"
          >
            Back
          </button>
          <button type="submit">
            Next
          </button>
        </div>
      </form>
    </div>
    <form
      v-else-if="progressPage === 2"
      @submit.prevent="progress_complete(), $parent.showProgress = false, will_body_scroll(true)"
    >
      <h3>
        You're all set
      </h3>
      <p class="grey">
        Are you ready to progress the {{ sessionsToProgress.length > 1 ? 'sessions' : 'session' }}
      </p><br>
      <button
        class="red_button"
        type="button"
        @click.prevent="progressPage -= 1"
      >
        Back
      </button>
      <button type="submit">
        Progress
      </button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    planData: Object,
    sessionsToProgress: Array,
    currentWeek: Number,
    maxWeek: Number
  },
  data () {
    return {
      // User inputs
      progressTarget: this.maxWeek,
      daysBetweenEachSession: 7,

      // Navigation
      progressPage: 0,
      progressSection: 0,

      // Processing
      sessionDataset: [],
      simpleProgress: true,
      progressDataInputs: []
    }
  },
  created () {
    this.simpleProgress = true
    this.planData.sessions.forEach((session) => {
      if (this.sessionsToProgress.includes(session.id)) {
        if (this.pull_protocols(session.name, session.notes === null ? '' : session.notes, session.date).length !== 0) {
          this.simpleProgress = false
        }
      }
    })
  },
  methods: {
    progress_pull () {
      this.progressDataInputs = []
      this.sessionsToProgress.forEach((sessionId, sessionIdx) => {
        const SESSION = this.planData.sessions.find(session => session.id === sessionId)
        this.progressDataInputs.push({
          sessionId: SESSION.id,
          sessionName: SESSION.name,
          sessionDate: SESSION.date,
          sessionExercises: this.pull_protocols(SESSION.name, SESSION.notes, SESSION.date)
        })
        this.progressDataInputs[sessionIdx].sessionExercises.forEach((exercise) => {
          exercise.progression = new Array(this.progressTarget - this.currentWeek).fill(exercise.exerciseProtocol)
        })
      })
    },
    progress_process (sessionId, sessionNotes, loc) {
      this.progressDataInputs.forEach((session) => {
        let n = 0
        if (session.sessionId === sessionId) {
          session.sessionExercises.forEach((exercise, exericseIdx) => {
            const REGEX = new RegExp(`${exercise.exerciseName.replace('(', '\\(').replace(')', '\\)')}\\s*:\\s*${exercise.exerciseProtocol}`, 'g')
            sessionNotes = sessionNotes.replace(REGEX, (match) => {
              return n === exericseIdx ? `${exercise.exerciseName}: ${exercise.progression[loc - 1]}` : match
            })
            n++
          })
        }
      })
      return sessionNotes
    },
    progress_complete () {
      const PROGRESS_SESSIONS = []
      this.sessionsToProgress.forEach((sessionId) => {
        PROGRESS_SESSIONS.push(this.planData.sessions.find(session => session.id === sessionId))
      })
      const START_WEEK = this.currentWeek
      for (let weekCount = this.currentWeek + 1; weekCount <= this.progressTarget; weekCount++) {
        PROGRESS_SESSIONS.forEach((session) => {
          this.$parent.add_session({
            programmeId: parseInt(this.$route.params.id),
            sessionName: session.name,
            sessionDate: this.add_days(session.date, this.daysBetweenEachSession * (weekCount - START_WEEK)),
            sessionNotes: this.simpleProgress ? session.notes : this.progress_process(session.id, session.notes, weekCount - START_WEEK),
            sessionWeek: weekCount
          }, true)
        })
      }
      this.$parent.update_plan()
      this.$parent.deselect_all()
      this.$ga.event('Session', 'progress')
      this.$parent.$parent.$parent.end_loading()
    }
  }
}
</script>
