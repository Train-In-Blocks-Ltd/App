<style>
#policy_agreement {
  display: block;
  margin: 2rem 5vw
}
#policy_agreement button {
  margin: 2rem 0
}
#policy h2 {
  margin-top: 2rem
}
#policy p {
  margin: 1rem 0
}
#policy li {
  list-style-type: lower-roman
}
.agree_name {
  margin-right: 1rem
}
.confirm_agree {
  background-color: green;
  color: white
}
</style>

<template>
  <form id="policy_agreement" @submit.prevent="will_body_scroll(true)">
    <div id="policy" v-html="policy.html" />
    <div>
      <input class="width_300 small_border_radius agree_name" type="name" placeholder="Your full name" required>
      <button v-if="!agreeing" :disabled="name === ''" type="button" @click.prevent="agreeing = true, timing()">
        Agree
      </button>
      <button v-else :disabled="name === ''" class="confirm_agree" type="submit">
        Confirm
      </button>
    </div>
  </form>
</template>

<script>
import policy from './legal/eula.md'

export default {
  data () {
    return {
      name: '',
      agreeing: false,
      policy
    }
  },
  methods: {
    timing () {
      setTimeout(() => { this.agreeing = false }, 4000)
    }
  }
}
</script>
