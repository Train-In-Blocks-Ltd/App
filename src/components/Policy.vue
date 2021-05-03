<style>
#policy h1 {
  /* stylelint-disable-next-line */
  font-size: 1.6rem !important
}
#policy h2 {
  /* stylelint-disable-next-line */
  font-size: 1rem !important
}
#policy p, #policy b, #agree_statement b {
  /* stylelint-disable-next-line */
  font-size: .8rem !important;
  margin: 1rem 0
}
#policy li {
  font-size: .8rem;
  list-style-type: lower-roman
}
#agree_statement {
  margin: 2rem 0
}
.confirmation button {
  margin-bottom: 2rem
}
.agree_name {
  margin-right: 1rem
}

/* Responsiveness */
@media (max-width: 576px) {
  input.agree_name {
    margin-right: 0
  }
  .confirmation button {
    width: 100%;
    margin-top: 1rem
  }
}
</style>

<template>
  <form id="policy_agreement" @submit.prevent="agree_to_terms(), willBodyScroll(true), $parent.showEULA = false">
    <div id="policy" v-html="eula.html" />
    <p id="agree_statement">
      <b>
        By signing below, you agree to our End-User License Agreement, Privacy and Data Policy, Terms of Use, and Cookies Policy — all of which are designed to protect your information and maintain the quality of our services.
      </b>
    </p>
    <div class="confirmation">
      <input v-model="name" class="width_300 small_border_radius agree_name" type="name" placeholder="Your full name" required>
      <button :disabled="name === ''">
        Agree
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    type: String
  },
  data () {
    return {
      name: '',
      eula: null
    }
  },
  created () {
    if (this.type === 'Client') {
      this.eula = require('./legal/eula-client.md')
    } else {
      this.eula = require('./legal/eula.md')
    }
    this.willBodyScroll(false)
  },
  methods: {
    agree_to_terms () {
      this.$parent.claims.policy = [this.name, this.today(), this.$parent.policyVersion]
      this.$parent.save_claims()
    }
  }
}
</script>
