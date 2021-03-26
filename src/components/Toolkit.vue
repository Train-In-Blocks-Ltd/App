<style scoped>
/* Toolkit */
.session_toolkit--content {
  margin: 2rem 0
}
.session_toolkit--content > div {
  display: grid;
  grid-gap: 1rem
}
.result {
  margin-top: 2rem
}
</style>

<template>
  <div class="modal--toolkit">
    <div class="center_wrapped">
      <select
        v-model="selectedTool"
        class="text--small session_toolkit--select"
        @change="result = null"
      >
        <option
          v-for="(toolSelect, toolSelectIndex) in calculators"
          :key="`tool_select_${toolSelectIndex}`"
        >
          {{ toolSelect.name }}
        </option>
      </select>
      <div class="session_toolkit--content">
        <div
          v-for="(tool, toolIndex) in calculators"
          v-show="selectedTool === tool.name"
          :key="`tool_${toolIndex}`"
        >
          <input
            v-for="(input, inputIndex) in tool.inputs"
            :id="`input_${input.id}`"
            :key="`tool_${inputIndex}`"
            v-model="input.value"
            type="number"
            :placeholder="input.label"
            :aria-label="input.label"
            @input="calculate(tool.id)"
          >
          <h2 class="result">
            Result: {{ result || '_____' }} <span v-html="tool.units" />
          </h2>
        </div>
      </div>
      <button
        class="cancel"
        @click="$parent.$modal.hide('toolkit'), will_body_scroll(true)"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedTool: 'Maximal heart rate (Tanaka)',
      result: null,
      calculators: [
        {
          id: 'mhr_tanaka',
          name: 'Maximal heart rate (Tanaka)',
          inputs: [
            { id: 'age_tanaka', label: 'Age', value: null }
          ],
          units: 'BPM'
        },
        {
          id: 'mhr_gelish',
          name: 'Maximal heart rate (Gelish)',
          inputs: [
            { id: 'age_gelish', label: 'Age', value: null }
          ],
          units: 'BPM'
        },
        {
          id: 'hrr',
          name: 'Heart rate reserve (Tanaka)',
          inputs: [
            { id: 'mhr_hrr', label: 'Maximal heart rate', value: null },
            { id: 'rhr_hrr', label: 'Resting heart rate', value: null }
          ],
          units: 'BPM'
        },
        {
          id: 'hrtz',
          name: 'Heart rate training zone (Karvonen)',
          inputs: [
            { id: 'intensity_1', label: 'Higher intensity (%)', value: null },
            { id: 'intensity_2', label: 'Lower intensity (%)', value: null },
            { id: 'mhr_hrtz', label: 'Maximal heart rate', value: null },
            { id: 'rhr_hrtz', label: 'Resting heart rate', value: null }
          ],
          units: 'BPM'
        },
        {
          id: 'bmi',
          name: 'Body mass index',
          inputs: [
            { id: 'weight', label: 'Weight (kg)', value: null },
            { id: 'height', label: 'Height (m)', value: null }
          ],
          units: 'kg/m<sup>2</sup>'
        }
      ]
    }
  },
  methods: {
    calculate (cal) {
      switch (cal) {
        case 'mhr_tanaka': {
          this.result = 220 - Number(document.getElementById('input_age_tanaka').value)
          break
        }
        case 'mhr_gelish': {
          this.result = (220 - 0.7 * Number(document.getElementById('input_age_gelish').value)).toFixed(2)
          break
        }
        case 'hrr': {
          const mhr = Number(document.getElementById('input_mhr_hrr').value)
          const rhr = Number(document.getElementById('input_rhr_hrr').value)
          this.result = mhr - rhr
          break
        }
        case 'hrtz': {
          const int1 = Number(document.getElementById('input_intensity_1').value / 100)
          const int2 = Number(document.getElementById('input_intensity_2').value / 100)
          const mhr = Number(document.getElementById('input_mhr_hrtz').value)
          const rhr = Number(document.getElementById('input_rhr_hrtz').value)
          this.result = `${(int1 * (mhr - rhr) + rhr).toFixed(2)}–${(int2 * (mhr - rhr) + rhr).toFixed(2)}`
          break
        }
        case 'bmi': {
          const weight = Number(document.getElementById('input_weight').value)
          const height = Number(document.getElementById('input_height').value)
          this.result = (weight / (height * height)).toFixed(2)
          break
        }
      }
    }
  }
}
</script>
