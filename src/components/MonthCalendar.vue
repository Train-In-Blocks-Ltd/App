<style scoped>
/* Container */
#month_calendar {
  background: var(--fore);
  border-radius: 10px;
  border: 3px solid var(--base);
  margin-top: 1rem
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
.calendar_header__bar * {
  transition: var(--transition_standard)
}
.calendar_header__bar *:hover {
  opacity: var(--light_opacity)
}
.next_month,
.prev_month {
  height: 36px;
  width: 36px
}
:is(.next_month, .prev_month):active {
  transform: scale(.8)
}
.day_cell.is_today {
  background-color: var(--calendar_highlight);
  border-radius: 10px
}
.today {
  cursor: pointer;
  margin: auto
}
.disabled, .today.disabled:hover {
  opacity: var(--light_opacity);
  cursor: default
}

/* Month */
.month_container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: .6rem;
  margin: 2rem
}
.days_label {
  text-align: center
}

/* Day */
.day_cell {
  text-align: right;
  min-height: 100px;
  background-color: var(--fore);
  border-radius: 10px;
  padding: .6rem;
  box-shadow: var(--low_shadow)
}
.holderCell {
  background-color: transparent
}

/* Event */
.event {
  overflow-wrap: anywhere;
  border: 2px solid transparent;
  border-radius: 3px;
  padding: .1rem;
  font-size: .7rem;
  text-align: center;
  margin: .4rem 0
}
.showBorder {
  border: 2px solid var(--base)
}

/* Responsive */
@media (max-width: 576px) {
  .calendar_header h3 {
    left: 1rem
  }
  .calendar_header__bar,
  .month_container {
    margin: 1rem
  }
}
</style>

<template>
  <div id="month_calendar">
    <div class="calendar_header">
      <h3>
        {{ currentMonth }} {{ currentYear }}
      </h3>
      <div class="calendar_header__bar">
        <inline-svg
          :src="require('../assets/svg/arrow-left.svg')"
          class="prev_month cursor no_fill"
          @click="monthDiff--, get_month()"
        />
        <p
          :class="{ disabled: monthDiff === 1 }"
          class="today"
          @click="monthDiff = 1, get_month()"
        >
          Today
        </p>
        <inline-svg
          :src="require('../assets/svg/arrow-right.svg')"
          class="next_month cursor no_fill"
          @click="monthDiff++, get_month()"
        />
      </div>
    </div>
    <div class="month_container">
      <p class="days_label grey">
        Mon
      </p>
      <p class="days_label grey">
        Tue
      </p>
      <p class="days_label grey">
        Wed
      </p>
      <p class="days_label grey">
        Thu
      </p>
      <p class="days_label grey">
        Fri
      </p>
      <p class="days_label grey">
        Sat
      </p>
      <p class="days_label grey">
        Sun
      </p>
      <div
        v-for="(day, index) in month"
        :key="`day_${index}`"
        :class="{ holderCell: day[1] === '', is_today: today() === day[2] }"
        class="day_cell"
      >
        <p class="grey">
          {{ day[1] }}
        </p>
        <p
          v-for="event in day[0]"
          :key="`event_${event.session_id}`"
          :style="{ backgroundColor: event.color, color: event.textColor }"
          :class="{ showBorder: event.color === undefined || event.color === '' || event.color === '#FFFFFF' }"
          class="event cursor fadeIn"
          @click="$parent.go_to_event(event.session_id, event.week_id)"
        >
          {{ event.title }}
        </p>
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
      currentMonth: '',
      currentYear: '',
      monthDiff: 1,
      month: []
    }
  },
  watch: {
    events () {
      this.get_month()
    },
    forceUpdate () {
      this.get_month()
    }
  },
  mounted () {
    this.get_month()
  },
  methods: {
    get_month_number (month) {
      const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return MONTHS.indexOf(month) + 1
    },
    get_month () {
      const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const TODAY = new Date()
      const LAST_DAY_OF_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth() + this.monthDiff, '0')
      this.month = []
      this.currentMonth = MONTHS[LAST_DAY_OF_MONTH.getMonth()]
      this.currentYear = LAST_DAY_OF_MONTH.getFullYear()
      const MONTH_END = LAST_DAY_OF_MONTH.getDate()
      let date
      for (date = 1; date <= MONTH_END; date++) {
        const WEEKDAY = new Date(`${this.currentYear}-${this.get_month_number(this.currentMonth).toLocaleString('en-US', { minimumIntegerDigits: 2 })}-${date.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`).getDay()
        if (date === 1 && WEEKDAY !== 1) {
          let holder
          if (WEEKDAY === 0) {
            for (holder = 1; holder < 7; holder++) {
              this.month.push([[], ''])
            }
          } else {
            for (holder = 1; holder < WEEKDAY; holder++) {
              this.month.push([[], ''])
            }
          }
        }
        const DATAPACKETS = []
        this.events.forEach((event) => {
          const DATE_SPLIT = event.date.split('-')
          if (parseInt(DATE_SPLIT[0]) === this.currentYear && parseInt(DATE_SPLIT[1] - 1) === LAST_DAY_OF_MONTH.getMonth() && parseInt(DATE_SPLIT[2]) === date) {
            DATAPACKETS.push(event)
          }
        })
        this.month.push([DATAPACKETS, date, `${this.currentYear}-${String(this.get_month_number(this.currentMonth)).padStart(2, '0')}-${String(date).padStart(2, '0')}`])
      }
    }
  }
}
</script>
