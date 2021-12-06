<style lang="scss" scoped>
#success {
  display: grid;
  grid-gap: 2rem;
  .a_link {
    width: fit-content;
    width: -moz-fit-content;
  }
}
</style>

<template>
  <div id="success" class="view_container">
    <txt type="title" isMain>All done...</txt>
    <txt type="large-body" grey>
      Your payment was made successfully, your trainer will be notified.
    </txt>
    <txt grey>Redirecting in {{ timeout }}</txt>
    <txt grey>
      If your browser does not automatically redirect you, please click here...
    </txt>
    <router-link to="/clientUser" class="a_link">
      <b>Back to Train In Blocks</b>
    </router-link>
  </div>
</template>

<script>
import Txt from "../../components/elements/Txt.vue";
export default {
  components: { Txt },
  metaInfo() {
    return {
      title: "Success",
    };
  },
  data() {
    return {
      timeout: 8,
    };
  },
  async created() {
    this.$store.commit("setData", {
      attr: "loading",
      data: true,
    });
    this.willBodyScroll(true);
    await this.$parent.setup();
    await this.$parent.getClientSideData();
    this.$store.dispatch("endLoading");
  },
  mounted() {
    const self = this;
    setInterval(function () {
      self.timeout = self.timeout - 1;
    }, 1000);
    setTimeout(function () {
      self.$router.push("/clientUser");
    }, 8000);
  },
};
</script>
