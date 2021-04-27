<style scoped>
.profile_container {
  text-align: center
}
.profile_container svg {
  padding: 1.8rem;
  height: 140px;
  width: 140px;
  border: 4px solid var(--base);
  border-radius: 50%;
  margin: 0 auto
}
.profile_container .client_email {
  margin: 2rem 0
}

@media (max-width: 576px) {
  .profile_container button {
    width: 100%
  }
}
</style>

<template>
  <div class="profile_container">
    <div class="profile_img">
      <img v-if="img !== ''" :src="img" alt="Profile img">
      <inline-svg
        v-else
        :src="require('../assets/svg/profile-image.svg')"
        class="img_icon cursor"
      />
    </div>
    <h3 class="client_email">
      {{ claims.email }}
    </h3>
    <button class="red_button" @click="$parent.isProfileOpen = false, will_body_scroll(true)">
      Close
    </button>
  </div>
</template>

<script>
export default {
  props: {
    img: String,
    claims: Object
  }
}
</script>
