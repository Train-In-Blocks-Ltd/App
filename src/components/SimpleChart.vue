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
        <h2>
          {{ focusText !== 'Select a point' ? focusText[1] : '' }}
          <br>
          <span v-if="focusText !== 'Select a point'" class="text--small grey">
            {{ focusText[2] === undefined ? '' : focusText[2] }}
          </span>
        </h2>
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
            r="6"
            @click="select_point(data[1], data[2], data[3])"
          />
        </g>
      </svg>
    </div>
    <div v-else>
      <h2>
        No data to plot on the graph
      </h2>
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
    reset: Number
  },
  data () {
    return {
      focusText: 'Select a point',
      padding: 10,
      maxValue: null,
      minValue: null,
      dataValues: [],
      pathValues: [],
      xInterval: null
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
      this.dataValues = []
      this.pathValues = []
      this.xInterval = (90 / this.dataPoints.length)
      this.maxValue = Math.max(...this.dataPoints)
      this.minValue = Math.min(...this.dataPoints)
      this.dataPoints.forEach((data, index) => {
        this.dataValues.push([
          [
            this.xInterval * (index + 1),
            90 - (data * 0.8 / this.maxValue) * 100
          ],
          data,
          this.labels[index][0],
          this.labels[index][1]
        ])
      })
      this.dataValues.forEach((data, index) => {
        if (index < this.dataValues.length - 1) {
          this.pathValues.push([
            data[0][0],
            data[0][1],
            this.dataValues[index + 1][0][0],
            this.dataValues[index + 1][0][1]
          ])
        }
      })
    }
  }
}
</script>
