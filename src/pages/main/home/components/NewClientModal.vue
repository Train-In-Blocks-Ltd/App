<template>
  <form
    name="add_client"
    class="form_grid add_client"
    spellcheck="false"
    @submit.prevent="
      () => {
        createClient();
        $store.dispatch('closeModal');
        willBodyScroll(true);
      }
    "
  >
    <txt-input
      type="text"
      autocomplete="name"
      placeholder="Name*"
      aria-label="Name"
      :value="newClient.name"
      :on-input="checkForm()"
      @output="(data) => (newClient.name = data)"
      focusFirst
      required
    />
    <txt-input
      type="text"
      autocomplete="email"
      placeholder="Email*"
      aria-label="Email"
      :value="newClient.email"
      :on-input="checkForm()"
      @output="(data) => (newClient.email = data)"
      required
    />
    <txt-input
      type="text"
      autocomplete="email"
      placeholder="Confirm email*"
      aria-label="Confirm email"
      :value="newClient.confirm"
      :error="
        newClient.email !== newClient.confirm ? 'Email does\'t match' : ''
      "
      :on-input="checkForm()"
      @output="(data) => (newClient.confirm = data)"
      required
    />
    <txt-input
      type="tel"
      inputmode="tel"
      autocomplete="tel"
      placeholder="Mobile"
      aria-label="Mobile"
      pattern="\d+"
      :value="newClient.number"
      :on-input="checkForm()"
      @output="(data) => (newClient.number = data)"
    />
    <default-button
      :is-disabled="
        disableCreateClientButton ||
        newClient.email === '' ||
        newClient.email !== newClient.confirm
      "
      type="submit"
    >
      Save
    </default-button>
  </form>
</template>

<script>
import { mapState } from "vuex";

const TxtInput = () =>
  import(
    /* webpackChunkName: "components.txtInput", webpackPrefetch: true  */ "@/components/elements/TxtInput"
  );
const DefaultButton = () =>
  import(
    /* webpackChunkName: "components.defaultButton", webpackPrefetch: true  */ "@/components/elements/DefaultButton"
  );

export default {
  components: {
    TxtInput,
    DefaultButton,
  },
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
  methods: {
    checkForm() {
      this.disableCreateClientButton = !(
        this.newClient.name &&
        this.newClient.email &&
        this.newClient.confirm
      );
    },

    createClient() {
      if (this.newClient.email === this.claims.email) {
        this.$store.dispatch("openResponsePopUp", {
          title: "You cannot create a client with your own email address!",
          description: "Please use a different one.",
          persist: true,
          backdrop: true,
        });
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
          this.$store.dispatch("openResponsePopUp", {
            title: `Added ${this.newClient.name}`,
            description: "Well done on getting a new client",
          });
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