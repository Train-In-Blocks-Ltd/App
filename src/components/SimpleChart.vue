<style scoped>
#simple_chart {
  padding: 1rem;
  background-color: var(--fore);
  box-shadow: var(--low_shadow);
  border-radius: 10px;
  margin: 2rem 0
}
.content_wrapper {
  display: grid;
  grid-gap: 1rem
}
.selected_bar {
  display: flex;
  justify-content: space-between
}
.x_axis line, .y_axis line {
  stroke: var(--base);
  stroke-dasharray: 0;
  stroke-width: 2
}
.x_axis_label {
  margin-left: 1rem
}
.plot circle {
  cursor: pointer;
  outline-width: 0;
  fill: transparent;
  stroke: var(--base);
  stroke-width: 2;
  transition: var(--transition_standard);
  animation: 1.6s show cubic-bezier(.165, .84, .44, 1)
}
.plot circle:hover {
  fill: var(--base)
}
.plot line {
  stroke: var(--base_faint);
  stroke-width: 2;
  transition: var(--transition_standard);
  animation: 1.6s show cubic-bezier(.165, .84, .44, 1)
}

/* Scatter options */
.scatter_options {
  display: grid;
  grid-gap: .6rem;
  margin: 1rem
}

@keyframes show {
  from {
    opacity: 0
  }
  to {
    opacity: 1
  }
}
</style>

<template>
  <div id="simple_chart">
    <div v-if="dataPoints.length !== 0" class="content_wrapper">
      <div class="selected_bar">
        <h3>
          {{ focusText !== 'Select a point' ? focusText[1] : '' }}
          <br>
          <span v-if="focusText !== 'Select a point'" class="text--small grey">
            {{ focusText[2] === undefined ? '' : focusText[2] }}
          </span>
        </h3>
        <p class="text--small grey">
          {{ focusText !== 'Select a point' ? focusText[0] : focusText }}
        </p>
      </div>
      <svg
        version="1.2"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        class="simple_chart__view"
        width="100%"
        height="400"
      >
        <g class="x_axis">
          <line x1="2%" x2="98%" y1="98%" y2="98%" />
          <line x1="98%" x2="98%" y1="100%" y2="96%" />
          <line x1="2%" x2="2%" y1="100%" y2="96%" />
        </g>
        <g class="plot">
          <g
            v-for="(data, index) in pathValues"
            :key="'ptVal_' + index"
          >
            <line
              v-if="!isNaN(data[1])"
              :x1="`${data[0]}%`"
              :x2="`${data[2]}%`"
              :y1="`${data[1]}%`"
              :y2="`${data[3]}%`"
              :class="{ scatter_line: chartType === 'scatter' }"
            />
          </g>
          <circle
            v-for="(data, index) in dataValues"
            :key="'dtVal_' + index"
            :cx="`${data[0][0]}%`"
            :cy="`${data[0][1]}%`"
            r="4"
            @click="select_point(data[1], data[2], data[3])"
          />
        </g>
      </svg>
      <p class="x_axis_label">
        <b>{{ chartType === 'scatter' ? 'Sessions relative to days apart' : 'Sessions' }}</b><br>
        <span v-if="chartType === 'scatter' && !isNaN(rValue)">
          Correlation (r): {{ rValue }}
        </span>
      </p>
      <div v-if="chartType === 'scatter' && !isNaN(rValue)" class="scatter_options">
        <label for="prediction">
          <b>
            Predict {{ showDataType ? `${dataType.type.toLowerCase()} for ${dataType.name.toLowerCase()}` : dataType.name.toLowerCase() }}
          </b>
        </label>
        <input
          v-model="predictionDay"
          class="width_300 small_border_radius"
          name="prediction"
          type="number"
          min="1"
          placeholder="Days since starting the plan"
        >
        <p v-if="predictionDay">
          Expected {{ showDataType ? dataType.type.toLowerCase() : dataType.name.toLowerCase() }}: {{ prediction(predictionDay) }}
        </p>
        <p v-if="predictionDay && predictionError">
          Prediction error (RMS): {{ predictionError }}
        </p>
      </div>
    </div>
    <div v-else>
      <h3>
        No data to plot on the graph
      </h3>
      <p class="grey">
        Make sure that you've used the correct format and have chosen a selection above
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataPoints: Array,
    labels: Array,
    dates: Array,
    chartType: String,
    reset: Number,
    dataType: Object,
    showDataType: Boolean
  },
  data () {
    return {
      focusText: 'Select a point',
      dataValues: [],
      pathValues: [],

      // Equation
      gradient: null,
      yIntercept: null,
      rValue: null,
      predictionDay: null,
      predictionError: null
    }
  },
  watch: {
    dataPoints () {
      this.processAndPlot()
    },
    chartType () {
      this.processAndPlot()
    },
    reset () {
      this.focusText = 'Select a point'
    }
  },
  mounted () {
    this.processAndPlot()
  },
  methods: {

    // Prediction
    prediction (day) {
      const SUM_OF_DAYS = this.dates.reduce((a, b) => a + b)
      const PREDICTED_PROPORTION = (this.gradient * 90 * (day / SUM_OF_DAYS) + this.yIntercept).toFixed(2)
      const MAX_Y_VALUE = Math.max(...this.dataPoints)
      return (MAX_Y_VALUE * (90 + (10 - PREDICTED_PROPORTION)) / 90).toFixed(this.dataType.type === 'Sets' || this.dataType.type === 'Reps' ? 0 : 2)
    },

    // Init
    select_point (d1, d2, d3) {
      this.focusText = [d1, d2, d3]
    },
    processAndPlot () {
      class DataProcessor {
        constructor (yDataset, xDataset, pointLabels, outputType) {
          this.yDataset = yDataset
          this.xDataset = xDataset
          this.pointLabels = pointLabels
          this.outputType = outputType
          this.maxValue = Math.max(...yDataset)
        }

        get create () {
          switch (this.outputType) {
            case 'line':
              this.relativeToDate = false
              this.makePoints(false)
              return { processedPoints: this.processedPoints, processedPaths: this.makePaths() }
            case 'scatter':
              this.relativeToDate = true
              this.makePoints(false)
              return { processedPoints: this.makePoints(true), processedPaths: this.regression() }
          }
        }

        makePoints (toReturn) {
          const RETURN_DATA_VALUES = []
          this.yDataset.forEach((data, index) => {
            function relativeInterval (xDataset, index) {
              const sumOfPrevious = (xDataset, index) => {
                let returnSum = 0
                for (let i = 0; i < index; i++) {
                  returnSum += xDataset[i]
                }
                return returnSum
              }
              const SUM_OF_DATE_DAYS = xDataset.reduce((a, b) => a + (b === false ? 0 : b))
              const RETURN_INTERVAL_VALUE = index !== 0 ? (90 / SUM_OF_DATE_DAYS) * sumOfPrevious(xDataset, index) : 5
              return RETURN_INTERVAL_VALUE
            }
            RETURN_DATA_VALUES.push([
              [
                this.relativeToDate ? relativeInterval(this.xDataset, index) : ((90 / this.yDataset.length) * (index + 1)),
                90 - (data * 0.8 / this.maxValue) * 100
              ],
              data,
              this.pointLabels[index][0],
              this.pointLabels[index][1]
            ])
          })
          if (toReturn) {
            return RETURN_DATA_VALUES
          } else {
            this.processedPoints = RETURN_DATA_VALUES
          }
        }

        makePaths () {
          const RETURN_PATH_VALUES = []
          this.processedPoints.forEach((data, index) => {
            if (index < this.processedPoints.length - 1) {
              RETURN_PATH_VALUES.push([
                data[0][0],
                data[0][1],
                this.processedPoints[index + 1][0][0],
                this.processedPoints[index + 1][0][1]
              ])
            }
          })
          return RETURN_PATH_VALUES
        }

        regression () {
          this.scaledXDataset = []
          this.scaledYDataset = []
          this.processedPoints.forEach((point) => {
            this.scaledXDataset.push(point[0][0])
            this.scaledYDataset.push(point[0][1])
          })

          // Sample means
          this.xSampleMean = this.scaledXDataset.reduce((a, b) => a + b) / this.scaledXDataset.length
          this.ySampleMean = this.scaledYDataset.reduce((a, b) => a + b) / this.scaledYDataset.length

          // Sample SDs
          const standardDeviation = (dataset, sampleMean) => {
            const SUM_OF_SQUARES = []
            dataset.forEach((datapoint) => {
              SUM_OF_SQUARES.push(Math.pow((datapoint - sampleMean), 2))
            })
            return Math.sqrt(SUM_OF_SQUARES.reduce((a, b) => a + b) / (dataset.length - 1))
          }
          this.xSampleSD = standardDeviation(this.scaledXDataset, this.xSampleMean)
          this.ySampleSD = standardDeviation(this.scaledYDataset, this.ySampleMean)

          // Pearson's correlation
          const SUM_OF_POINTS = []
          for (let i = 0; i < this.scaledXDataset.length; i++) {
            SUM_OF_POINTS.push(((this.scaledXDataset[i] - this.xSampleMean) / this.xSampleSD) * ((this.scaledYDataset[i] - this.ySampleMean) / this.ySampleSD))
          }
          this.rCorrelation = (SUM_OF_POINTS.reduce((a, b) => a + b) / (this.scaledXDataset.length - 1))

          // Equation attributes
          this.gradient = this.rCorrelation * this.ySampleSD / this.xSampleSD
          this.yIntercept = this.ySampleMean - this.gradient * this.xSampleMean

          // Line plot
          const y = (x) => {
            return this.gradient * x + this.yIntercept
          }
          const accuracy = () => {
            const SUM_OF_SQUARES = []
            for (const index in this.scaledXDataset) {
              SUM_OF_SQUARES.push(Math.pow(this.scaledYDataset[index] - y(this.scaledXDataset[index]), 2))
            }
            return Math.sqrt(SUM_OF_SQUARES.reduce((a, b) => a + b) / this.scaledXDataset.length)
          }
          this.accuracy = accuracy()
          return [[5, y(5), 90, y(90)]]
        }
      }
      const DATA = new DataProcessor(this.dataPoints, this.dates, this.labels, this.chartType)
      this.dataValues = DATA.create.processedPoints || DATA.create
      this.pathValues = DATA.create.processedPaths || []
      if (this.chartType === 'scatter') {
        this.gradient = DATA.gradient
        this.yIntercept = DATA.yIntercept
        this.rValue = (DATA.rCorrelation * -1).toFixed(2)
        this.predictionError = DATA.accuracy.toFixed(2)
      }
    }
  }
}
</script>
