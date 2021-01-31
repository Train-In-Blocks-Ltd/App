<style scoped>
  /* Containers */
  .calendar_header {
    display: flex;
    justify-content: space-between;
    flex-direction: column
  }
  .calendar_header__bar {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0
  }
  .week_container {
    display: grid;
    grid-gap: 2rem;
    margin: 2rem 0
  }
  .day_container {
    display: grid;
    grid-template-columns: .1fr 1fr;
    grid-gap: 1rem;
    min-height: 50px
  }
  .day_events {
    display: grid;
    grid-gap: 1rem
  }
  .day_events__event {
    padding: .6rem 1rem;
    border-radius: 8px;
    border: 3px solid transparent
  }
  .cursor {
    cursor: pointer;
    transition: .6s all cubic-bezier(.165, .84, .44, 1)
  }
  .cursor:hover {
    opacity: .6
  }
  .showBorder {
    border: 3px solid #282828
  }

  /* Header bar */
  .calendar_header__bar * {
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .calendar_header__bar *:hover {
    opacity: .6
  }
  .next_week {
    cursor: pointer;
    transform: rotate(-90deg)
  }
  .next_week:hover {
    transform: rotate(-90deg) translateY(5px)
  }
  .next_week:active {
    transform: rotate(-90deg) translateY(5px) scale(.9)
  }
  .prev_week {
    cursor: pointer;
    transform: rotate(90deg)
  }
  .prev_week:hover {
    transform: rotate(90deg) translateY(-5px)
  }
  .prev_week:active {
    transform: rotate(90deg) translateY(-5px) scale(.9)
  }
  .today {
    cursor: pointer;
    margin: auto
  }
  .disabled, .today.disabled:hover {
    opacity: .6;
    cursor: default
  }

  /* Responsive */
  @media (max-width: 992px) {
    .calendar_header__bar *:hover {
      opacity: 1
    }
    .next_week:hover {
      transform: rotate(-90deg) translateY(0)
    }
    .next_week:active {
      transform: rotate(-90deg) translateY(0) scale(.9)
    }
    .prev_week:hover {
      transform: rotate(90deg) translateY(0)
    }
    .prev_week:active {
      transform: rotate(90deg) translateY(0) scale(.9)
    }
    .cursor:hover {
      opacity: 1
    }
  }
</style>

<template>
  <div id="calendar_view">
    <div class="calendar_header">
      <p class="text--large">
        {{ get_month(this_week[0].date_split[1]) }} {{ this_week[0].date_split[0] }}
      </p>
      <div class="calendar_header__bar">
        <inline-svg
          :src="require('../assets/svg/arrow.svg')"
          class="prev_week"
          @click="week_diff--, get_week()"
        />
        <p
          :class="{ disabled: week_diff === 0 }"
          class="today"
          @click="week_diff = 0, get_week()"
        >
          Today
        </p>
        <inline-svg
          :src="require('../assets/svg/arrow.svg')"
          class="next_week"
          @click="week_diff++, get_week()"
        />
      </div>
    </div>
    <div class="week_container">
      <div
        v-for="(day, index) in this_week"
        :key="'day-' + index"
        class="day_container"
      >
        <div class="day_header">
          <p class="text--small">
            {{ day.date_split[2] }}
          </p>
        </div>
        <div class="day_events">
          <div v-if="day.events.length === 0">
            <p class="grey">
              Rest day
            </p>
          </div>
          <div v-if="isTrainer">
            <div
              v-for="(event, indexed) in day.events"
              :key="'event-' + indexed"
              :style="{ backgroundColor: event.color }"
              :class="{ showBorder: event.color === null || event.color === '' || event.color === '#ffffff' }"
              @click="$parent.go_to_event(event.session_id, event.week_id)"
              class="day_events__event cursor"
            >
              <p :style="{ color: event.textColor }">
                {{ event.title }}
              </p>
            </div>
          </div>
          <div v-else>
            <div
              v-for="(event, indexed) in day.events"
              :key="'event-' + indexed"
              :style="{ backgroundColor: event.color }"
              :class="{ showBorder: event.color === null || event.color === '' || event.color === '#ffffff' }"
              class="day_events__event"
            >
              <p :style="{ color: event.textColor }">
                {{ event.title }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    events: Array,
    forceUpdate: Number,
    isTrainer: Boolean
  },
  data () {
    return {
      current_week_start: null,
      this_week: [],
      week_diff: 0
    }
  },
  watch: {
    forceUpdate () {
      this.get_week()
    }
  },
  created () {
    this.get_week()
  },
  methods: {

    // EVENTS

    append_events () {
      this.this_week.forEach((day) => {
        this.events.forEach((event) => {
          if (day.date === event.date) {
            day.events.push(event)
          }
        })
      })
    },

    // WEEK

    get_week () {
      this.this_week = []
      const d = new Date(new Date())
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      const weekStart = new Date(d.setDate(diff + 7 * this.week_diff))
      const year = String(weekStart.getFullYear())
      const month = String(weekStart.getMonth() + 1).padStart(2, '0')
      const date = String(weekStart.getDate()).padStart(2, '0')
      const currentMonday = {
        date: `${year}-${month}-${date}`,
        date_split: [year, month, date],
        events: []
      }
      this.current_week_start = currentMonday
      this.this_week.push(currentMonday)
      for (let i = 1; i < 7; i++) {
        this.this_week.push({
          date: this.add_days(this.this_week[0].date, i),
          date_split: this.add_days(this.this_week[0].date, i).split('-'),
          events: []
        })
      }
      setTimeout(() => {
        this.append_events()
      }, 100)
    },
    add_days (date, days) {
      const d = new Date(date)
      d.setDate(d.getDate() + days)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const dayDate = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${dayDate}`
    },
    get_month (month) {
      const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      month = parseInt(month) - 1
      return monthArr[month]
    }
  }
}
</script>
