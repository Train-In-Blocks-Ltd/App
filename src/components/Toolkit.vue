<style scoped>
textarea {
  margin-top: 2rem;
  resize: none
}

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

@media (max-width: 576px) {
  button.red_button {
    width: 100%
  }
}
</style>

<template>
  <div>
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
    <textarea rows="3" placeholder="Use this if you need to make quick notes" />
    <div class="session_toolkit--content">
      <div
        v-for="(tool, toolIndex) in calculators"
        v-show="selectedTool === tool.name"
        :key="`tool_${toolIndex}`"
      >
        <p><b>Data:</b></p>
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
        <h3 class="result">
          {{ tool.metric }}: {{ result || '_____' }} <span v-html="tool.units" />
        </h3>
      </div>
    </div>
    <button
      class="red_button"
      @click="$parent.showToolkit = false, will_body_scroll(true)"
    >
      Close
    </button>
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
          metric: 'MHR',
          units: 'BPM'
        },
        {
          id: 'mhr_gelish',
          name: 'Maximal heart rate (Gelish)',
          inputs: [
            { id: 'age_gelish', label: 'Age', value: null }
          ],
          metric: 'MHR',
          units: 'BPM'
        },
        {
          id: 'hrr',
          name: 'Heart rate reserve (Tanaka)',
          inputs: [
            { id: 'mhr_hrr', label: 'Maximal heart rate', value: null },
            { id: 'rhr_hrr', label: 'Resting heart rate', value: null }
          ],
          metric: 'HR Reserve',
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
          metric: 'HR Zone',
          units: 'BPM'
        },
        {
          id: 'bmi',
          name: 'Body mass index',
          inputs: [
            { id: 'weight', label: 'Weight (kg)', value: null },
            { id: 'height', label: 'Height (m)', value: null }
          ],
          metric: 'BMI',
          units: 'kg/m<sup>2</sup>'
        },
        {
          id: '3_skin_jackson_pollock_female',
          name: '3-site skinfold (Female; Jackson and Pollock)',
          inputs: [
            { id: 'age_f', label: 'Age', value: null },
            { id: 'site1_f', label: 'Tricep skinfold (mm)', value: null },
            { id: 'site2_f', label: 'Thigh skinfold (mm)', value: null },
            { id: 'site3_f', label: 'Suprailium skinfold (mm)', value: null }
          ],
          metric: 'Body density',
          units: ''
        },
        {
          id: '3_skin_jackson_pollock_male',
          name: '3-site skinfold (Male; Jackson and Pollock)',
          inputs: [
            { id: 'age_m', label: 'Age', value: null },
            { id: 'site1_m', label: 'Chest skinfold (mm)', value: null },
            { id: 'site2_m', label: 'Abdomen skinfold (mm)', value: null },
            { id: 'site3_m', label: 'Thigh skinfold (mm)', value: null }
          ],
          metric: 'Body density',
          units: ''
        },
        {
          id: 'bf_siri',
          name: 'Percentage body fat (Siri)',
          inputs: [
            { id: 'body_density', label: 'Body density', value: null }
          ],
          metric: 'Body fat',
          units: '%'
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
          const MAX_HR = Number(document.getElementById('input_mhr_hrr').value)
          const RESTING_HR = Number(document.getElementById('input_rhr_hrr').value)
          this.result = MAX_HR - RESTING_HR
          break
        }
        case 'hrtz': {
          const INTENSITY_ZONE_1 = Number(document.getElementById('input_intensity_1').value / 100)
          const INTENSITY_ZONE_2 = Number(document.getElementById('input_intensity_2').value / 100)
          const MAX_HR = Number(document.getElementById('input_mhr_hrtz').value)
          const RESTING_HR = Number(document.getElementById('input_rhr_hrtz').value)
          this.result = `${(INTENSITY_ZONE_1 * (MAX_HR - RESTING_HR) + RESTING_HR).toFixed(2)}–${(INTENSITY_ZONE_2 * (MAX_HR - RESTING_HR) + RESTING_HR).toFixed(2)}`
          break
        }
        case 'bmi': {
          const WEIGHT = Number(document.getElementById('input_weight').value)
          const HEIGHT = Number(document.getElementById('input_height').value)
          this.result = (WEIGHT / (HEIGHT * HEIGHT)).toFixed(2)
          break
        }
        case '3_skin_jackson_pollock_female': {
          const AGE = Number(document.getElementById('input_age_f').value)
          const SITE_1 = Number(document.getElementById('input_site1_f').value)
          const SITE_2 = Number(document.getElementById('input_site2_f').value)
          const SITE_3 = Number(document.getElementById('input_site3_f').value)
          const SUM_OF_SITES = SITE_1 + SITE_2 + SITE_3
          this.result = (1.0994921 - (0.0009929 * SUM_OF_SITES) + (0.0000023 * SUM_OF_SITES * SUM_OF_SITES) - (0.0001392 * AGE)).toFixed(2)
          break
        }
        case '3_skin_jackson_pollock_male': {
          const AGE = Number(document.getElementById('input_age_m').value)
          const SITE_1 = Number(document.getElementById('input_site1_m').value)
          const SITE_2 = Number(document.getElementById('input_site2_m').value)
          const SITE_3 = Number(document.getElementById('input_site3_m').value)
          const SUM_OF_SITES = SITE_1 + SITE_2 + SITE_3
          this.result = (1.10938 - (0.0008267 * SUM_OF_SITES) + (0.0000016 * SUM_OF_SITES * SUM_OF_SITES) - (0.0002574 * AGE)).toFixed(2)
          break
        }
        case 'bf_siri': {
          this.result = (495 / Number(document.getElementById('input_body_density').value) - 450).toFixed(2)
          break
        }
      }
    }
  }
}
</script>
