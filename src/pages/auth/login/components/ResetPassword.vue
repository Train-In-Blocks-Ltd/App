<style lang="scss" scoped>
.recovery {
  margin-top: 6rem;
  margin-bottom: 1rem;
  > .txt_input {
    margin-bottom: 1rem;
  }
}
</style>

<template>
  <form class="recovery" @submit.prevent="reset">
    <txt-input
      label="Email:"
      :value="email"
      :info="success"
      :error="error"
      type="email"
      @output="(data) => (email = data)"
      focus-first
    />
    <default-button type="submit">Send recovery email</default-button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: null,
      error: null,
      success: null,
    };
  },
  methods: {
    async reset() {
      this.$store.commit("setData", {
        attr: "dontLeave",
        data: true,
      });
      this.error = null;
      this.success = null;
      if (this.email !== "demo@traininblocks.com") {
        try {
          await this.$axios.post("/.netlify/functions/reset-password", {
            email: this.email,
          });
          this.success = "An email has been sent successfully.";
          setTimeout(() => {
            this.open = false;
            this.email = null;
          }, 3000);
          this.$store.dispatch("endLoading");
        } catch (e) {
          this.$store.dispatch("endLoading");
          this.error = "An error occurred. Are you sure your email is correct?";
          console.error(e);
        }
      } else {
        this.$store.dispatch("endLoading");
        this.error = "You cannot reset the password for the demo account";
      }
    },
  },
};
</script>
