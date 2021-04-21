<style scoped>
/* Header section */
.stats_top_section {
  display: flex;
  justify-content: space-between
}

/* Graph */
.visualise {
  position: fixed;
  padding: 4rem 10vw 10rem calc(2rem + 38px + 10vw);
  top: 0;
  left: 0;
  z-index: 12;
  height: 100%;
  width: 100%;
  overflow-y: auto
}
.container--content {
  display: flex;
  flex-direction: column
}
.data-options {
  display: flex
}
.data-select {
  display: grid;
  margin-right: 6rem
}
.data-select__options {
  display: grid;
  grid-gap: 1rem;
  width: fit-content
}
.data-desc {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%
}
.data-desc__value {
  margin: .4rem 0 2rem 0;
  font-size: 2.4rem
}

/* Protocol error table */
.protocol_error {
  display: grid;
  grid-gap: 1rem;
  margin-top: 4rem
}
.protocol_error table :is(th, td) {
  padding: .6rem 0
}
.protocol_error table th {
  text-align: left;
  border-bottom: 1px solid rgb(184, 0, 0)
}
.protocol_error table td {
  overflow-wrap: anywhere
}

/* Responsive */
@media (max-width: 992px) {
  .data-options {
    display: grid;
    grid-gap: 4rem
  }
  .data-select {
    margin-right: 0
  }
}
@media (max-width: 768px) {
  .visualise {
    padding: 2rem 5vw 4rem 5vw
  }
}
</style>

<template>
  <div id="statistics">
    <div :class="{ opened_sections: show }" class="section_overlay" />
    <div v-if="show" class="visualise fadeIn delay fill_mode_both">
      <div class="stats_top_section">
        <h2 class="bottom_margin">
          Statistics
        </h2>
        <inline-svg
          class="icon--options"
          :src="require('../assets/svg/close.svg')"
          aria-label="Close"
          @click="$parent.isStatsOpen = false, will_body_scroll(true)"
        />
      </div>
      <div class="container--content">
        <div class="data-options">
          <div class="data-select">
            <div class="data-select__options">
              <label for="measure">
                Measurement:<br>
                <select
                  v-model="selectedDataName"
                  class="small_border_radius width_300 text--small"
                  name="measure"
                  @change="scan()"
                >
                  <option value="Plan Overview">
                    Plan Overview
                  </option>
                  <option
                    v-for="(optionName, optionIndex) in optionsForDataName"
                    :key="`data_option_${optionIndex}`"
                    :value="optionName"
                  >
                    {{ optionName }}
                  </option>
                </select>
              </label>
            </div>
            <div v-if="showDataTypeSelector" class="data-select__options">
              <label for="measure-type">
                Data type:<br>
                <select
                  id="data_type_selector"
                  v-model="selectedDataType"
                  class="small_border_radius width_300 text--small"
                  name="measure-type"
                  @change="scan()"
                >
                  <option value="Sets">
                    Sets
                  </option>
                  <option value="Reps">
                    Reps
                  </option>
                  <option
                    v-if="selectedDataName === 'Plan Overview' || showLoadsVolumeOptions"
                    value="Load"
                  >
                    Load
                  </option>
                  <option
                    v-if="selectedDataName === 'Plan Overview' || showLoadsVolumeOptions"
                    value="Volume"
                  >
                    Volume
                  </option>
                </select>
              </label>
            </div>
            <div class="data-select__options">
              <label for="chart-type">
                Chart type:<br>
                <select
                  id="data_type_selector"
                  v-model="selectedChartType"
                  class="small_border_radius width_300 text--small"
                  name="chart-type"
                  @change="scan()"
                >
                  <option value="line">
                    Line
                  </option>
                  <option value="scatter">
                    Scatter
                  </option>
                </select>
              </label>
            </div>
          </div>
          <div
            v-if="showDataTypeSelector && !dataToVisualise.includes(null)"
            class="data-desc"
          >
            <div
              v-for="(desc, descIndex) in descData"
              :key="`desc_option_${descIndex}`"
              class="container--data-desc"
            >
              <p class="data-desc__desc">
                <b>{{ desc[0] }} {{ selectedDataType }}</b>
              </p>
              <p class="data-desc__value">
                {{ desc[1] }}
              </p>
            </div>
          </div>
        </div>
        <div v-show="protocolErrors.length !== 0" class="protocol_error">
          <p class="text--red">
            ERROR: Please check that the following exercises and measurements are using the correct format.
          </p>
          <table>
            <tr class="text--red">
              <th>Session</th>
              <th>Date</th>
              <th>Exercise</th>
              <th>Protocol</th>
            </tr>
            <tr
              v-for="(error, errorIndex) in protocolErrors"
              :key="`protocol_error_${errorIndex}`"
              class="text--red"
            >
              <td>{{ error.sessionName }}</td>
              <td>{{ error.sessionDate }}</td>
              <td>{{ error.exerciseName }}</td>
              <td>{{ error.protocol }}</td>
            </tr>
          </table>
        </div><br>
        <simple-chart
          v-if="!dataToVisualise.includes(null) && dataToVisualise !== []"
          :data-points="dataToVisualise"
          :labels="labelsToVisualise"
          :dates="dateDaysToVisualise"
          :chart-type="selectedChartType"
          :reset="resetGraph"
          aria-label="Graph"
          class="fadeIn"
        />
      </div>
    </div>
  </div>
</template>

<script>
const SimpleChart = () => import(/* webpackChunkName: "components.simplechart", webpackPrefetch: true */ './SimpleChart')

export default {
  components: {
    SimpleChart
  },
  props: {
    plan: Object,
    show: Boolean
  },
  data () {
    return {
      descData: [],
      showLoadsVolumeOptions: false,
      selectedDataName: 'Plan Overview',
      optionsForDataName: new Set(),
      selectedDataType: 'Sets',
      showDataTypeSelector: true,
      selectedChartType: 'line',
      resetGraph: 0,
      dataToVisualise: [],
      labelsToVisualise: [],
      dateDaysToVisualise: [],
      sessionDataPackets: [],
      protocolErrors: []
    }
  },
  watch: {
    plan () {
      this.scan()
    }
  },
  created () {
    this.scan()
  },
  methods: {
    scan () {
      this.sessionDataPackets = []
      this.maxWeek = this.plan.duration
      if (this.plan.sessions && !this.noSessions) {
        this.sort_sessions(this.plan).sessions.forEach((object) => {
          if (object.notes !== null) {
            this.sessionDataPackets.push(this.pull_protocols(object.name, object.notes, object.date))
          }
        })

        // Appends the options to the select
        if (this.sessionDataPackets !== null) {
          this.optionsForDataName = new Set()
          for (const SESSION of this.sessionDataPackets) {
            for (const DATA_PACKET of SESSION) {
              const CASED_ITEM = this.proper_case(DATA_PACKET[1])
              this.optionsForDataName.add(DATA_PACKET[2].includes('at') ? CASED_ITEM : DATA_PACKET[1])
            }
          }
          this.selection()
        }
      }
      this.forceUpdate += 1
      this.$parent.check_for_week_sessions()
    },
    selection () {
      class DataPoint {
        constructor (dataPacket, returnDataType) {
          this.sessionName = dataPacket[0]
          this.sessionDate = dataPacket[3]
          this.exerciseName = dataPacket[1]
          this.protocol = dataPacket[2].replace(/\s/g, '')
          this.returnDataType = returnDataType
          this.regexSetsReps = /(\d*)x((\d*\/*)*)/gi
          this.regexLoad = /at\s*((\d\.*\/*)*)\s*\w*/gi
          this.regeGetNumber = /[0-9.]+/gi
        }

        get calculate () {
          switch (this.returnDataType) {
            case 'Sets':
              return this.getSets()
            case 'Reps':
              return this.getReps()
            case 'Load':
              return this.getLoad()
            case 'Volume':
              return this.getReps() * this.getLoad()
            case 'Other':
              return this.getOtherMeasure()
          }
        }

        getSets () {
          let returnValue
          let finder
          while ((finder = this.regexSetsReps.exec(this.protocol)) !== null) {
            if (finder.index === this.regexSetsReps.lastIndex) {
              this.regexSetsReps.lastIndex++
            }
            finder.forEach((setsMatch, setsIndex) => {
              if (setsIndex === 1) {
                returnValue = parseFloat(setsMatch)
              }
            })
          }
          return returnValue
        }

        getReps () {
          const NUM_OF_SETS = this.getSets()
          let returnValue = 0
          let repsFinder
          while ((repsFinder = this.regexSetsReps.exec(this.protocol)) !== null) {
            if (repsFinder.index === this.regexSetsReps.lastIndex) {
              this.regexSetsReps.lastIndex++
            }
            repsFinder.forEach((repsMatch, repsIndex) => {
              if (repsIndex === 2) {
                if (repsMatch.includes('/')) {
                  returnValue = repsMatch.split('/').reduce((a, b) => parseFloat(a) + parseFloat(b))
                } else {
                  returnValue = parseFloat(repsMatch) * NUM_OF_SETS
                }
              }
            })
          }
          return returnValue
        }

        getLoad () {
          const NUM_OF_SETS = this.getSets()
          let returnValue = 0
          let loadFinder
          while ((loadFinder = this.regexLoad.exec(this.protocol)) !== null) {
            if (loadFinder.index === this.regexLoad.lastIndex) {
              this.regexLoad.lastIndex++
            }
            loadFinder.forEach((loadMatch, loadIndex) => {
              if (loadIndex === 1) {
                if (loadMatch.includes('/')) {
                  returnValue = loadMatch.split('/').reduce((a, b) => parseFloat(a) + parseFloat(b))
                } else {
                  returnValue = parseFloat(loadMatch) * NUM_OF_SETS
                }
              }
            })
          }
          return returnValue
        }

        getOtherMeasure () {
          let returnValue
          let numberFinder
          while ((numberFinder = this.regeGetNumber.exec(this.protocol)) !== null) {
            if (numberFinder.index === this.regeGetNumber.lastIndex) {
              this.regeGetNumber.lastIndex++
            }
            numberFinder.forEach((numberMatch) => {
              returnValue = parseFloat(numberMatch)
            })
          }
          return returnValue
        }
      }
      this.dataToVisualise = []
      this.labelsToVisualise = []
      this.dateDaysToVisualise = []
      this.protocolErrors = []
      let extractedSessionProtocols = []
      this.sessionDataPackets.forEach((sessionDataPacket, sessionDataPacketIndex) => {
        extractedSessionProtocols = []
        const NEXT_SESSION = this.sessionDataPackets[sessionDataPacketIndex + 1] || false
        const daysToNextSession = () => {
          const REFERENCE_DATE = new Date(sessionDataPacket[0][3])
          const TARGET_DATE = NEXT_SESSION !== false ? new Date(this.sessionDataPackets[sessionDataPacketIndex + 1][0][3]) : false
          return TARGET_DATE !== false ? (TARGET_DATE.getTime() - REFERENCE_DATE.getTime()) / (1000 * 3600 * 24) : false
        }
        this.dateDaysToVisualise.push(daysToNextSession())
        sessionDataPacket.forEach((exerciseDataPacket) => {
          const EXERCISE_NAME = this.selectedDataName.replace(/\(/g, '\\(').replace(/\)/g, '\\)')
          const REGEX = RegExp(EXERCISE_NAME, 'gi')
          if (REGEX.test(exerciseDataPacket[1])) {
            this.labelsToVisualise.push([exerciseDataPacket[0], exerciseDataPacket[3]])
            this.showDataTypeSelector = exerciseDataPacket[2].includes('x')
            this.showLoadsVolumeOptions = exerciseDataPacket[2].includes('at')
            this.selectedDataType = !this.showLoadsVolumeOptions && (this.selectedDataType === 'Load' || this.selectedDataType === 'Volume') ? 'Sets' : this.selectedDataType
            const DATA_POINT = new DataPoint(exerciseDataPacket, exerciseDataPacket[2].includes('x') ? this.selectedDataType : 'Other')
            if (isNaN(DATA_POINT.calculate)) {
              this.protocolErrors.push({
                sessionName: exerciseDataPacket[0],
                sessionDate: exerciseDataPacket[3],
                exerciseName: exerciseDataPacket[1],
                protocol: exerciseDataPacket[2]
              })
            } else {
              this.dataToVisualise.push(DATA_POINT.calculate)
            }
          } else if (this.selectedDataName === 'Plan Overview' && exerciseDataPacket[2].includes('at')) {
            this.showDataTypeSelector = true
            const DATA_POINT = new DataPoint(exerciseDataPacket, this.selectedDataType)
            extractedSessionProtocols.push(DATA_POINT.calculate)
          }
        })

        // Sums for Plan Overview
        if (extractedSessionProtocols.length !== 0) {
          this.dataToVisualise.push(extractedSessionProtocols.reduce((a, b) => a + b))
        }

        // Populates descriptive stats
        if (this.dataToVisualise.length !== 0) {
          const SUM = this.dataToVisualise.reduce((a, b) => a + b)
          const MAX = Math.max(...this.dataToVisualise)
          const MIN = Math.min(...this.dataToVisualise)
          this.descData = [
            ['Total', SUM],
            ['Average', (SUM / this.dataToVisualise.length).toFixed(1)],
            ['Maximum', MAX],
            ['Minimum', MIN],
            ['Percentage Change', (((MAX / MIN) - 1) * 100).toFixed(1)]
          ]
        }
      })
      if (this.selectedDataName === 'Plan Overview') {
        for (let x = 1; x <= this.dataToVisualise.length; x++) {
          this.labelsToVisualise.push(['Session ' + x])
        }
      }
      this.resetGraph += 1
    }
  }
}
</script>
