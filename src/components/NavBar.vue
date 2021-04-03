<style scoped>
#sidebar {
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem 1rem;
  position: fixed;
  background-color: var(--fore);
  box-shadow: var(--low_shadow);
  transition: width .6s cubic-bezier(.165, .84, .44, 1)
}
.nav_item {
  display: flex;
  opacity: .6;
  cursor: pointer;
  font-size: 1rem;
  margin: .8rem 0;
  transition: var(--transition_standard)
}
.nav_item:hover,
#sidebar:hover .nav_item__text,
.nav_item a.router-link-exact-active {
  opacity: 1
}
.nav_item:last-of-type {
  padding-bottom: 0
}
.nav_item a {
  display: flex;
  text-decoration: none
}
.nav_item__text {
  user-select: none;
  color: var(--base);
  text-decoration: none;
  position: relative;
  border: 0;
  opacity: 0;
  transition: var(--transition_standard)
}
.nav_item__icon {
  margin: 0 .4rem 0 0;
  height: 1.4rem;
  vertical-align: bottom;
  transition: var(--transition_standard)
}

/* Responsive */
@media (min-width: 769px) {
  #sidebar {
    top: 0;
    height: 100vh;
    min-height: 100%;
    width: calc(38px + 2rem)
  }
  #sidebar:hover {
    width: 12rem
  }
  #sidebar:hover main {
    margin-left: 12rem
  }
}
@media (max-width: 768px) {
  .logo {
    display: none
  }
  #sidebar {
    bottom: 0;
    width: 100vw;
    flex-direction: row;
    padding: 0;
    justify-content: space-between;
    border-right: none
  }
  #sidebar:hover .nav_item__text {
    display: none
  }
  .nav_item {
    width: 100%;
    margin: 0;
    padding: 0
  }
  .nav_item a {
    width: 100%;
    height: 4rem
  }
  .nav_item__text {
    display: none
  }
  .nav_item__icon {
    margin: .8rem auto
  }
}
</style>

<template>
  <nav v-if="authenticated && claims" id="sidebar">
    <div class="logo">
      <router-link v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'" to="/" class="logo_link" title="Home">
        <inline-svg :src="require('../assets/svg/logo-icon.svg')" class="logo_svg fadeIn" aria-label="Home" />
      </router-link>
      <router-link v-if="claims.user_type === 'Client'" to="/clientUser" class="logo_link" title="Home">
        <inline-svg :src="require('../assets/svg/logo-icon.svg')" class="logo_svg fadeIn" aria-label="Home" />
      </router-link>
    </div> <!-- .logo -->
    <div class="nav_item">
      <router-link
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        to="/"
        title="Home"
      >
        <inline-svg :src="require('../assets/svg/home.svg')" class="nav_item__icon fadeIn" aria-label="Home" />
        <p class="nav_item__text">
          Home
        </p>
      </router-link>
      <router-link
        v-else-if="claims.user_type === 'Client'"
        to="/clientUser"
        title="Home"
      >
        <inline-svg :src="require('../assets/svg/home.svg')" class="nav_item__icon fadeIn" aria-label="Home" />
        <p class="nav_item__text">
          Home
        </p>
      </router-link>
    </div>
    <div
      v-if="claims.user_type === 'Admin'"
      class="nav_item"
    >
      <router-link
        to="/clientUser"
        title="Client Home"
      >
        <inline-svg :src="require('../assets/svg/home.svg')" class="nav_item__icon fadeIn" aria-label="Client Home" />
        <p class="nav_item__text">
          Client
        </p>
      </router-link>
    </div>
    <div
      v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
      class="nav_item"
    >
      <a href="https://traininblocks.com/help" target="_blank" rel="noopener" title="Help">
        <inline-svg :src="require('../assets/svg/help-desk.svg')" class="nav_item__icon fadeIn" aria-label="Help" />
        <p class="nav_item__text">
          Help
        </p>
      </a>
    </div>
    <div
      v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
      class="nav_item"
    >
      <router-link to="/templates" title="Templates">
        <inline-svg :src="require('../assets/svg/template.svg')" class="nav_item__icon fadeIn" aria-label="Templates" />
        <p class="nav_item__text">
          Templates
        </p>
      </router-link>
    </div>
    <div
      v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
      class="nav_item"
    >
      <router-link to="/portfolio" title="Portfolio">
        <inline-svg :src="require('../assets/svg/portfolio.svg')" class="nav_item__icon fadeIn" aria-label="Portfolio" />
        <p class="nav_item__text">
          Portfolio
        </p>
      </router-link>
    </div>
    <div
      v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
      class="nav_item"
    >
      <router-link to="/archive" title="Archive">
        <inline-svg :src="require('../assets/svg/archive.svg')" class="nav_item__icon fadeIn" aria-label="Archive" />
        <p class="nav_item__text">
          Archive
        </p>
      </router-link>
    </div>
    <div
      v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
      class="nav_item"
    >
      <router-link to="/account" title="Account">
        <inline-svg :src="require('../assets/svg/account.svg')" class="nav_item__icon fadeIn" aria-label="Account" />
        <p class="nav_item__text">
          Account
        </p>
      </router-link>
    </div>
    <div class="nav_item">
      <router-link to="/logout" title="Logout" @click.native="logout()">
        <inline-svg :src="require('../assets/svg/logout.svg')" class="nav_item__icon fadeIn" aria-label="Logout" />
        <p class="nav_item__text">
          Logout
        </p>
      </router-link>
    </div>
  </nav> <!-- #sidebar -->
</template>

<script>
export default {
  props: {
    authenticated: Boolean,
    claims: Array
  }
}
</script>
