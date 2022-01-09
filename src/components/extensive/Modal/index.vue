<style lang="scss" scoped>
.modal_wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    .modal {
        position: fixed;
        top: 4rem;
        padding: 2rem;
        border-radius: var(--rounded);
        background-color: var(--fore);
        z-index: 100;
        max-height: 80%;
        overflow-y: auto;
        &.sm {
            width: 60%;
        }
        &.lg {
            width: 90%;
        }
        .secondary_header {
            margin-bottom: 1.6rem;
        }
    }
}

@media (max-width: 768px) {
    .modal_wrapper .modal {
        top: 0;
        max-height: 100%;
        border-radius: 0;
        &.sm,
        &.lg {
            width: 100%;
        }
    }
}
</style>

<template>
    <div v-if="modalOpen" class="modal_wrapper">
        <card-wrapper
            class="modal"
            :class="{ lg: modalSize === 'lg', sm: modalSize === 'sm' }"
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

export default {
    components: {
        CardWrapper,
        Backdrop,
        SecondaryHeader,
        NewClientModal,
        WhatsNewModal,
        InstallModal,
        ResetPasswordModal,
    },
    computed: mapState([
        "modalSize",
        "modalOpen",
        "modalContent",
        "versionBuild",
        "versionName",
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
                default:
                    return "";
            }
        },
    },
};
</script>
