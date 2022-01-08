<style lang="scss" scoped>
.instructions {
    margin-top: 2rem;
    .img_container {
        display: flex;
        margin-top: 2rem;
        img {
            border-radius: 10px;
            width: 25%;
            &:first-child {
                margin-right: 1rem;
            }
        }
    }
}
.install_bottom_bar {
    margin-top: 2rem;
}

@media (max-width: 1440px) {
    .instructions {
        .img_container {
            img {
                width: 30%;
            }
        }
    }
}
@media (max-width: 992px) {
    .instructions {
        .img_container {
            img {
                width: 40%;
            }
        }
    }
}
@media (max-width: 768px) {
    .instructions {
        .img_container {
            display: grid;
            grid-gap: 2rem;
            margin: 4rem 0;
            img {
                width: 100%;
                &:first-child {
                    margin-right: 0;
                }
            }
        }
    }
    .install_bottom_bar {
        display: grid;
        grid-gap: 1rem;
        button {
            width: 100%;
        }
    }
}
</style>

<template>
    <div>
        <div v-if="pwa.canInstall">
            <txt bold>Add Train In Blocks to your home screen</txt>
            <txt grey>Access it quickly with a clearer interface</txt>
        </div>
        <div v-else-if="pwa.installed">
            <txt bold>You have Train In Blocks installed already!</txt>
            <txt grey>Launch it or keep using it in the browser</txt>
        </div>
        <div v-else-if="!pwa.canInstall">
            <txt bold>Add Train In Blocks to your home screen</txt>
            <txt grey>or continue using it in the browser</txt>
            <div class="instructions">
                <txt bold>For Safari</txt>
                <txt
                    >1. Open the <i>Share</i> menu at the bottom of the
                    screen</txt
                >
                <txt>2. Select <i>Add to Home Screen</i></txt>
                <div class="img_container">
                    <img
                        :src="require('@/assets/install/1.jpg')"
                        alt="Open share menu"
                        loading="lazy"
                    />
                    <img
                        :src="require('@/assets/install/2.jpg')"
                        alt="Add to home screen"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
        <div class="install_bottom_bar">
            <default-button v-if="pwa.canInstall" :on-click="handleInstall">
                Install
            </default-button>
            <a
                v-else-if="!pwa.canInstall && pwa.installed"
                href="https://app.traininblocks.com"
                target="_blank"
            >
                <default-button>Launch</default-button>
            </a>
            <default-button
                v-if="pwa.canInstall || pwa.installed"
                theme="red"
                :on-click="handleClose"
            >
                Close
            </default-button>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(["pwa"]),
    methods: {
        handleInstall() {
            // Show the install prompt
            this.pwa.deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            this.pwa.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    // Hide the app provided install promotion
                    this.$store.commit("setDataDeep", {
                        attrParent: "pwa",
                        attrChild: "canInstall",
                        data: false,
                    });
                    this.$store.commit("setDataDeep", {
                        attrParent: "pwa",
                        attrChild: "displayMode",
                        data: "standalone",
                    });
                } else {
                    this.$store.commit("setDataDeep", {
                        attrParent: "pwa",
                        attrChild: "canInstall",
                        data: true,
                    });
                }
            });
            this.$store.dispatch("closeModal");
            this.willBodyScroll(true);
        },
    },
    handleClose() {
        $store.dispatch("closeModal");
        willBodyScroll(true);
    },
};
</script>
