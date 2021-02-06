<style scoped>
  /* Toolkit */
  .session_toolkit--content {
    margin: 2rem 0
  }
  .session_toolkit--content > div {
    display: grid;
    grid-gap: 1rem
  }
  .session_toolkit--content input {
    width: 4rem
  }
  .modal--toolkit-close {
    display: none
  }
  p.text--small {
    margin-top: 1rem
  }

  @media (max-width: 576px) {
    .modal--toolkit {
      height: 100vh
    }
    .modal--toolkit-close {
      display: block
    }
  }
</style>

<template>
  <div class="modal--toolkit">
    <div class="wrapper--centered-item">
      <select class="text--small session_toolkit--select" @change="get_toolkit()">
        <option>Maximal Heart Rate (Tanaka)</option>
        <option>Maximal Heart Rate (Gellish)</option>
        <option>Heart Rate Training Zone (Karvonen)</option>
        <option>Heart Rate Reserve</option>
        <option>Body Mass Index</option>
      </select>
      <div class="session_toolkit--content">
        <div v-if="toolkit_calcs.mhr_tanaka.view">
          <div>
            <input
              id="tanaka_age"
              class="input--toolkit small_border_radius"
              type="number"
              name="tanaka_age"
              aria-label="Age"
              placeholder="Age"
              @input="mhr_tanaka_calc()"
            >
          </div>
          <p class="text--small">
            Maximal Heart Rate: {{ toolkit_calcs.mhr_tanaka.value }} BPM
          </p>
        </div>
        <div v-if="toolkit_calcs.mhr_gellish.view">
          <div>
            <input
              id="gellish_age"
              class="input--toolkit small_border_radius"
              type="number"
              name="gellish_age"
              aria-label="Age"
              placeholder="Age"
              @input="mhr_gellish_calc()"
            >
          </div>
          <p class="text--small">
            Maximal Heart Rate: {{ toolkit_calcs.mhr_gellish.value }} BPM
          </p>
        </div>
        <div v-if="toolkit_calcs.hrtz.view">
          <div>
            <input
              id="intensity"
              class="input--toolkit small_border_radius"
              type="number"
              name="intensity"
              aria-label="Intensity"
              placeholder="Intensity"
              @input="hrtz_calc()"
            >
          </div>
          <div>
            <input
              id="mhr"
              class="input--toolkit small_border_radius"
              type="number"
              name="mhr"
              aria-label="Maximal Heart Rate"
              placeholder="Maximal Heart Rate"
              @input="hrtz_calc()"
            >
          </div>
          <div>
            <input
              id="rhr"
              class="input--toolkit small_border_radius"
              type="number"
              name="rhr"
              aria-label="Resting Heart Rate"
              placeholder="Resting Heart Rate"
              @input="hrtz_calc()"
            >
          </div>
          <p class="text--small">
            Target Heart Rate: {{ toolkit_calcs.hrtz.value }} BPM
          </p>
        </div>
        <div v-if="toolkit_calcs.hrr.view">
          <div>
            <input
              id="hrr_mhr"
              class="input--toolkit small_border_radius"
              type="number"
              name="hrr_mhr"
              aria-label="Maximal Heart Rate"
              placeholder="Maximal Heart Rate"
              @input="hrr_calc()"
            >
          </div>
          <div>
            <input
              id="hrr_rhr"
              class="input--toolkit small_border_radius"
              type="number"
              name="hrr_rhr"
              aria-label="Resting Heart Rate"
              placeholder="Resting Heart Rate"
              @input="hrr_calc()"
            >
          </div>
          <p class="text--small">
            Heart Rate Reserve: {{ toolkit_calcs.hrr.value }} BPM
          </p>
        </div>
        <div v-if="toolkit_calcs.bmi.view">
          <div>
            <input
              id="height"
              class="input--toolkit small_border_radius"
              type="number"
              name="height"
              aria-label="Height (m)"
              placeholder="Height (m)"
              @input="bmi_calc()"
            >
          </div>
          <div>
            <input
              id="weight"
              class="input--toolkit small_border_radius"
              type="number"
              name="weight"
              aria-label="Weight (kg)"
              placeholder="Weight (kg)"
              @input="bmi_calc()"
            >
          </div>
          <p class="text--small">
            Body Mass Index: {{ toolkit_calcs.bmi.value }} kg/m<sup>2</sup>
          </p>
        </div>
      </div>
      <button class="cancel" @click="$parent.$modal.hide('toolkit')">
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      toolkit: false,
      toolkit_calcs: {
        mhr_tanaka: {
          view: false,
          value: null
        },
        mhr_gellish: {
          view: false,
          value: null
        },
        hrtz: {
          view: false,
          value: null
        },
        hrr: {
          view: false,
          value: null
        },
        bmi: {
          view: false,
          value: null
        }
      }
    }
  },
  mounted () {
    this.get_toolkit()
  },
  methods: {
    /* Various session calculators */
    mhr_tanaka_calc () {
      this.toolkit_calcs.mhr_tanaka.value = 220 - Number(document.querySelector('#tanaka_age').value)
    },
    mhr_gellish_calc () {
      this.toolkit_calcs.mhr_gellish.value = 220 - 0.7 * Number(document.querySelector('#gellish_age').value)
    },
    hrtz_calc () {
      this.toolkit_calcs.hrtz.value = (Number(document.querySelector('#intensity').value / 100)) * (Number(document.querySelector('#mhr').value) - Number(document.querySelector('#rhr').value)) + Number(document.querySelector('#rhr').value)
    },
    hrr_calc () {
      this.toolkit_calcs.hrr.value = Number(document.querySelector('#hrr_mhr').value) - Number(document.querySelector('#hrr_rhr').value)
    },
    bmi_calc () {
      this.toolkit_calcs.bmi.value = (Number(document.querySelector('#weight').value) / (Number(document.querySelector('#height').value) * Number(document.querySelector('#height').value))).toFixed(2)
    },
    /* Closes the toolkit */
    close_toolkit () {
      this.toolkit_calcs.mhr_tanaka.view = false
      this.toolkit_calcs.mhr_gellish.view = false
      this.toolkit_calcs.hrtz.view = false
      this.toolkit_calcs.hrr.view = false
      this.toolkit_calcs.bmi.view = false
      document.querySelectorAll('.session_toolkit--content input').forEach((e) => {
        e.value = null
      })
    },
    /* Selects the correct calculator depending on the select */
    get_toolkit () {
      const select = document.querySelector('.session_toolkit--select').value
      if (select === 'Maximal Heart Rate (Tanaka)') {
        this.close_toolkit()
        this.toolkit_calcs.mhr_tanaka.view = true
      } else if (select === 'Maximal Heart Rate (Gellish)') {
        this.close_toolkit()
        this.toolkit_calcs.mhr_gellish.view = true
      } else if (select === 'Heart Rate Training Zone (Karvonen)') {
        this.close_toolkit()
        this.toolkit_calcs.hrtz.view = true
      } else if (select === 'Heart Rate Reserve') {
        this.close_toolkit()
        this.toolkit_calcs.hrr.view = true
      } else if (select === 'Body Mass Index') {
        this.close_toolkit()
        this.toolkit_calcs.bmi.view = true
      }
    }
  }
}
</script>>
