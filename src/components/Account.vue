<template>
  <div id="account">
    <h1>Your Account</h1>

    <h2>Your Details</h2>
    <p><b>Name: </b><span>{{claims.name}}</span></p>
    <p><b>Email: </b><span>{{claims.email}}</span></p>
    <p><a href="">Update your details</a></p>
    <h2>Your Subscription</h2>
    <h2>Colour Theme</h2>
    <chrome-picker :value="colors" @input="updateValue"></chrome-picker>
  </div>
</template>

<script>
import { Chrome } from 'vue-color'

let defaultProps = {
  hex: '#194d33e6',
  hsl: {
    h: 150,
    s: 0.5,
    l: 0.2,
    a: 0.9
  },
  hsv: {
    h: 150,
    s: 0.66,
    v: 0.30,
    a: 0.9
  },
  rgba: {
    r: 159,
    g: 96,
    b: 43,
    a: 0.9
  },
  a: 0.9
}

export default {
  components: {
    'chrome-picker': Chrome
  },
  name: 'Account',
  data () {
    return {
      claims: '',
      colors: defaultProps
    }
  },
  computed: {
    bgc () {
      return this.colors.hex
    }
  },
  methods: {
    onOk () {
      console.log('ok')
    },
    onCancel () {
      console.log('cancel')
    },
    updateValue (value) {
      this.colors = value
    }
  },
  async created () {
    this.claims = await this.$auth.getUser()
  }
}
</script>
