<style lang="scss" scoped>
.update_wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 4rem;
  margin-bottom: 4rem;
  .update_item {
    display: grid;
    align-content: space-between;
    background-color: var(--fore);
    border: 3px solid var(--base);
    border-radius: 10px;
    padding: 2rem;
    img {
      width: 100%;
      border-radius: 10px;
      margin: 1rem 0;
    }
  }
}
textarea {
  min-height: 6rem;
}
.success {
  color: var(--base_green);
}
@media (max-width: 736px) {
  .update_wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .update_item {
    padding: 0.8rem;
  }
}
</style>

<template>
  <div class="bottom_margin">
    <inline-svg
      class="close_icon cursor"
      :src="require('../assets/svg/close.svg')"
      aria-label="Close"
      @click="
        ($parent.isWhatsNewOpen = false), willBodyScroll(true), updateVersion()
      "
    />
    <h2>{{ versionName }} {{ versionBuild }}</h2>
    <p class="text--small grey">Bookings, client profile, style, and more</p>
    <br /><br />
    <div class="update_wrapper">
      <div
        v-for="(item, index) in content"
        :key="`item_${index}`"
        class="update_item"
      >
        <img
          v-if="item.img"
          :src="require(`../assets/whats-new/${item.img}`)"
          :alt="item.title"
          loading="lazy"
        />
        <div>
          <h3>
            {{ item.title }}
          </h3>
          <p class="grey">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
    <h3>Help us make something better</h3>
    <br />
    <form class="form_grid" @submit.prevent="newIdea()">
      <textarea
        v-model="idea.idea_text"
        placeholder="Your Idea"
        class="width_300"
        required
      />
      <div class="form_button_bar">
        <button type="submit">Submit</button>
      </div>
      <p v-if="idea.submitted" class="success">Thanks for your idea!</p>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
const emailBuilder = require("./js/email");

export default {
  data() {
    return {
      content: [
        /*
        {
          title: 'Stripe payments',
          desc: 'Yes. You now have the ability to connect your Stripe account and take payments from your clients.',
          img: 'payments.png'
        },
        */
        {
          title: "Bookings",
          desc: "On your client's profile page, you can now schedule bookings wherever or whenever they may be. Your client will also have the ability to request bookings; you will be able to accept or reject their request.",
          img: "bookings.png",
        },
        {
          title: "Client profile",
          desc: "From their home page, they can add a profile picture, change their details, and request bookings.",
          img: "profile.png",
        },
        {
          title: "Calendar links",
          desc: "You can now obtain a link to view current bookings using your calendar of choice (Google, Apple, Microsoft, etc).",
          img: "calendar.png",
        },
        {
          title: "Referral discounts",
          desc: "We like to reward your loyalty. Get others on-board and we will give you a permanent discount on your subscription. The trainer you refer will also recieve a discount as an incentive.",
          img: "referral.png",
        },
        {
          title: "Stats table",
          desc: "Get more information from each session and programme. We've added a table which summarises the data shown in the graph with the date and session it occured at.",
          img: "stats.png",
        },
        {
          title: "Updated UI",
          desc: "Of course, a new update means a better user interface and experience. We've taken the time to listen to our user's feedback and have made some changes accordingly.",
          img: "new-design.png",
        },
        {
          title: "Offline support",
          desc: "If you lose connection whilst managing your clients and programmes, Train In Blocks will now attempt to retry and give you access to some functions offline.",
          img: "offline.png",
        },
        {
          title: "Faster and smaller",
          desc: "A lot of 'under-the-hood' changes made which improved the speed and size of Train In Blocks.",
          img: "",
        },
      ],
      idea: {
        idea_text: "",
        submitted: false,
      },
    };
  },
  computed: mapState(["versionName", "versionBuild"]),
  methods: {
    // -----------------------------
    // General
    // -----------------------------

    /**
     * Updates the version stored in local storage.
     */
    updateVersion() {
      localStorage.setItem("versionBuild", this.versionBuild);
      this.$store.commit("setData", {
        attr: "newBuild",
        data: false,
      });
    },
    /**
     * Sends us an email when a user submits a new idea
     */
    async newIdea() {
      await this.$axios.post("/.netlify/functions/send-email", {
        to: "hello@traininblocks.com",
        ...emailBuilder("new-idea", {
          idea_text: this.idea.idea_text,
          email: this.$parent.$parent.claims.email,
        }),
      });
      this.idea.submitted = true;
      this.idea.idea_text = "";
    },
  },
};
</script>
