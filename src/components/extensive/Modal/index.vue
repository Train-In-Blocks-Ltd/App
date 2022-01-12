<template>
    <div v-if="modalOpen" class="flex justify-center w-full">
        <card-wrapper
            class="fixed md:top-16 p-8 md:rounded-lg bg-white z-40 max-h-screen md:max-h-4/5 overflow-y-auto"
            :class="{
                'w-full md:w-10/12': modalSize === 'lg',
                'w-full md:w-3/5': modalSize === 'sm',
            }"
            noHover
            noBorder
        >
            <secondary-header :title="title()">
                <template v-slot:right>
                    <icon-button
                        svg="x"
                        :on-click="() => $store.dispatch('closeModal')"
                        :icon-size="32"
                    />
                </template>
            </secondary-header>
            <new-client-modal v-if="modalContent === 'new-client'" />
            <whats-new-modal v-else-if="modalContent === 'whats-new'" />
            <install-modal v-else-if="modalContent === 'install-pwa'" />
            <reset-password-modal
                v-else-if="modalContent === 'reset-password'"
            />
            <portfolio-modal v-else-if="modalContent === 'portfolio'" />
            <client-user-profile-modal
                v-else-if="modalContent === 'client-user-profile'"
            />
            <preview-modal v-else-if="modalContent === 'preview'" />
        </card-wrapper>
        <backdrop :on-click="handleBackdropClick" />
    </div>
</template>

<script>
import { mapState } from "vuex";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPrefetch: true  */ "@/components/generic/CardWrapper"
    );
const Backdrop = () =>
    import(
        /* webpackChunkName: "components.backdrop", webpackPrefetch: true  */ "@/components/generic/Backdrop"
    );
const SecondaryHeader = () =>
    import(
        /* webpackChunkName: "components.secondaryHeader", webpackPrefetch: true  */ "../SecondaryHeader"
    );

// Modals

const NewClientModal = () =>
    import(
        /* webpackChunkName: "components.newClientModal", webpackPrefetch: true  */ "@/pages/main/home/components/NewClientModal"
    );
const WhatsNewModal = () =>
    import(
        /* webpackChunkName: "components.whatsNewModal", webpackPrefetch: true  */ "@/pages/main/home/components/WhatsNewModal"
    );
const InstallModal = () =>
    import(
        /* webpackChunkName: "components.installModal", webpackPrefetch: true  */ "@/pages/main/home/components/InstallModal"
    );
const ResetPasswordModal = () =>
    import(
        /* webpackChunkName: "components.resetPasswordModal", webpackPrefetch: true  */ "@/pages/main/account/components/ResetPasswordModal"
    );
const PortfolioModal = () =>
    import(
        /* webpackChunkName: "components.portfolioModal", webpackPrefetch: true  */ "@/pages/_clientUser/components/PortfolioModal"
    );
const ClientUserProfileModal = () =>
    import(
        /* webpackChunkName: "components.clientUserProfileModal", webpackPrefetch: true  */ "@/pages/_clientUser/components/ClientUserProfileModal"
    );
const PreviewModal = () =>
    import(
        /* webpackChunkName: "components.previewModal", webpackPrefetch: true  */ "./components/PreviewModal"
    );

export default {
    components: {
        CardWrapper,
        Backdrop,
        SecondaryHeader,
        NewClientModal,
        WhatsNewModal,
        InstallModal,
        ResetPasswordModal,
        PortfolioModal,
        ClientUserProfileModal,
        PreviewModal,
    },
    computed: mapState([
        "modalSize",
        "modalOpen",
        "modalContent",
        "versionBuild",
        "versionName",
        "portfolio",
    ]),
    watch: {
        modalContent(val) {
            if (val) document.body.style.overflow = "hidden";
            else document.body.style.overflow = "auto";
        },
    },
    methods: {
        handleBackdropClick() {
            this.$store.dispatch("closeModal");
        },
        title() {
            switch (this.modalContent) {
                case "new-client":
                    return "New Client";
                case "whats-new":
                    return `${this.versionName} ${this.versionBuild}`;
                case "install-pwa":
                    return "Save the app to your phone";
                case "reset-password":
                    return "Reset password";
                case "portfolio":
                    return `${this.portfolio.business_name} with ${this.portfolio.trainer_name}`;
                case "preview":
                    return "Preview";
                default:
                    return "";
            }
        },
    },
};
</script>
