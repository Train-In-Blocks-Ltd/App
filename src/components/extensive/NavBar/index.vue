<style lang="scss">
@import "../../../assets/styles/icon-anim.scss";

.logo {
  margin-bottom: auto;
  .logo_link {
    display: block;
    width: 38px;
    transition: 1s all cubic-bezier(0.165, 0.84, 0.44, 1);
    &:hover {
      opacity: var(--light_opacity);
    }
    &:active {
      transform: var(--active_state);
    }
  }
}
</style>

<style lang="scss" scoped>
/* Nav bar */
#sidebar {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem 1rem;
  position: fixed;
  background-color: var(--fore);
  box-shadow: var(--low_shadow);
  border-radius: 0 10px 10px 0;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  min-height: calc(100vh - env(safe-area-inset-bottom));
  z-index: 10;
}

@media (max-width: 768px) {
  #sidebar {
    bottom: 0;
    width: 100vw;
    min-height: fit-content;
    min-height: -moz-fit-content;
    flex-direction: row;
    padding: 0;
    justify-content: space-between;
    border-right: none;
    border-radius: 10px 10px 0 0;
    .logo {
      display: none;
    }
  }
}
</style>

<template>
  <nav id="sidebar">
    <div class="logo">
      <router-link
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        to="/"
        class="logo_link"
        title="Home"
      >
        <inline-svg
          :src="require('../../../assets/svg/logo-icon.svg')"
          class="logo_svg fadeIn"
          aria-label="Home"
        />
      </router-link>
      <router-link
        v-if="claims.user_type === 'Client'"
        to="/clientUser"
        class="logo_link"
        title="Home"
      >
        <inline-svg
          :src="require('../../../assets/svg/logo-icon.svg')"
          class="logo_svg fadeIn"
          aria-label="Home"
        />
      </router-link>
    </div>
    <!-- logo -->
    <nav-link
      v-for="(nav, navIndex) in navLinks"
      :key="`nav_link_${navIndex}`"
      :internal="nav.internal"
      :name="nav.name"
      :link="nav.link"
      :svg="nav.svg"
      :forUser="nav.forUser"
      :on-click="nav.onClick"
    />
  </nav>
  <!-- #sidebar -->
</template>

<script>
const NavLink = () =>
  import(
    /* webpackChunkName: "components.navLink", webpackPreload: true  */ "./components/NavLink.vue"
  );

export default {
  components: {
    NavLink,
  },
  props: {
    claims: Object,
  },
  data() {
    return {
      navLinks: [
        {
          name: "Home",
          link: "/",
          svg: "home",
          forUser: ["Admin", "Trainer"],
          internal: true,
        },
        {
          name: "Home",
          link: "/clientUser",
          svg: "home",
          forUser: ["Admin", "Client"],
          internal: true,
        },
        {
          name: "Help",
          link: "https://traininblocks.com/help/",
          svg: "help-desk",
          forUser: ["Admin", "Trainer"],
          internal: false,
        },
        {
          name: "Templates",
          link: "/templates",
          svg: "templates",
          forUser: ["Admin", "Trainer"],
          internal: true,
        },
        {
          name: "Portfolio",
          link: "/portfolio",
          svg: "portfolio",
          forUser: ["Admin", "Trainer"],
          internal: true,
        },
        {
          name: "Archive",
          link: "/archive",
          svg: "archive",
          forUser: ["Admin", "Trainer"],
          internal: true,
        },
        {
          name: "Account",
          link: "/account",
          svg: "account",
          forUser: ["Admin", "Trainer", "Client"],
          internal: true,
        },
        {
          name: "Refresh",
          link: "javascript:void(0)",
          svg: "refresh",
          forUser: ["Admin", "Trainer", "Client"],
          internal: false,
          onClick: this.hardRefresh,
        },
        {
          name: "Log out",
          link: "javascript:void(0)",
          svg: "logout",
          forUser: ["Admin", "Trainer", "Client"],
          internal: false,
          onClick: this.logout,
        },
      ],
    };
  },
  methods: {
    hardRefresh() {
      location.reload();
    },

    /**
     * Logs out the user.
     */
    async logout() {
      if (
        await this.$parent.$refs.confirm_pop_up.show(
          "Are you sure you want to log out?",
          "It's recommended to do so if you are using a public device."
        )
      ) {
        await this.$parent.$auth.signOut();
        await this.$parent.isAuthenticated();
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem("versionBuild", this.$store.state.versionBuild);
        const COOKIES = document.cookie.split(";");
        for (let i = 0; i < COOKIES.length; i++) {
          const COOKIE = COOKIES[i];
          const EQ_POS = COOKIE.indexOf("=");
          const NAME = EQ_POS > -1 ? COOKIE.substr(0, EQ_POS) : COOKIE;
          document.cookie = NAME + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        this.$ga.event("Auth", "logout");
      }
    },
  },
};
</script>
