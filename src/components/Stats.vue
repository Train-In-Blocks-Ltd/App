<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
.visualise {
  position: fixed;
  padding: 4rem 10vw 10rem calc(2rem + 38px + 10vw);
  top: 0;
  left: 0;
  z-index: 12;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  .stats_top_section {
    display: flex;
    justify-content: space-between
  }
  .container--content {
    display: flex;
    flex-direction: column;
    .data-options {
      display: flex;
      .data-select {
        padding: 1rem;
        background-color: $fore;
        border: 3px solid $base;
        border-radius: 10px;
        margin-right: 4rem;
        .data-select__options {
          display: grid;
          &:not(:last-child) {
            margin-bottom: 1rem
          }
          label {
            font-weight: bold
          }
          select {
            margin: .6rem 0
          }
        }
      }
      .data-desc {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
        padding: 1rem;
        background-color: $fore;
        border: 3px solid $base;
        border-radius: 10px;
        width: 100%;
        .data-desc__value {
          margin: .4rem 0 2rem 0;
          font-size: 2.4rem
        }
      }
    }

    /* Protocol error table */
    .protocol_error {
      display: grid;
      grid-gap: 1rem;
      margin-top: 4rem;
      background-color: $fore;
      padding: 1rem;
      border: 3px solid $base;
      border-radius: 10px;
      table {
        :is(th, td) {
          padding: .6rem 0
        }
        th {
          text-align: left;
          border-bottom: 1px solid $base_red
        }
        td {
          overflow-wrap: anywhere
        }
      }
    }

    /* Placeholder on empty */
    .graph_placeholder {
      padding: 1rem;
      border: 3px solid $base;
      border-radius: 10px;
      background-color: $fore;
      margin-top: 2rem
    }
  }
}

@media (max-width: 992px) {
  .visualise .container--content .data-options {
    display: grid;
    grid-gap: 4rem;
    .data-select {
      margin-right: 0;
      .data-select__options {
        display: grid
      }
    }
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
          class="icon--options cursor"
          :src="require('../assets/svg/close.svg')"
          aria-label="Close"
          @click="$parent.isStatsOpen = false, willBodyScroll(true)"
        />
      </div>
      <div class="container--content">
        <div class="data-options">
          <div class="data-select">
            <div class="data-select__options">
              <label for="measure">
                Measurement
              </label>
              <select
                v-model="selectedDataName"
                class="small_border_radius width_300"
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
            </div>
            <div v-if="showDataTypeSelector" class="data-select__options">
              <label for="measure-type">
                Data type
              </label>
              <select
                id="data_type_selector"
                v-model="selectedDataType"
                class="small_border_radius width_300"
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
            </div>
            <div class="data-select__options">
              <label for="chart-type">
                Chart type
              </label>
              <select
                id="data_type_selector"
                v-model="selectedChartType"
                class="small_border_radius width_300"
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
            </div>
          </div>
          <div
            v-if="showDataTypeSelector && dataToVisualise.length !== 0"
            class="data-desc"
          >
            <div
              v-for="(desc, descIndex) in descData"
              :key="`desc_option_${descIndex}`"
              class="container--data-desc"
            >
              <p class="data-desc__desc">
                <b>{{ desc[0] }}</b>
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
        </div>
        <simple-chart
          v-if="dataToVisualise.length !== 0"
          :data-points="dataToVisualise"
          :labels="labelsToVisualise"
          :dates="dateDaysToVisualise"
          :chart-type="selectedChartType"
          :reset="resetGraph"
          :data-type="{ name: selectedDataName, type: selectedDataType }"
          :show-data-type="showDataTypeSelector"
          aria-label="Graph"
          class="fadeIn"
        />
        <div v-else class="graph_placeholder">
          <h3>
            No data to plot on the graph
          </h3>
          <p class="grey">
            Make sure that you've used the correct format and have chosen a selection above
          </p>
        </div>
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
      largestValue: null,
      smallestValue: null,
      showLoadsVolumeOptions: false,
      selectedDataName: 'Plan Overview',
      optionsForDataName: new Set(),
      selectedDataType: 'Sets',
      showDataTypeSelector: true,
      selectedChartType: 'line',
      resetGraph: 0,
      dataToVisualise: [],
      labelsToVisualise: [],
      planOverviewDates: [],
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

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Scans the sessions and updates the stats.
     */
    scan () {
      this.sessionDataPackets = []
      this.maxWeek = parseInt(this.plan.duration)
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
              const CASED_ITEM = this.proper_case(DATA_PACKET.exerciseName)
              this.optionsForDataName.add(DATA_PACKET.exerciseProtocol.includes('at') ? CASED_ITEM : DATA_PACKET.exerciseName)
            }
          }
          this.selection()
        }
      }
      this.forceUpdate += 1
      this.$parent.checkForWeekSessions()
    },

    /**
     * Calculates and generates data on selected a new option.
     */
    selection () {
      /**
       * Creates a data point
       */
      class DataPoint {
        constructor (parent, dataPacket, returnDataType) {
          this.parent = parent
          this.sessionName = dataPacket.sessionName
          this.sessionDate = dataPacket.sessionDate
          this.exerciseName = dataPacket.exerciseName
          this.protocol = dataPacket.exerciseProtocol.replace(/\s/g, '')
          this.returnDataType = returnDataType
          this.regexSetsReps = /(\d*)x((\d*\/*)*)/gi
          this.regexLoad = /at\s*((\d\.*\/*)*)\s*\w*/gi
          this.regeGetNumber = /[0-9.]+/gi
        }

        /**
         * Indexes the correct function to extract for each type of data.
         * @returns The extracted value.
         */
        get calculate () {
          switch (this.returnDataType) {
            case 'Sets':
              return this.getSets(true)
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

        /**
         * Extracts the sets.
         * @param {boolean} returnAdditionalDescData - Whether to load the largest and smallest value to Vue data.
         * @returns The extracted value.
         */
        getSets (returnAdditionalDescData) {
          let returnValue
          let finder
          while ((finder = this.regexSetsReps.exec(this.protocol)) !== null) {
            if (finder.index === this.regexSetsReps.lastIndex) {
              this.regexSetsReps.lastIndex++
            }
            finder.forEach((setsMatch, setsIndex) => {
              if (setsIndex === 1) {
                returnValue = parseFloat(setsMatch)
                if (returnAdditionalDescData) {
                  this.parent.largestValue = this.parent.largestValue === null ? parseFloat(setsMatch) : (this.parent.largestValue < parseFloat(setsMatch) ? parseFloat(setsMatch) : this.parent.largestValue)
                  this.parent.smallestValue = this.parent.smallestValue === null ? parseFloat(setsMatch) : (this.parent.smallestValue > parseFloat(setsMatch) ? parseFloat(setsMatch) : this.parent.smallestValue)
                }
              }
            })
          }
          return returnValue
        }

        /**
         * Extracts the reps.
         * @returns The extracted value.
         */
        getReps () {
          const NUM_OF_SETS = this.getSets(false)
          let returnValue = 0
          let repsFinder
          while ((repsFinder = this.regexSetsReps.exec(this.protocol)) !== null) {
            if (repsFinder.index === this.regexSetsReps.lastIndex) {
              this.regexSetsReps.lastIndex++
            }
            repsFinder.forEach((repsMatch, repsIndex) => {
              if (repsIndex === 2) {
                if (repsMatch.includes('/')) {
                  const SPLIT_VALUE = repsMatch.split('/').map(Number)
                  returnValue = SPLIT_VALUE.reduce((a, b) => a + b)
                  const LARGEST = Math.max(SPLIT_VALUE)
                  const SMALLEST = Math.min(SPLIT_VALUE)
                  this.parent.largestValue = this.parent.largestValue === null ? LARGEST : (this.parent.largestValue < LARGEST ? LARGEST : this.parent.largestValue)
                  this.parent.smallestValue = this.parent.smallestValue === null ? SMALLEST : (this.parent.smallestValue > SMALLEST ? SMALLEST : this.parent.smallestValue)
                } else {
                  returnValue = parseFloat(repsMatch) * NUM_OF_SETS
                  this.parent.largestValue = this.parent.largestValue === null ? parseFloat(repsMatch) : (this.parent.largestValue < parseFloat(repsMatch) ? parseFloat(repsMatch) : this.parent.largestValue)
                  this.parent.smallestValue = this.parent.smallestValue === null ? parseFloat(repsMatch) : (this.parent.smallestValue > parseFloat(repsMatch) ? parseFloat(repsMatch) : this.parent.smallestValue)
                }
              }
            })
          }
          return returnValue
        }

        /**
         * Extracts the loads.
         * @returns The extracted value.
         */
        getLoad () {
          const NUM_OF_SETS = this.getSets(false)
          let returnValue = 0
          let loadFinder
          while ((loadFinder = this.regexLoad.exec(this.protocol)) !== null) {
            if (loadFinder.index === this.regexLoad.lastIndex) {
              this.regexLoad.lastIndex++
            }
            loadFinder.forEach((loadMatch, loadIndex) => {
              if (loadIndex === 1) {
                if (loadMatch.includes('/')) {
                  const SPLIT_VALUE = loadMatch.split('/').map(Number)
                  returnValue = SPLIT_VALUE.reduce((a, b) => a + b)
                  const LARGEST = Math.max(SPLIT_VALUE)
                  const SMALLEST = Math.min(SPLIT_VALUE)
                  this.parent.largestValue = this.parent.largestValue === null ? LARGEST : (this.parent.largestValue < LARGEST ? LARGEST : this.parent.largestValue)
                  this.parent.smallestValue = this.parent.smallestValue === null ? SMALLEST : (this.parent.smallestValue > SMALLEST ? SMALLEST : this.parent.smallestValue)
                } else {
                  returnValue = parseFloat(loadMatch) * NUM_OF_SETS
                  this.parent.largestValue = this.parent.largestValue === null ? parseFloat(loadMatch) : (this.parent.largestValue < parseFloat(loadMatch) ? parseFloat(loadMatch) : this.parent.largestValue)
                  this.parent.smallestValue = this.parent.smallestValue === null ? parseFloat(loadMatch) : (this.parent.smallestValue > parseFloat(loadMatch) ? parseFloat(loadMatch) : this.parent.smallestValue)
                }
              }
            })
          }
          return returnValue
        }

        /**
         * Extracts all other measures.
         * @returns The extracted value.
         */
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

      this.largestValue = null
      this.smallestValue = null
      this.dataToVisualise = []
      this.labelsToVisualise = []
      this.planOverviewDates = []
      this.dateDaysToVisualise = []
      this.protocolErrors = []
      let extractedSessionProtocols = []
      const POSITION_LOOKUP = []
      const FILTERED_SESSION_PACKETS = this.sessionDataPackets.filter((el) => {
        return el.length !== 0
      })
      FILTERED_SESSION_PACKETS.forEach((sessionDataPacket, sessionDataPacketIndex) => {
        extractedSessionProtocols = []
        sessionDataPacket.forEach((exerciseDataPacket) => {
          const EXERCISE_NAME = this.selectedDataName.replace(/\(/g, '\\(').replace(/\)/g, '\\)')
          const REGEX = RegExp(EXERCISE_NAME, 'gi')
          if (REGEX.test(exerciseDataPacket.exerciseName)) {
            this.labelsToVisualise.push([exerciseDataPacket.exerciseName, exerciseDataPacket.sessionDate])
            this.showDataTypeSelector = exerciseDataPacket.exerciseProtocol.includes('x')
            this.showLoadsVolumeOptions = exerciseDataPacket.exerciseProtocol.includes('at')
            this.selectedDataType = !this.showLoadsVolumeOptions && (this.selectedDataType === 'Load' || this.selectedDataType === 'Volume') ? 'Sets' : this.selectedDataType
            const DATA_POINT = new DataPoint(this, exerciseDataPacket, exerciseDataPacket.exerciseProtocol.includes('x') ? this.selectedDataType : 'Other')
            if (isNaN(DATA_POINT.calculate)) {
              this.protocolErrors.push({
                sessionName: exerciseDataPacket.sessionName,
                sessionDate: exerciseDataPacket.sessionDate,
                exerciseName: exerciseDataPacket.exerciseName,
                protocol: exerciseDataPacket.exerciseProtocol
              })
            } else {
              this.dataToVisualise.push(DATA_POINT.calculate)
              POSITION_LOOKUP.push(sessionDataPacketIndex)
            }
          } else if (this.selectedDataName === 'Plan Overview' && exerciseDataPacket.exerciseProtocol.includes('at')) {
            this.showDataTypeSelector = true
            const DATA_POINT = new DataPoint(this, exerciseDataPacket, this.selectedDataType)
            if (isNaN(DATA_POINT.calculate)) {
              this.protocolErrors.push({
                sessionName: exerciseDataPacket.sessionName,
                sessionDate: exerciseDataPacket.sessionDate,
                exerciseName: exerciseDataPacket.exerciseName,
                protocol: exerciseDataPacket.exerciseProtocol
              })
            } else {
              extractedSessionProtocols.push(DATA_POINT.calculate)
            }
          }
        })

        if (this.selectedDataName === 'Plan Overview') {
          this.planOverviewDates.push(sessionDataPacket[0].sessionDate)
        }

        // Sums for Plan Overview
        if (extractedSessionProtocols.length !== 0) {
          this.dataToVisualise.push(extractedSessionProtocols.reduce((a, b) => a + b))
          POSITION_LOOKUP.push(sessionDataPacketIndex)
        }
      })

      // Populates descriptive stats
      if (this.dataToVisualise.length !== 0) {
        const SUM = this.dataToVisualise.reduce((a, b) => a + b)
        const MAX = Math.max(...this.dataToVisualise)
        const MIN = Math.min(...this.dataToVisualise)
        this.descData = [
          [`Total ${this.selectedDataType.toLowerCase()} from all sessions`, SUM],
          [`Average ${this.selectedDataType.toLowerCase()} across all sessions`, (SUM / this.dataToVisualise.length).toFixed(1)],
          [`Most total amount of ${this.selectedDataType.toLowerCase()} from a session`, MAX],
          [`Least total amount of ${this.selectedDataType.toLowerCase()} from a session`, MIN],
          [`% change in ${this.selectedDataType.toLowerCase()} from the lowest to the largest`, (((MAX / MIN) - 1) * 100).toFixed(1)]
        ]
        if (this.selectedDataType !== 'Volume' && this.selectedDataName !== 'Plan Overview') {
          this.descData = [
            ...this.descData,
            [`${this.selectedDataType === 'Load' ? 'Heaviest' : 'Largest'} ${this.selectedDataType.toLowerCase()}`, this.largestValue],
            [`${this.selectedDataType === 'Load' ? 'Lightest' : 'Smallest'} ${this.selectedDataType.toLowerCase()}`, this.smallestValue]
          ]
        }
      }

      // Sets days difference
      POSITION_LOOKUP.forEach((index, nextIndex) => {
        const NEXT_SESSION = FILTERED_SESSION_PACKETS[POSITION_LOOKUP[nextIndex + 1]] || false
        const REFERENCE_DATE = new Date(FILTERED_SESSION_PACKETS[index][0].sessionDate)
        const TARGET_DATE = NEXT_SESSION !== false ? new Date(NEXT_SESSION[0].sessionDate) : false
        this.dateDaysToVisualise.push(TARGET_DATE !== false ? (TARGET_DATE.getTime() - REFERENCE_DATE.getTime()) / (1000 * 3600 * 24) : false)
      })

      // Sets labels
      if (this.selectedDataName === 'Plan Overview') {
        for (let x = 1; x <= this.dataToVisualise.length; x++) {
          this.labelsToVisualise.push(['Session ' + x, this.planOverviewDates[x - 1]])
        }
      }
      this.resetGraph += 1
    }
  }
}
</script>
