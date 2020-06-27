<style scoped>
  /* Toolkit */
  .modal--toolkit {
    padding: 2rem
  }
  .workout_toolkit--content > div {
    display: grid;
    grid-gap: 1rem
  }
  .workout_toolkit--content label {
    font-weight: bold
  }
  .workout_toolkit--select {
    margin-bottom: 2rem;
    padding: .4rem
  }
  .workout_toolkit--content input {
    width: 4rem
  }

  @media (max-width: 576px) {
    .workout_toolkit--content label, .workout_toolkit--content input {
      font-size: .8rem
    }
  }
</style>

<template>
  <div class="modal--toolkit" >
    <select class="workout_toolkit--select" v-on:change="get_toolkit()">
      <option>Maximal Heart Rate (Tanaka)</option>
      <option>Maximal Heart Rate (Gellish)</option>
      <option>Heart Rate Training Zone (Karvonen)</option>
      <option>Heart Rate Reserve</option>
      <option>Body Mass Index</option>
    </select>
    <div class="workout_toolkit--content">
      <div v-if="toolkit_calcs.mhr_tanaka.view">
        <label for="tanaka_age">Age: </label><input type="number" v-on:input="mhr_tanaka_calc()" id="tanaka_age" name="tanaka_age"/>
        <p><b>Maximal Heart Rate: </b>{{toolkit_calcs.mhr_tanaka.value}} BPM</p>
      </div>
      <div v-if="toolkit_calcs.mhr_gellish.view">
        <label for="gellish_age">Age: </label><input type="number" v-on:input="mhr_gellish_calc()" id="gellish_age" name="gellish_age"/>
        <p><b>Maximal Heart Rate: </b>{{toolkit_calcs.mhr_gellish.value}} BPM</p>
      </div>
      <div v-if="toolkit_calcs.hrtz.view">
        <label for="intensity">Intensity: </label><input type="number" v-on:input="hrtz_calc()" id="intensity" name="intensity"/>
        <label for="mhr">Maximal Heart Rate: </label><input type="number" v-on:input="hrtz_calc()" id="mhr" name="mhr"/>
        <label for="rhr">Resting Heart Rate: </label><input type="number" v-on:input="hrtz_calc()" id="rhr" name="rhr"/>
        <p><b>Target Heart Rate: </b>{{toolkit_calcs.hrtz.value}} BPM</p>
      </div>
      <div v-if="toolkit_calcs.hrr.view">
        <label for="hrr_mhr">Maximal Heart Rate: </label><input type="number" v-on:input="hrr_calc()" id="hrr_mhr" name="hrr_mhr"/>
        <label for="hrr_rhr">Resting Heart Rate: </label><input type="number" v-on:input="hrr_calc()" id="hrr_rhr" name="hrr_rhr"/>
        <p><b>Heart Rate Reserve: </b>{{toolkit_calcs.hrr.value}} BPM</p>
      </div>
      <div v-if="toolkit_calcs.bmi.view">
        <label for="height">Height: </label><input type="number" v-on:input="bmi_calc()" id="height" name="height"/>
        <label for="weight">Weight: </label><input type="number" v-on:input="bmi_calc()" id="weight" name="weight"/>
        <p><b>Body Mass Index: </b>{{toolkit_calcs.bmi.value}} kg/m<sup>2</sup></p>
      </div>
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
        },
      }
    },
    methods: {
      /* Various workout calculators */
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
        document.querySelectorAll('.workout_toolkit--content input').forEach(e => {
          e.value = null
        })
      },
      /* Selects the correct calculator depending on the select */
      get_toolkit () {
        const select = document.querySelector('.workout_toolkit--select').value
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
      },
    }
  }
</script>>