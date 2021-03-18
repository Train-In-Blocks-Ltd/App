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
    margin: 2rem 0;
    background-color: var(--fore);
    border-radius: 10px
  }
  .day_container {
    display: grid;
    grid-template-columns: .1fr 1fr;
    grid-gap: 4rem;
    padding: 2rem
  }
  .is_today {
    background-color: var(--calendar_highlight);
    box-shadow: var(--low_shadow);
    border-radius: 10px
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
  .showBorder {
    border: 3px solid var(--base)
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

  /* Day */
  .day_header {
    display: flex;
    justify-content: space-between
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
  }
</style>

<template>
  <div id="calendar_view">
    <div class="calendar_header">
      <h1>
        {{ get_month(thisWeek[0].date_split[1]) }} {{ thisWeek[0].date_split[0] }}
      </h1>
      <div class="calendar_header__bar">
        <inline-svg
          :src="require('../assets/svg/arrow.svg')"
          class="prev_week"
          @click="weekDiff--, get_week()"
        />
        <p
          :class="{ disabled: weekDiff === 0 }"
          class="today"
          @click="weekDiff = 0, get_week()"
        >
          Today
        </p>
        <inline-svg
          :src="require('../assets/svg/arrow.svg')"
          class="next_week"
          @click="weekDiff++, get_week()"
        />
      </div>
    </div>
    <div class="week_container">
      <div
        v-for="(day, index) in thisWeek"
        :key="'day-' + index"
        :class="{ is_today: day.date === today() }"
        class="day_container"
      >
        <div class="day_header">
          <h2>
            {{ get_day(index) }}
          </h2>
          <p class="text--small grey">
            {{ day.date_split[2] }}
          </p>
        </div>
        <div class="day_events">
          <div v-if="day.events.length === 0">
            <p class="grey">
              Rest day
            </p>
          </div>
          <div
            v-for="(event, indexed) in day.events"
            :key="'event-' + indexed"
            :style="{ backgroundColor: event.color }"
            :class="{ showBorder: event.color === undefined || event.color === '' || event.color === '#FFFFFF' }"
            class="day_events__event cursor"
            @click="$parent.go_to_event(event.session_id, event.week_id)"
          >
            <p :style="{ color: event.textColor }">
              {{ event.title }}
            </p>
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
      currentWeekStart: null,
      thisWeek: [],
      weekDiff: 0
    }
  },
  watch: {
    forceUpdate () {
      this.get_week()
    }
  },
  mounted () {
    this.get_week()
  },
  methods: {

    // EVENTS

    append_events () {
      this.thisWeek.forEach((day) => {
        this.events.forEach((event) => {
          if (day.date === event.date) {
            day.events.push(event)
          }
        })
      })
    },

    // WEEK

    get_day (date) {
      const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
      return days[date]
    },
    get_week () {
      this.thisWeek = []
      const d = new Date()
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      const weekStart = new Date(d.setDate(diff + 7 * this.weekDiff))
      const year = String(weekStart.getFullYear())
      const month = String(weekStart.getMonth() + 1).padStart(2, '0')
      const date = String(weekStart.getDate()).padStart(2, '0')
      const currentMonday = {
        date: `${year}-${month}-${date}`,
        date_split: [year, month, date],
        events: []
      }
      this.currentWeekStart = currentMonday
      this.thisWeek.push(currentMonday)
      for (let i = 1; i < 7; i++) {
        this.thisWeek.push({
          date: this.add_days(this.thisWeek[0].date, i),
          date_split: this.add_days(this.thisWeek[0].date, i).split('-'),
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
