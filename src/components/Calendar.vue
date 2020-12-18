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
    grid-gap: 1rem
  }
  .day_events {
    display: grid;
    grid-gap: 1rem
  }
  .day_events__event {
    cursor: pointer;
    padding: .6rem 1rem;
    border-radius: 3px;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .day_events__event.animated:hover {
    opacity: .6
  }
  .day_events__event.animated:active {
    transform: scale(.98)
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
    .day_events__event.animated:hover {
      opacity: 1
    }
    .day_events__event.animated:active {
      transform: scale(1)
    }
  }
</style>

<template>
  <div id="calendar_view">
    <div class="calendar_header">
      <p class="text--large">{{ get_month(this.this_week[0].date_split[1]) }} {{ this.this_week[0].date_split[0] }}</p>
      <div class="calendar_header__bar">
        <inline-svg
          @click="week_diff--, get_week()"
          :src="require('../assets/svg/arrow.svg')"
          class="prev_week"
        />
        <p
          @click="week_diff = 0, get_week()"
          :class="{ disabled: week_diff === 0 }"
          class="today"
        >
          Today
        </p>
        <inline-svg
          @click="week_diff++, get_week()"
          :src="require('../assets/svg/arrow.svg')"
          class="next_week"
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
          <p class="text--small">{{ day.date_split[2] }}</p>
        </div>
        <div class="day_events">
          <div v-if="day.events.length === 0">
            <p class="grey">Rest day</p>
          </div>
          <div
            v-for="event in day.events"
            :key="'event-' + event.id"
            v-show="isTrainer"
            :style="{ backgroundColor: event.color }"
            @click="scrollTo(event.id, event.week)"
            class="day_events__event animated"
          >
            <p :style="{ color: event.textColor }">{{ event.title }}</p>
          </div>
          <div
            v-for="event in day.events"
            :key="'event-client-' + event.id"
            v-show="!isTrainer"
            :style="{ backgroundColor: event.color }"
            class="day_events__event"
          >
            <p :style="{ color: event.textColor }">{{ event.title }}</p>
          </div>
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
    props: {
      events: Array,
      isTrainer: Boolean
    },
    data () {
      return {
        current_week_start: null,
        this_week: [],
        week_diff: 0
      }
    },
    created () {
      this.get_week()
    },
    methods: {

      // EVENTS
      scrollTo (id, week) {
        this.$parent.currentWeek = week
        this.$parent.expandAll('Expand')
        setTimeout(() => {
          let target = document.getElementById('session-' + id).offsetTop
          window.scrollTo(0, target - 200)
        }, 200)
      },
      append_events () {
        this.this_week.forEach(day => {
          this.events.forEach(event => {
            if (day.date === event.date) {
              day.events.push(event)
            }
          })
        })
      },

      // WEEK

      get_week () {
        this.this_week = []
        let d = new Date(new Date())
        const day = d.getDay()
        let diff = d.getDate() - day + (day === 0 ? -6 : 1)
        let weekStart = new Date(d.setDate(diff + 7 * this.week_diff))
        let year = String(weekStart.getFullYear())
        let month = String(weekStart.getMonth() + 1).padStart(2, '0')
        let date = String(weekStart.getDate()).padStart(2, '0')
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
        this.append_events()
      },
      add_days (date, days) {
        var d = new Date(date)
        d.setDate(d.getDate() + days)
        var year = d.getFullYear()
        var month = String(d.getMonth() + 1).padStart(2, '0')
        var dayDate = String(d.getDate()).padStart(2, '0')
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