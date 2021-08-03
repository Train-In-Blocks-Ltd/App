<style lang="scss">
#policy {
  h1 {
    /* stylelint-disable-next-line */
    font-size: 1.6rem !important
  }
  h2 {
    /* stylelint-disable-next-line */
    font-size: 1rem !important
  }
  li {
    font-size: .8rem;
    list-style-type: lower-roman
  }
  p, b {
    /* stylelint-disable-next-line */
    font-size: .8rem !important;
    margin: 1rem 0
  }
  #agree_statement {
    margin: 2rem 0;
    b {
      /* stylelint-disable-next-line */
      font-size: .8rem !important;
      margin: 1rem 0
    }
  }
  .confirmation {
    .agree_name {
      margin-right: 1rem
    }
    button {
      margin-bottom: 2rem
    }
  }
}

@media (max-width: 576px) {
  .confirmation {
    .agree_name {
      margin-right: 0
    }
    button {
      width: 100%;
      margin-top: 1rem
    }
  }
}
</style>

<template>
  <form id="policy_agreement" @submit.prevent="agreeToTerms(), willBodyScroll(true)">
    <div id="policy" v-html="eula.html" />
    <p id="agree_statement">
      <b>
        By signing below, you agree to our End-User License Agreement, Privacy and Data Policy, Terms of Use, and Cookies Policy — all of which are designed to protect your information and maintain the quality of our services.
      </b>
    </p>
    <div class="confirmation">
      <input
        v-model="name"
        class="width_300 small_border_radius agree_name"
        type="name"
        placeholder="Your full name"
        required
        @input="disablePolicyAgreeButton = !name"
      >
      <button :disabled="name === '' || disablePolicyAgreeButton">
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
      name: null,
      eula: null,
      disablePolicyAgreeButton: true
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

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Agree to EULA terms.
     */
    agreeToTerms () {
      this.$store.commit('setDataDeep', {
        attrParent: 'claims',
        attrChild: 'policy',
        data: [this.name, this.today(), this.$store.state.policyVersion]
      })
      this.$parent.saveClaims()
      this.$store.commit('setData', {
        attr: 'showEULA',
        data: false
      })
    }
  }
}
</script>
