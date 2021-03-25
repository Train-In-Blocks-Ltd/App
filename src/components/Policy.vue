<style>
#policy_agreement {
  display: block;
  margin: 2rem 15vw
}
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
.confirm_agree {
  background-color: green;
  color: white
}

/* Responsiveness */
@media (max-width: 992px) {
  #policy_agreement {
    margin: 2rem 10vw
  }
}
@media (max-width: 768px) {
  #policy_agreement {
    margin: 2rem 5vw
  }
}
@media (max-width: 576px) {
  #policy_agreement {
    margin: 2rem 0
  }
}
</style>

<template>
  <form id="policy_agreement" @submit.prevent="agree_to_terms(), will_body_scroll(true), $modal.hide('agreement')">
    <div id="policy" v-html="policy.html" />
    <p id="agree_statement">
      <b>
        By signing below, you agree to our End-User License Agreement, Privacy and Data Policy, Terms of Use, and Cookies Policy — all of which are designed to protect your information and maintain the quality of our services.
      </b>
    </p>
    <div class="confirmation">
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
    },
    agree_to_terms () {
      this.$parent.claims.policy = [this.name, this.today(), this.$parent.policyVersion]
      this.$parent.save_claims()
    }
  }
}
</script>
