<template>
    <div>
        <div class="grid md:grid-cols-2 gap-8 my-8">
            <card-wrapper
                v-for="(item, index) in content"
                :key="`item_${index}`"
                class="p-8 flex flex-col justify-between"
                noHover
            >
                <img
                    v-if="item.img"
                    :src="require(`@/assets/whats-new/${item.img}`)"
                    :alt="item.title"
                    loading="lazy"
                    class="rounded-lg my-4"
                />
                <div>
                    <txt type="large-body" bold>
                        {{ item.title }}
                    </txt>
                    <txt grey>
                        {{ item.desc }}
                    </txt>
                </div>
            </card-wrapper>
        </div>
        <txt type="large-body" class="mb-4" bold
            >Help us make something better</txt
        >
        <form class="grid gap-4 md:w-1/2" @submit.prevent="newIdea">
            <txt-area
                :info="idea.submitted ? 'Thanks for your great idea' : ''"
                :value="idea.text"
                placeholder="Your Idea"
                @output="(data) => (idea.text = data)"
                required
            />
            <default-button type="submit" aria-label="Submit"
                >Submit</default-button
            >
        </form>
    </div>
</template>

<script lang="ts">
import { baseAPI } from "../../../../api";
import appState from "../../../../store/modules/appState";
import accountStore from "../../../../store/modules/account";
import { Component, Vue } from "vue-property-decorator";
import { WhatsNewItem } from "@/src/store/modules/types";
const emailBuilder = require("../../../../components/js/email");

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "../../../../components/generic/CardWrapper.vue"
    );

@Component({
    components: {
        CardWrapper,
    },
})
export default class WhatsNewModal extends Vue {
    content: WhatsNewItem[] = [
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
    ];

    idea: { text: string; submitted: boolean } = {
        text: "",
        submitted: false,
    };

    get versionName() {
        return appState.versionName;
    }
    get versionBuild() {
        return appState.versionBuild;
    }
    get claims() {
        return accountStore.claims;
    }

    /** Updates the version stored in local storage. */
    updateVersion() {
        localStorage.setItem("versionBuild", this.versionBuild);
        appState.setNewBuild(false);
    }

    /** Sends us an email when a user submits a new idea. */
    async newIdea() {
        await baseAPI.post("/.netlify/functions/send-email", {
            to: "hello@traininblocks.com",
            ...emailBuilder("new-idea", {
                idea_text: this.idea.text,
                email: this.claims?.email,
            }),
        });
        this.idea.submitted = true;
        this.idea.text = "";
        setTimeout(() => {
            this.idea.submitted = false;
        }, 3000);
    }
}
</script>
