<style scoped>
/* Containers */
#calendar_view {
  border-radius: 10px;
  border: 3px solid var(--base);
  margin-top: 1rem
}
.calendar_header {
  display: flex;
  justify-content: space-between;
  flex-direction: column
}
.calendar_header h3 {
  position: relative;
  top: 0;
  left: 2rem;
  padding: .6rem;
  background: var(--base);
  color: var(--fore);
  width: fit-content;
  border-radius: 0 0 10px 10px
}
.calendar_header__bar {
  display: flex;
  justify-content: space-between;
  margin: 2rem
}
.week_container {
  display: grid;
  grid-gap: 2rem;
  margin: 1rem;
  border-radius: 10px
}
.day_container {
  display: grid;
  grid-template-columns: .1fr 1fr;
  grid-gap: 4rem;
  padding: 1rem
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
  border: 3px solid transparent;
  overflow-wrap: anywhere
}
.showBorder {
  border: 3px solid var(--base)
}

/* Header bar */
.calendar_header__bar * {
  transition: var(--transition_standard)
}
.calendar_header__bar *:hover {
  opacity: var(--light_opacity)
}
.next_week,
.prev_week {
  height: 36px;
  width: 36px
}
:is(.next_week, .prev_week):active {
  transform: scale(.8)
}
.today {
  cursor: pointer;
  margin: auto
}
.disabled, .today.disabled:hover {
  opacity: var(--light_opacity);
  cursor: default
}

/* Day */
.day_header {
  display: flex;
  justify-content: space-between
}
.day_header .text--small {
  margin-left: .4rem
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
@media (max-width: 576px) {
  .day_container {
    padding: 1rem
  }
  .calendar_header h3 {
    left: 1rem
  }
  .calendar_header__bar,
  .week_container {
    margin: 1rem
  }
}
</style>

<template>
  <div id="calendar_view">
    <div class="calendar_header">
      <h3>
        {{ get_month(thisWeek[0].date_split[1]) }} {{ thisWeek[0].date_split[0] }}
      </h3>
      <div class="calendar_header__bar">
        <inline-svg
          :src="require('../assets/svg/arrow-left.svg')"
          class="prev_week cursor no_fill"
          @click="weekDiff--, getWeek()"
        />
        <p
          :class="{ disabled: weekDiff === 0 }"
          class="today"
          @click="weekDiff = 0, getWeek()"
        >
          Today
        </p>
        <inline-svg
          :src="require('../assets/svg/arrow-right.svg')"
          class="next_week cursor no_fill"
          @click="weekDiff++, getWeek()"
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
          <h3>
            {{ get_day(index) }}
          </h3>
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
            class="day_events__event cursor fadeIn"
            @click="$parent.goToEvent(event.session_id, event.week_id)"
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
    forceUpdate: Number
  },
  data () {
    return {
      currentWeekStart: null,
      thisWeek: [],
      weekDiff: 0
    }
  },
  watch: {
    events () {
      this.getWeek()
    },
    forceUpdate () {
      this.getWeek()
    }
  },
  created () {
    this.getWeek()
  },
  methods: {

    // EVENTS

    appendEvents () {
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
      const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
      return DAYS[date]
    },
    getWeek () {
      this.thisWeek = []
      const DATE_CLASS = new Date()
      const DAY = DATE_CLASS.getDay()
      const DAYS_DIFFERENCE = DATE_CLASS.getDate() - DAY + (DAY === 0 ? -6 : 1)
      const WEEK_START = new Date(DATE_CLASS.setDate(DAYS_DIFFERENCE + 7 * this.weekDiff))
      const YEAR = String(WEEK_START.getFullYear())
      const MONTH = String(WEEK_START.getMonth() + 1).padStart(2, '0')
      const DATE = String(WEEK_START.getDate()).padStart(2, '0')
      const CURRENT_MONDAY = {
        date: `${YEAR}-${MONTH}-${DATE}`,
        date_split: [YEAR, MONTH, DATE],
        events: []
      }
      this.currentWeekStart = CURRENT_MONDAY
      this.thisWeek.push(CURRENT_MONDAY)
      for (let i = 1; i < 7; i++) {
        this.thisWeek.push({
          date: this.addDays(this.thisWeek[0].date, i),
          date_split: this.addDays(this.thisWeek[0].date, i).split('-'),
          events: []
        })
      }
      setTimeout(() => {
        this.appendEvents()
      }, 100)
    },
    addDays (date, days) {
      const DATE_CLASS = new Date(date)
      DATE_CLASS.setDate(DATE_CLASS.getDate() + days)
      const YEAR = DATE_CLASS.getFullYear()
      const MONTH = String(DATE_CLASS.getMonth() + 1).padStart(2, '0')
      const DATE = String(DATE_CLASS.getDate()).padStart(2, '0')
      return `${YEAR}-${MONTH}-${DATE}`
    },
    get_month (month) {
      const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      month = parseInt(month) - 1
      return MONTHS[month]
    }
  }
}
</script>
