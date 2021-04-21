<style scoped>
  #simple_chart {
    margin: 2rem 0
  }
  .content_wrapper {
    display: grid;
    grid-gap: 2rem
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
          <line
            v-for="(data, index) in pathValues"
            :key="'ptVal_' + index"
            :x1="`${data[0]}%`"
            :x2="`${data[2]}%`"
            :y1="`${data[1]}%`"
            :y2="`${data[3]}%`"
          />
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
    reset: Number
  },
  data () {
    return {
      focusText: 'Select a point',
      dataValues: [],
      pathValues: []
    }
  },
  watch: {
    dataPoints () {
      this.process_and_plot()
    },
    reset () {
      this.focusText = 'Select a point'
    }
  },
  mounted () {
    this.process_and_plot()
  },
  methods: {
    select_point (d1, d2, d3) {
      this.focusText = [d1, d2, d3]
    },
    process_and_plot () {
      class DataProcessor {
        constructor (yDataset, xDataset, pointLabels, outputType, relativeToDate) {
          this.yDataset = yDataset
          this.xDataset = xDataset
          this.pointLabels = pointLabels
          this.outputType = outputType
          this.maxValue = Math.max(...yDataset)
          this.relativeToDate = relativeToDate
        }

        get create () {
          switch (this.outputType) {
            case 'line':
              this.makePoints(false)
              return { processedPoints: this.processedPoints, processedPaths: this.makePaths() }
          }
        }

        makePoints (toReturn) {
          const RETURN_DATA_VALUES = []
          this.yDataset.forEach((data, index) => {
            /*
            function relativeInterval () {
            }
            */
            RETURN_DATA_VALUES.push([
              [
                // this.relativeToDate ? relativeInterval() : ((90 / this.dataPoints.length) * (index + 1)),
                (90 / this.yDataset.length) * (index + 1),
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
      }
      const DATA = new DataProcessor(this.dataPoints, this.dates, this.labels, 'line', false)
      this.dataValues = DATA.create.processedPoints
      this.pathValues = DATA.create.processedPaths
    }
  }
}
</script>
