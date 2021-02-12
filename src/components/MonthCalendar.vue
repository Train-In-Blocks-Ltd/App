<style scoped>

  /* Calendar Nav */

  .calendar_header__bar {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0
  }
  .calendar_header__bar * {
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .calendar_header__bar *:hover {
    opacity: .6
  }
  .next_month {
    cursor: pointer;
    transform: rotate(-90deg)
  }
  .next_month:hover {
    transform: rotate(-90deg) translateY(5px)
  }
  .next_month:active {
    transform: rotate(-90deg) translateY(5px) scale(.9)
  }
  .prev_month {
    cursor: pointer;
    transform: rotate(90deg)
  }
  .prev_month:hover {
    transform: rotate(90deg) translateY(-5px)
  }
  .prev_month:active {
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

  /* Month */

  .month_container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: .6rem
  }

  /* Day */
  .day_cell {
    text-align: right;
    min-height: 100px;
    background-color: white;
    border-radius: 10px;
    padding: .6rem;
    transition: .6s all cubic-bezier(.165, .84, .44, 1)
  }
  .day_cell:hover {
    box-shadow: 0 0 20px 10px #28282808
  }

  /* Event */

  .event {
    border: 2px solid transparent;
    border-radius: 5px;
    font-size: .7rem;
    text-align: center;
    margin: .4rem 0
  }
  .cursor {
    cursor: pointer;
    transition: .6s all cubic-bezier(.165, .84, .44, 1)
  }
  .cursor:hover {
    opacity: .6
  }
  .showBorder {
    border: 2px solid #282828
  }
</style>

<template>
  <div id="month_calendar">
    <div class="calendar_header">
      <p class="text--large">
        {{ currentMonth }} {{ currentYear }}
      </p>
      <div class="calendar_header__bar">
        <inline-svg
          :src="require('../assets/svg/arrow.svg')"
          class="prev_month"
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
          :src="require('../assets/svg/arrow.svg')"
          class="next_month"
          @click="monthDiff++, get_month()"
        />
      </div>
    </div>
    <div class="month_container">
      <div
        v-for="(day, index) in month"
        :key="`day_${index}`"
        class="day_cell"
      >
        <p>{{ get_day(`${currentYear}-${get_month_number(currentMonth)}-${index + 1}`) }}<br><span class="grey">{{ index + 1 }}</span></p>
        <p
          v-for="event in day"
          :key="`event_${event.session_id}`"
          :style="{ backgroundColor: event.color, color: event.textColor }"
          :class="{ showBorder: event.color === undefined || event.color === '' || event.color === '#FFFFFF', cursor: isTrainer }"
          class="event"
          @click="isTrainer ? $parent.go_to_event(event.session_id, event.week_id) : null"
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
    forceUpdate () {
      this.get_month()
    }
  },
  created () {
    this.get_month()
  },
  methods: {
    get_day (date) {
      const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
      return days[new Date(date).getDay()]
    },
    get_month_number (month) {
      const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      console.log(monthArr.indexOf(month) + 1)
      return monthArr.indexOf(month) + 1
    },
    get_month () {
      const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const today = new Date()
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + this.monthDiff, '0')
      this.month = []
      this.currentMonth = monthArr[lastDayOfMonth.getMonth()]
      this.currentYear = lastDayOfMonth.getFullYear()
      const monthEnd = lastDayOfMonth.getDate()
      let date
      for (date = 1; date <= monthEnd; date++) {
        const datapack = []
        this.events.forEach((event) => {
          const dateSplit = event.date.split('-')
          if (parseInt(dateSplit[0]) === this.currentYear && parseInt(dateSplit[1] - 1) === lastDayOfMonth.getMonth() && parseInt(dateSplit[2]) === date) {
            datapack.push(event)
          }
        })
        this.month.push(datapack)
      }
    }
  }
}
</script>
