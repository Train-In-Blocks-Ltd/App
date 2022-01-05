<style lang="scss">
#okta-signin-container {
  position: relative;
  #okta-sign-in {
    outline: none;
    margin-left: 0;
    #okta-signin-submit {
      outline: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      position: absolute;
      user-select: none;
      cursor: pointer;
      border-radius: 5px;
      opacity: 1;
      text-transform: capitalize;
      border: none;
      padding: 0.6rem 1.6rem;
      font-size: 0.8rem;
      color: white;
      background-color: var(--base);
      margin: 0.6rem 0;
      transition: opacity 0.2s,
        transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
      &:hover {
        opacity: var(--light_opacity);
      }
      &:active {
        transform: var(--active_state);
      }
      &:focus {
        box-shadow: 0 0 0 4px rgba(76, 91, 106, 0.5);
      }
    }
  }
}
.o-form-button-bar {
  margin-top: 1.25rem;
}
.okta-form-title {
  display: none;
}
.auth-org-logo {
  margin: 2rem 0;
}
.auth-org-logo.logo > path {
  fill: var(--base);
}
.okta-form-label {
  text-align: left;
}
#okta-signin-username,
#okta-signin-password {
  margin: 0.8rem 0;
  font-size: 1rem;
  border-radius: 5px;
}
.okta-form-input-error {
  width: 100%;
  color: #eb5757;
  margin-top: 0.4rem;
  margin-bottom: 1.4rem;
  font-size: 0.75rem;
  text-align: left;
}
.o-form-input-name-username {
  width: 100%;
}
.o-form-input-name-remember {
  text-align: left;
  font-size: 0.9rem;
}
.o-form-fieldset-container {
  display: grid;
  grid-gap: 1.5rem;
  margin: 2rem 0;
}
.custom-checkbox {
  label {
    padding-left: 4px;
  }
  &:after {
    content: "Please remember to manually logout if this is a shared computer.";
    display: block;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    padding-left: calc(4px + 13px + 4px + 3px);
  }
}

@media (max-width: 576px) {
  .okta-form-label {
    font-size: 1.5rem;
  }
}
.auth-footer {
  display: none;
}
</style>

<style lang="scss" scoped>
a {
  font-weight: bold;
  text-decoration: none;
  color: var(--base);
  transition: var(--transition_standard);
  &:hover {
    opacity: var(--light_opacity);
  }
}
#login {
  text-align: left;
  margin: auto;
  padding: 6rem 4rem;
  width: 550px;
  .demo-details {
    display: flex;
    width: fit-content;
  }
  .other-options {
    display: grid;
    grid-gap: 1rem;
    margin-top: 4rem;
    .inline-link {
      display: flex;
      > a {
        margin-left: 0.4rem;
      }
    }
  }
  .cookies {
    margin: 2rem 0;
  }
  .recovery {
    margin-top: 6rem;
    margin-bottom: 1rem;
    > .txt_input {
      margin-bottom: 1rem;
    }
  }
}

@media (max-width: 576px) {
  a:hover {
    opacity: 1;
  }
  #login {
    width: 100%;
    padding: 1.6rem;
    height: 100%;
    overflow-y: auto;
  }
  .cookies {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>

<template>
  <div v-if="!authenticated" id="login">
    <splash v-if="!splashed" />
    <inline-svg
      :src="require('@/assets/svg/full-logo.svg')"
      class="auth-org-logo"
    />
    <a
      class="demo-details"
      href="javascript:void(0)"
      @click="showDemo = !showDemo"
    >
      <txt bold>
        {{ showDemo ? "Hide" : "Show demo account details" }}
      </txt>
    </a>
    <div v-if="showDemo" class="demo_details">
      <div class="info">demo@traininblocks.com</div>
      <div class="info">testingaccount123</div>
    </div>
    <div id="okta-signin-container" />
    <form v-if="open" class="recovery" @submit.prevent="reset">
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
    <div class="other-options">
      <txt class="inline-link">
        Need an account?
        <a href="https://traininblocks.com/#pricing">
          <txt>Sign up here</txt>
        </a>
      </txt>
      <txt v-if="!open" class="inline-link">
        Forgot your password?
        <a href="javascript:(0)" @click="open = !open">
          <txt>Reset it here</txt>
        </a>
      </txt>
    </div>
    <txt type="tiny" class="cookies">
      By logging in and using this application you agree that essential
      first-party cookies will be placed on your computer. Non-essential third
      party cookies may also be placed but can be opted out of from your account
      page. For more information please read our
      <a href="https://traininblocks.com/legal/cookies-policy/">Cookie Policy</a
      >.
    </txt>
    <div class="version">
      <inline-svg
        :src="require('@/assets/svg/andromeda-icon.svg')"
        aria-label="Andromeda"
      />
      <txt type="tiny" bold> {{ versionName }} {{ versionBuild }} </txt>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Splash from "@/components/Splash";
const CUSTOM_ENV =
  process.env.NODE_ENV === "production"
    ? require("../../../../config/prod.env")
    : require("../../../../config/dev.env");

export default {
  components: {
    Splash,
  },
  data() {
    return {
      showDemo: false,
      splashed: false,
      open: false,
      email: null,
      id: null,
      error: null,
      success: null,
    };
  },
  computed: mapState(["authenticated", "versionName", "versionBuild"]),
  async mounted() {
    const scopes = ["openid", "profile", "email"];
    let OktaSignIn;
    await import(
      /* webpackChunkName: "okta.signin", webpackPreload: true  */ "@okta/okta-signin-widget/dist/js/okta-sign-in.no-polyfill.min.js"
    ).then((module) => {
      OktaSignIn = module.default;
    });
    this.splashed = true;
    this.willBodyScroll(true);
    this.$nextTick(function () {
      this.widget = new OktaSignIn({
        baseUrl: CUSTOM_ENV.OKTA.CLIENT_ID,
        issuer: CUSTOM_ENV.OKTA.ISSUER + "/oauth2/default",
        clientId: CUSTOM_ENV.OKTA.CLIENT_ID,
        redirectUri:
          window.location.host === "localhost:8080"
            ? "http://" + window.location.host + "/implicit/callback"
            : "https://" + window.location.host + "/implicit/callback",
        i18n: {
          en: {
            "primaryauth.title": "",
            "primaryauth.username.placeholder": "Email",
            "primaryauth.username.tooltip": "Enter your email",
            "primaryauth.password.placeholder": "Password",
            "primaryauth.password.tooltip": "Enter your password",
            "error.username.required": "Please enter your email",
            "errors.E0000004": "That didn't work. Was your password correct?",
          },
        },
        authParams: {
          pkce: true,
          display: "page",
          issuer: CUSTOM_ENV.OKTA.ISSUER + "/oauth2/default",
          scopes,
          tokenManager: {
            autoRenew: true,
            expireEarlySeconds: 120,
          },
        },
      });
      const self = this;
      this.widget
        .showSignInToGetTokens({
          el: "#okta-signin-container",
          scopes,
        })
        .then(async (tokens) => {
          self.splashed = false;
          await this.$auth.handleLoginRedirect(tokens);
        })
        .catch((err) => {
          throw err;
        });
    });
    if (await this.$auth.isAuthenticated()) {
      this.$router.push("/");
    } else {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  },
  async beforeDestroy() {
    await this.$parent.isAuthenticated();
    await this.$parent.setup();
    if (this.$ga && !this.authenticated) {
      this.$ga.event("Auth", "login");
    }
  },
  methods: {
    /**
     * Resets the app state.
     */
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
