<style lang="scss" scoped>
.add_client {
  label {
    display: grid;
    grid-gap: 0.5rem;
  }
}
</style>

<template>
  <form
    name="add_client"
    class="form_grid add_client"
    spellcheck="false"
    @submit.prevent="
      createClient(), ($parent.isNewClientOpen = false), willBodyScroll(true)
    "
  >
    <div class="bottom_margin">
      <h3>Add a new client and email them access</h3>
      <p class="grey">
        Make sure that you have the correct email address, you won't be able to
        change it after
      </p>
    </div>
    <input
      ref="name"
      :value="newClient.name"
      class="small_border_radius width_300"
      type="text"
      autocomplete="name"
      placeholder="Name*"
      aria-label="Name"
      required
      @input="(newClient.name = $event.target.value), checkForm()"
    />
    <input
      :value="newClient.email"
      class="small_border_radius width_300"
      type="email"
      autocomplete="email"
      placeholder="Email*"
      aria-label="Email"
      required
      @input="(newClient.email = $event.target.value), checkForm()"
    />
    <input
      :value="newClient.confirm"
      :style="{
        borderColor:
          newClient.email !== newClient.confirm ? 'var(--base_red)' : '',
      }"
      class="small_border_radius width_300"
      type="email"
      autocomplete="email"
      placeholder="Confirm email*"
      aria-label="Confirm email"
      required
      @input="(newClient.confirm = $event.target.value), checkForm()"
    />
    <input
      :value="newClient.number"
      class="small_border_radius width_300"
      type="tel"
      inputmode="tel"
      autocomplete="tel"
      placeholder="Mobile"
      aria-label="Mobile"
      pattern="\d+"
      @input="(newClient.number = $event.target.value), checkForm()"
    />
    <div class="form_button_bar">
      <button
        :disabled="
          disableCreateClientButton ||
          newClient.email === '' ||
          newClient.email !== newClient.confirm
        "
        type="submit"
      >
        Save
      </button>
      <button
        class="red_button"
        @click.prevent="($parent.isNewClientOpen = false), willBodyScroll(true)"
      >
        Close
      </button>
    </div>
  </form>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      newClient: {
        name: "",
        email: "",
        confirm: "",
        number: "",
        notes: "",
      },
      disableCreateClientButton: true,
    };
  },
  computed: mapState(["claims"]),
  mounted() {
    this.$refs.name.focus();
  },
  methods: {
    // -----------------------------
    // General
    // -----------------------------

    checkForm() {
      this.disableCreateClientButton = !(
        this.newClient.name &&
        this.newClient.email &&
        this.newClient.confirm
      );
    },

    /**
     * Creates a new client.
     */
    createClient() {
      if (this.newClient.email === this.claims.email) {
        this.$parent.$parent.$refs.response_pop_up.show(
          "You cannot create a client with your own email address!",
          "Please use a different one.",
          true,
          true
        );
        console.error(
          "You cannot create a client with your own email address!"
        );
      } else {
        try {
          this.$store.commit("setData", {
            attr: "dontLeave",
            data: true,
          });
          this.$store.dispatch("createClient", {
            name: this.newClient.name,
            pt_id: this.claims.sub,
            email: this.newClient.email,
            number: this.newClient.number,
            notes: this.newClient.notes,
          });
          this.$parent.$parent.$refs.response_pop_up.show(
            `Added ${this.newClient.name}`,
            "Well done on getting a new client"
          );
          this.$parent.persistResponse = this.newClient.name;
          this.newClient = {
            name: "",
            email: "",
            confirm: "",
            number: "",
            notes: "",
          };
          this.$ga.event("Client", "new");
          this.$store.dispatch("endLoading");
        } catch (e) {
          this.$parent.$parent.resolveError(e);
        }
      }
    },
  },
};
</script>
