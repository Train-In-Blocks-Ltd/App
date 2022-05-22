<template>
    <div v-if="modalOpen" class="flex justify-center w-full">
        <card-wrapper
            class="fixed md:top-16 p-8 md:rounded-lg z-60 overflow-y-auto"
            :class="{
                'w-full max-h-screen': modalSize === 'full',
                'w-full md:w-10/12 max-h-screen md:max-h-4/5 h-screen md:h-auto':
                    modalSize === 'lg',
                'w-full md:w-3/5 max-h-screen md:max-h-4/5 h-screen md:h-auto':
                    modalSize === 'sm',
                'w-full md:w-3/4 lg:w-2/5 max-h-screen md:max-h-4/5 h-screen md:h-auto':
                    modalSize === 'xs',
            }"
            noHover
            noBorder
        >
            <secondary-header :title="title()">
                <template v-slot:right>
                    <icon-button
                        v-if="!modalPersist"
                        svg="x"
                        :on-click="_close"
                        :size="32"
                        aria-label="Close"
                        title="Close"
                    />
                </template>
            </secondary-header>
            <new-client-modal v-if="modalContent === 'new-client'" />
            <whats-new-modal v-else-if="modalContent === 'whats-new'" />
            <install-modal v-else-if="modalContent === 'install-pwa'" />
            <reset-password-modal
                v-else-if="modalContent === 'reset-password'"
            />
            <client-user-profile-modal
                v-else-if="modalContent === 'client-user-profile'"
            />
            <preview-modal
                v-else-if="
                    modalContent === 'preview' || modalContent === 'info'
                "
            />
            <new-plan-modal v-else-if="modalContent === 'new-plan'" />
            <all-booking-modal v-else-if="modalContent === 'bookings'" />
            <toolkit-modal v-else-if="modalContent === 'toolkit'" />
            <duplicate-plan-modal
                v-else-if="modalContent === 'duplicate-plan'"
            />
            <move-modal v-else-if="modalContent === 'move'" />
            <shift-modal v-else-if="modalContent === 'shift'" />
            <progress-modal v-else-if="modalContent === 'progress'" />
            <statistics-modal v-else-if="modalContent === 'statistics'" />
            <templates-modal v-else-if="modalContent === 'templates'" />
            <policy-modal v-else-if="modalContent === 'eula'" />
        </card-wrapper>
        <backdrop :on-click="_close" />
    </div>
</template>

<script lang="ts">
import appModule from "../../../store/app.module";
import { Component, Vue, Watch } from "vue-property-decorator";
import utilsModule from "../../../store/utils.module";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPrefetch: true  */ "../../../components/generic/CardWrapper.vue"
    );
const Backdrop = () =>
    import(
        /* webpackChunkName: "components.backdrop", webpackPrefetch: true  */ "../../../components/generic/Backdrop.vue"
    );
const SecondaryHeader = () =>
    import(
        /* webpackChunkName: "components.secondaryHeader", webpackPrefetch: true  */ "../SecondaryHeader/index.vue"
    );

// Modals

const NewClientModal = () =>
    import(
        /* webpackChunkName: "components.newClientModal", webpackPrefetch: true  */ "../../../pages/main/home/components/NewClientModal.vue"
    );
const WhatsNewModal = () =>
    import(
        /* webpackChunkName: "components.whatsNewModal", webpackPrefetch: true  */ "../../../pages/main/home/components/WhatsNewModal.vue"
    );
const InstallModal = () =>
    import(
        /* webpackChunkName: "components.installModal", webpackPrefetch: true  */ "../../../pages/main/home/components/InstallModal.vue"
    );
const ResetPasswordModal = () =>
    import(
        /* webpackChunkName: "components.resetPasswordModal", webpackPrefetch: true  */ "../../../pages/main/account/components/ResetPasswordModal.vue"
    );
const ClientUserProfileModal = () =>
    import(
        /* webpackChunkName: "components.clientUserProfileModal", webpackPrefetch: true  */ "../../../pages/_clientUser/components/ClientUserProfileModal.vue"
    );
const PreviewModal = () =>
    import(
        /* webpackChunkName: "components.previewModal", webpackPrefetch: true  */ "./components/PreviewModal.vue"
    );
const NewPlanModal = () =>
    import(
        /* webpackChunkName: "components.newPlanModal", webpackPrefetch: true  */ "../../../pages/main/home/client/plans/components/NewPlanModal.vue"
    );
const AllBookingModal = () =>
    import(
        /* webpackChunkName: "components.allBookingModal", webpackPrefetch: true  */ "../../../pages/main/home/client/plans/components/AllBookingsModal.vue"
    );
const ToolkitModal = () =>
    import(
        /* webpackChunkName: "components.toolkitModal", webpackPrefetch: true  */ "../../../pages/main/home/client/components/ToolkitModal.vue"
    );
const DuplicatePlanModal = () =>
    import(
        /* webpackChunkName: "components.duplicatePlanModal", webpackPrefetch: true  */ "../../../pages/main/home/client/plans/sessions/components/DuplicatePlanModal.vue"
    );
const MoveModal = () =>
    import(
        /* webpackChunkName: "components.moveModal", webpackPrefetch: true  */ "../../../pages/main/home/client/plans/sessions/components/MoveModal.vue"
    );
const ShiftModal = () =>
    import(
        /* webpackChunkName: "components.shiftModal", webpackPrefetch: true  */ "../../../pages/main/home/client/plans/sessions/components/ShiftModal.vue"
    );
const ProgressModal = () =>
    import(
        /* webpackChunkName: "components.progressModal", webpackPrefetch: true  */ "../../../pages/main/home/client/plans/sessions/components/ProgressModal.vue"
    );
const StatisticsModal = () =>
    import(
        /* webpackChunkName: "components.statisticsModal", webpackPrefetch: true  */ "../../../pages/main/home/client/plans/sessions/components/StatisticsModal.vue"
    );
const TemplatesModal = () =>
    import(
        /* webpackChunkName: "components.templatesModal", webpackPrefetch: true  */ "../../../components/extensive/RichEditor/components/TemplatesModal.vue"
    );
const PolicyModal = () =>
    import(
        /* webpackChunkName: "components.policyModal", webpackPrefetch: true  */ "../../../components/extensive/Modal/components/PolicyModal.vue"
    );

@Component({
    components: {
        CardWrapper,
        Backdrop,
        SecondaryHeader,
        NewClientModal,
        WhatsNewModal,
        InstallModal,
        ResetPasswordModal,
        ClientUserProfileModal,
        PreviewModal,
        NewPlanModal,
        AllBookingModal,
        ToolkitModal,
        DuplicatePlanModal,
        MoveModal,
        ShiftModal,
        ProgressModal,
        StatisticsModal,
        TemplatesModal,
        PolicyModal,
    },
})
export default class Modal extends Vue {
    get modalSize() {
        return utilsModule.modalSize;
    }
    get modalOpen() {
        return utilsModule.modalOpen;
    }
    get modalContent() {
        return utilsModule.modalContent;
    }
    get modalPersist() {
        return utilsModule.modalPersist;
    }
    get previewTitle() {
        return utilsModule.previewTitle;
    }
    get versionName() {
        return appModule.versionName;
    }
    get versionBuild() {
        return appModule.versionBuild;
    }

    @Watch("modalContent")
    onContentChange(old: string) {
        if (old) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }

    _close() {
        if (!this.modalPersist) utilsModule.closeModal();
    }

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
            case "preview":
                return this.previewTitle ?? "Preview";
            case "info":
                return "Information";
            case "new-plan":
                return "New Plan";
            case "bookings":
                return "All bookings";
            case "toolkit":
                return "Toolkit";
            case "duplicate-plan":
                return "Duplicate plan";
            case "move":
                return "Move sessions";
            case "shift":
                return "Shift sessions";
            case "progress":
                return "Progress sessions";
            case "statistics":
                return "Statistics";
            case "templates":
                return "Templates";
            case "eula":
                return "End-User License Agreement (EULA)";
            default:
                return "";
        }
    }
}
</script>
