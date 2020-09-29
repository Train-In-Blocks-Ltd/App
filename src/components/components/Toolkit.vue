<style scoped>
  /* Toolkit */
  .modal--toolkit {
    padding: 2rem
  }
  .session_toolkit--content {
    margin: 2rem 0
  }
  .session_toolkit--content > div {
    display: grid;
    grid-gap: 1rem
  }
  .session_toolkit--select {
    background-color: transparent;
    border: 0;
    font-size: 1.6rem;
    width: fit-content;
    padding: .2rem 1rem .2rem 0
  }
  .session_toolkit--content input {
    width: 4rem
  }
  .modal--toolkit-close {
    display: none
  }

  @media (max-width: 576px) {
    .session_toolkit--content label, .session_toolkit--content input {
      font-size: .8rem
    }
    .session_toolkit--select {
      font-size: 1.2rem;
      width: 100%
    }
    .modal--toolkit {
      height: 100vh
    }
    .modal--toolkit-close {
      display: block
    }
  }
</style>

<template>
  <div class="modal--toolkit" >
    <select class="session_toolkit--select" @change="get_toolkit()">
      <option>Select a Calculator</option>
      <option>Maximal Heart Rate (Tanaka)</option>
      <option>Maximal Heart Rate (Gellish)</option>
      <option>Heart Rate Training Zone (Karvonen)</option>
      <option>Heart Rate Reserve</option>
      <option>Body Mass Index</option>
    </select>
    <div class="session_toolkit--content">
      <div v-if="toolkit_calcs.mhr_tanaka.view">
        <div>
          <label for="tanaka_age">Age: </label>
          <input class="input--toolkit" type="number" @input="mhr_tanaka_calc()" id="tanaka_age" name="tanaka_age"/>
        </div>
        <p><b>Maximal Heart Rate: </b>{{toolkit_calcs.mhr_tanaka.value}} BPM</p>
      </div>
      <div v-if="toolkit_calcs.mhr_gellish.view">
        <div>
          <label for="gellish_age">Age: </label>
          <input class="input--toolkit" type="number" @input="mhr_gellish_calc()" id="gellish_age" name="gellish_age"/>
        </div>
        <p><b>Maximal Heart Rate: </b>{{toolkit_calcs.mhr_gellish.value}} BPM</p>
      </div>
      <div v-if="toolkit_calcs.hrtz.view">
        <div>
          <label for="intensity">Intensity (%): </label>
          <input class="input--toolkit" type="number" @input="hrtz_calc()" id="intensity" name="intensity"/>
        </div>
        <div>
          <label for="mhr">Maximal Heart Rate: </label>
          <input class="input--toolkit" type="number" @input="hrtz_calc()" id="mhr" name="mhr"/>
        </div>
        <div>
          <label for="rhr">Resting Heart Rate: </label>
          <input class="input--toolkit" type="number" @input="hrtz_calc()" id="rhr" name="rhr"/>
        </div>
        <p><b>Target Heart Rate: </b>{{toolkit_calcs.hrtz.value}} BPM</p>
      </div>
      <div v-if="toolkit_calcs.hrr.view">
        <div>
          <label for="hrr_mhr">Maximal Heart Rate: </label>
          <input class="input--toolkit" type="number" @input="hrr_calc()" id="hrr_mhr" name="hrr_mhr"/>
        </div>
        <div>
          <label for="hrr_rhr">Resting Heart Rate: </label>
          <input class="input--toolkit" type="number" @input="hrr_calc()" id="hrr_rhr" name="hrr_rhr"/>
        </div>
        <p><b>Heart Rate Reserve: </b>{{toolkit_calcs.hrr.value}} BPM</p>
      </div>
      <div v-if="toolkit_calcs.bmi.view">
        <div>
          <label for="height">Height (m): </label>
          <input class="input--toolkit" type="number" @input="bmi_calc()" id="height" name="height"/>
        </div>
        <div>
          <label for="weight">Weight (kg): </label>
          <input class="input--toolkit" type="number" @input="bmi_calc()" id="weight" name="weight"/>
        </div>
        <p><b>Body Mass Index: </b>{{toolkit_calcs.bmi.value}} kg/m<sup>2</sup></p>
      </div>
    </div>
    <button class="modal--toolkit-close button" @click="$parent.$modal.hide('toolkit')">Close</button>
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
        document.querySelectorAll('.session_toolkit--content input').forEach(e => {
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