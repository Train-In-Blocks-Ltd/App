<style lang="scss" scoped>
.client-detail-header {
  display: grid;
  grid-gap: 2rem;
  .top-content {
    display: grid;
    grid-template-columns: 0.2fr 1fr;
    grid-gap: 1.6rem;
    .image {
      background-size: cover;
      background-position: center;
      height: 140px;
      width: 140px;
      filter: grayscale(0.8);
      border-radius: 50%;
    }
    .image-placeholder {
      padding: 1.8rem;
      height: 140px;
      width: 140px;
      border: 4px solid var(--base);
      border-radius: 50%;
    }
    .client-info {
      display: grid;
      grid-gap: 1rem;
    }
  }
}
</style>

<template>
  <div class="client-detail-header">
    <div class="top-content">
      <div
        v-if="$parent.clientDetails.profile_image"
        :style="{
          backgroundImage: `url(${$parent.clientDetails.profile_image})`,
        }"
        class="image"
      />
      <inline-svg
        v-else
        class="image-placeholder"
        :src="require('@/assets/svg/profile-image.svg')"
      />
      <div class="client-info">
        <input
          v-model="$parent.clientDetails.name"
          class="client-info--name text--large"
          type="text"
          aria-label="Client name"
          autocomplete="name"
          :disabled="silentLoading"
          @blur="updateClient()"
        />
        <input
          id="phone"
          v-model="$parent.clientDetails.number"
          class="input--forms allow_text_overflow"
          placeholder="Mobile"
          aria-label="Mobile"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          minlength="9"
          maxlength="14"
          pattern="\d+"
          :disabled="silentLoading"
          @blur="updateClient()"
        />
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["loading", "silentLoading", "clients", "clientDetails"]),
};
</script>
