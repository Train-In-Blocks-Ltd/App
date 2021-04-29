<style>
/* Active route */
.nav_item a.router-link-exact-active svg {
  background: var(--base)
}
.nav_item:hover a.router-link-exact-active svg {
  transition: none;
  transform: none
}
.nav_item a.router-link-exact-active svg path {
  fill: var(--fore)
}
</style>

<style scoped>
@import '../assets/styles/icon-anim';

/* Nav bar */
#sidebar {
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem 1rem;
  position: fixed;
  background-color: var(--fore);
  box-shadow: var(--low_shadow);
  border-radius: 10px 10px 0 0;
  transition: width .6s cubic-bezier(.165, .84, .44, 1)
}
.nav_item {
  display: flex;
  cursor: pointer;
  font-size: 1rem;
  margin: .8rem 0;
  transition: var(--transition_standard)
}
.nav_item:empty {
  display: none
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
  text-decoration: none;
  opacity: var(--light_opacity);
  transition: var(--transition_standard)
}
.nav_item__text {
  white-space: nowrap;
  user-select: none;
  color: var(--base);
  text-decoration: none;
  position: relative;
  border: 0;
  opacity: 0;
  height: fit-content;
  margin: auto 0;
  transition: var(--transition_standard)
}
.nav_item__icon {
  margin: 0 .4rem 0 0;
  vertical-align: bottom;
  padding: .2rem;
  border-radius: 5px;
  height: 1.8rem;
  width: 1.8rem;
  transition: var(--transition_standard)
}

/* Responsive */
@media (min-width: 769px) {
  #sidebar {
    top: 0;
    height: 100vh;
    min-height: 100%;
    width: calc(38px + 2rem);
    border-radius: 0
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
    height: 3.6rem
  }
  .nav_item a.router-link-exact-active {
    background-color: var(--base);
    border-radius: 10px 10px 0 0
  }
  .nav_item__text {
    display: none
  }
  .nav_item__icon {
    margin: .8rem auto
  }
}
@media (prefers-reduced-motion: reduce) and (min-width: 769px) {
  #sidebar {
    width: 12rem
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
    <div
      v-for="(nav, navIndex) in navLinks"
      :key="`nav_${navIndex}`"
      class="nav_item"
    >
      <a
        v-if="nav.name === 'Log out'"
        :href="nav.link"
        :title="nav.name"
        @click="logout()"
      >
        <inline-svg :src="require(`../assets/svg/${nav.svg}`)" class="nav_item__icon fadeIn" :aria-label="nav.name" />
        <p class="nav_item__text">
          {{ nav.name }}
        </p>
      </a>
      <router-link
        v-else-if="nav.forUser.includes(claims.user_type) && nav.internal && (nav.name === 'Account' ? claims.email !== 'demo@traininblocks.com' : true)"
        :to="nav.link"
        :title="nav.name"
      >
        <inline-svg :src="require(`../assets/svg/${nav.svg}`)" class="nav_item__icon fadeIn" :aria-label="nav.name" />
        <p class="nav_item__text">
          {{ nav.name }}
        </p>
      </router-link>
      <a
        v-else-if="nav.forUser.includes(claims.user_type) && nav.name !== 'Account'"
        :href="nav.link"
        :title="nav.name"
        target="_blank"
        rel="noreferrer"
      >
        <inline-svg :src="require(`../assets/svg/${nav.svg}`)" class="nav_item__icon fadeIn" :aria-label="nav.name" />
        <p class="nav_item__text">
          {{ nav.name }}
        </p>
      </a>
    </div>
  </nav> <!-- #sidebar -->
</template>

<script>
export default {
  props: {
    authenticated: Boolean,
    claims: Object
  },
  data () {
    return {
      navLinks: [
        { name: 'Home', link: '/', svg: 'home.svg', forUser: ['Admin', 'Trainer'], internal: true },
        { name: 'Home', link: '/clientUser', svg: 'home.svg', forUser: ['Client'], internal: true },
        { name: 'Client', link: '/clientUser', svg: 'home.svg', forUser: ['Admin'], internal: true },
        { name: 'Help', link: 'https://traininblocks.com/help/', svg: 'help-desk.svg', forUser: ['Admin', 'Trainer'], internal: false },
        { name: 'Templates', link: '/templates', svg: 'templates.svg', forUser: ['Admin', 'Trainer'], internal: true },
        { name: 'Portfolio', link: '/portfolio', svg: 'portfolio.svg', forUser: ['Admin', 'Trainer'], internal: true },
        { name: 'Archive', link: '/archive', svg: 'archive.svg', forUser: ['Admin', 'Trainer'], internal: true },
        { name: 'Account', link: '/account', svg: 'account.svg', forUser: ['Admin', 'Trainer'], internal: true },
        { name: 'Log out', link: 'javascript:void(0)', svg: 'logout.svg', forUser: ['Admin', 'Trainer', 'Client'], internal: true }
      ]
    }
  },
  methods: {

    // Auth
    async logout () {
      await this.$parent.$auth.signOut()
      await this.$parent.is_authenticated()
      localStorage.clear()
      localStorage.setItem('versionBuild', this.versionBuild)
      const COOKIES = document.cookie.split(';')
      for (let i = 0; i < COOKIES.length; i++) {
        const COOKIE = COOKIES[i]
        const EQ_POS = COOKIE.indexOf('=')
        const NAME = EQ_POS > -1 ? COOKIE.substr(0, EQ_POS) : COOKIE
        document.cookie = NAME + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
      this.$ga.event('Auth', 'logout')
    }
  }
}
</script>
