<style lang="scss" scoped>
.client-home-header-buttons {
  display: flex;
  justify-content: space-between;
  .email-bar {
    display: flex;
    margin: auto 0;
    .email {
      margin-left: 0.6rem;
    }
  }
  .options {
    display: flex;
    .archive-button,
    .toolkit-button {
      margin-right: 1rem;
    }
  }
}
</style>

<template>
  <div class="client-home-header-buttons">
    <div class="email-bar">
      <inline-svg :src="require('@/assets/svg/email.svg')" />
      <p class="email">
        {{ clientDetails.email }}
      </p>
    </div>
    <div class="options">
      <icon-button
        svg="archive"
        :on-click="
          () => {
            clientArchive($route.params.client_id);
          }
        "
        :icon-size="28"
        class="archive-button"
      />
      <icon-button
        svg="calculate"
        :on-click="
          () => {
            $store.dispatch('openModal', {
              name: 'toolkit',
              size: 'lg',
            });
            willBodyScroll(false);
          }
        "
        :icon-size="28"
        class="toolkit-button"
      />
      <button
        v-if="clientAlreadyMsg === 'Restricted'"
        class="verify-button button"
        :disabled="clientAlready"
        @click="giveAccess()"
      >
        {{ clientAlreadyMsg }}
      </button>
      <button
        v-else-if="
          clientAlready &&
          clientAlreadyMsg !== 'Loading...' &&
          clientAlreadyMsg !== 'Error'
        "
        class="verify-button fadeIn"
        @click="
          (clientDetails.notifications =
            clientDetails.notifications === 1 ? 0 : 1),
            updateClient()
        "
      >
        {{ clientDetails.notifications === 1 ? "Disable" : "Enable" }}
        email notifications
      </button>
      <button
        v-else
        class="verify-button button"
        :disabled="clientAlready"
        @click="giveAccess()"
      >
        {{ clientAlreadyMsg }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

const emailBuilder = require("@/components/js/email");

const CUSTOM_ENV =
  process.env.NODE_ENV === "production"
    ? require("@/../config/prod.env")
    : require("@/../config/dev.env");

export default {
  data() {
    return {
      clientAlreadyMsg: "Loading...",
      clientAlready: true,
      clientSuspend: null,
    };
  },
  computed: mapState(["clientDetails"]),
  methods: {
    async giveAccess() {
      this.$store.commit("setData", {
        attr: "dontLeave",
        data: true,
      });
      try {
        if (this.clientAlreadyMsg === "Resend activation email") {
          const OKTA_ONE = await this.$axios.post("/.netlify/functions/okta", {
            type: "GET",
            url: `?filter=profile.email+eq+"${this.clientDetails.email}"&limit=1`,
          });
          const OKTA_TWO = await this.$axios.post("/.netlify/functions/okta", {
            type: "POST",
            body: {},
            url: `${OKTA_ONE.data[0].id}/lifecycle/reactivate?sendEmail=false`,
          });
          await this.$axios.post("/.netlify/functions/send-email", {
            to: this.clientDetails.email,
            ...emailBuilder("activate-account", {
              link: OKTA_TWO.data.activationUrl.replace(
                CUSTOM_ENV.OKTA.ISSUER,
                "https://auth.traininblocks.com"
              ),
            }),
          });
        } else if (this.clientSuspend) {
          await this.$axios.post("/.netlify/functions/okta", {
            type: "POST",
            body: {},
            url: `${this.clientSuspend}/lifecycle/unsuspend`,
          });
          const PASSWORD = await this.$axios.post("/.netlify/functions/okta", {
            type: "POST",
            body: {},
            url: `${this.clientSuspend}/lifecycle/reset_password?sendEmail=false`,
          });
          await this.$axios.post("/.netlify/functions/send-email", {
            to: this.clientDetails.email,
            ...emailBuilder("client-account-reactivated", {
              link: PASSWORD.data.resetPasswordUrl.replace(
                CUSTOM_ENV.OKTA.ISSUER,
                "https://auth.traininblocks.com"
              ),
            }),
          });
        } else {
          const OKTA_ONE = await this.$axios.post("/.netlify/functions/okta", {
            type: "POST",
            body: {
              profile: {
                firstName: this.clientDetails.email,
                email: this.clientDetails.email,
                login: this.clientDetails.email,
                ga: true,
                client_id_db: this.clientDetails.client_id,
                user_type: "Client",
              },
              groupIds: ["00gf929legrtSjxOe4x6"],
            },
            url: "?activate=false",
          });
          const OKTA_TWO = await this.$axios.post("/.netlify/functions/okta", {
            type: "POST",
            body: {},
            url: `${OKTA_ONE.data.id}/lifecycle/activate?sendEmail=false`,
          });
          await this.$axios.post("/.netlify/functions/send-email", {
            to: this.clientDetails.email,
            ...emailBuilder("activate-account", {
              link: OKTA_TWO.data.activationUrl.replace(
                CUSTOM_ENV.OKTA.ISSUER,
                "https://auth.traininblocks.com"
              ),
            }),
          });
        }
      } catch (e) {
        this.$parent.resolveError(e);
      }
      await this.checkClient();
      this.$store.dispatch("openResponsePopUp", {
        title: "An activation email was sent to your client",
        description: "Please ask them to check their inbox",
        persist: true,
        backdrop: true,
      });
      this.$store.dispatch("endLoading");
    },

    async checkClient() {
      if (this.$parent.claims.email !== "demo@traininblocks.com") {
        this.clientAlreadyMsg = "Loading...";
        try {
          const RESULT = await this.$axios.post("/.netlify/functions/okta", {
            type: "GET",
            url: `?filter=profile.email+eq+"${this.clientDetails.email}"&limit=1`,
          });
          if (RESULT.data.length > 0) {
            switch (RESULT.data[0].status) {
              case "ACTIVE":
                this.clientAlready = true;
                this.clientAlreadyMsg = "User activated";
                break;
              case "PROVISIONED":
              case "RECOVERY":
                this.clientAlready = false;
                this.clientAlreadyMsg = "Resend activation email";
                break;
              case "SUSPENDED":
                this.clientSuspend = RESULT.data[0].id;
                this.clientAlready = false;
                this.clientAlreadyMsg = "Give Access";
                break;
            }
          } else {
            this.clientAlready = false;
            this.clientAlreadyMsg = "Give Access";
          }
        } catch (e) {
          this.clientAlready = true;
          this.clientAlreadyMsg = "Error";
          this.$parent.resolveError(e);
        }
      } else {
        this.clientAlreadyMsg = "Restricted";
      }
    },

    /**
     * Updates the client.
     */
    async updateClient() {
      try {
        this.$store.commit("setData", {
          attr: "silentLoading",
          data: true,
        });
        this.$store.commit("setData", {
          attr: "dontLeave",
          data: true,
        });
        await this.$store.dispatch("updateClient");
        this.$store.dispatch("endLoading");
      } catch (e) {
        this.$parent.resolveError(e);
      }
    },

    /**
     * Archives the client.
     * @param {integer} clientId - The id of the client.
     */
    async clientArchive(clientId) {
      if (
        await this.$parent.$parent.$parent.$refs.confirm_pop_up.show(
          "Are you sure that you want to archive/hide this client?",
          "Their data will be stored, but it will be removed if deleted from the Archive."
        )
      ) {
        try {
          this.$store.commit("setData", {
            attr: "dontLeave",
            data: true,
          });
          await this.$store.dispatch("clientArchive", clientId);
          this.$ga.event("Client", "archive");
          this.$store.dispatch("openResponsePopUp", {
            title: "Client archived",
            description: "Their data will be kept safe on the archive page",
          });
          this.$store.dispatch("endLoading");
          this.$router.push("/");
        } catch (e) {
          this.$parent.resolveError(e);
        }
      }
    },
  },
};
</script>
