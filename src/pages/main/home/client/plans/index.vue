<template>
    <div>
        <!-- Client notes -->
        <label-wrapper title="Client Information" class="my-16">
            <rich-editor
                v-model="clientDetails.notes"
                :empty-placeholder="'What goals does your client have? What physical measures have you taken?'"
                @on-edit-change="resolve_client_info_editor"
            />
        </label-wrapper>

        <!-- Bookings -->
        <bookings class="mb-16" />

        <!-- Plans section -->
        <div>
            <!-- Plans header -->
            <div class="flex justify-between items-center mb-8">
                <txt type="title">Plans</txt>
                <icon-button
                    svg="file-plus"
                    :on-click="
                        () =>
                            $store.dispatch('openModal', {
                                name: 'new-plan',
                                size: 'xs',
                            })
                    "
                    :icon-size="28"
                />
            </div>

            <!-- Plans grid -->
            <div v-if="loading" class="grid sm:grid-cols-2 gap-4">
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-1/3" />
                    <div class="skeleton-item w-3/4" />
                </div>
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-1/3" />
                    <div class="skeleton-item w-3/4" />
                </div>
            </div>
            <div
                v-else-if="clientDetails.plans.length !== 0"
                class="grid sm:grid-cols-2 gap-4"
            >
                <plan-card
                    v-for="(plan, index) in clientDetails.plans"
                    :key="`plan-${index}`"
                    :plan="plan"
                    :link="`plan/${plan.id}`"
                    is-trainer
                />
            </div>
            <txt v-else type="large-body" grey>
                No plans yet, use the button on the top-right of your screen
            </txt>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

const Bookings = () =>
    import(
        /* webpackChunkName: "components.bookings", webpackPreload: true  */ "./components/Bookings"
    );
const PlanCard = () =>
    import(
        /* webpackChunkName: "components.planCard", webpackPreload: true  */ "@/components/generic/PlanCard"
    );
const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "@/components/generic/LabelWrapper"
    );

export default {
    components: {
        Bookings,
        PlanCard,
        LabelWrapper,
    },
    async beforeRouteLeave(to, from, next) {
        if (
            this.dontLeave
                ? await this.$store.dispatch("openConfirmPopUp", {
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            this.$store.dispatch("setLoading", {
                dontLeave: false,
            });
            next();
        }
    },
    data() {
        return {
            tempEditorStore: null,
            editingClientNotes: false,
        };
    },
    computed: mapState(["loading", "dontLeave", "clients", "clientDetails"]),
    methods: {
        /**
         * Resolves the client information editor.
         * @param {string} state - The returned state from the editor.
         */
        async resolve_client_info_editor(state) {
            switch (state) {
                case "edit":
                    this.$store.dispatch("setLoading", {
                        dontLeave: true,
                    });
                    this.editingClientNotes = true;
                    this.tempEditorStore = this.clientDetails.notes;
                    break;
                case "save":
                    this.editingClientNotes = false;
                    try {
                        this.$store.dispatch("setLoading", {
                            silentLoading: true,
                            dontLeave: true,
                        });
                        await this.$store.dispatch("updateClient");
                        this.$store.dispatch("setLoading", false);
                    } catch (e) {
                        this.$store.dispatch("resolveError", e);
                    }
                    break;
                case "cancel":
                    this.$store.dispatch("setLoading", {
                        dontLeave: false,
                    });
                    this.editingClientNotes = false;
                    this.clientDetails.notes = this.tempEditorStore;
                    break;
            }
        },
    },
};
</script>
