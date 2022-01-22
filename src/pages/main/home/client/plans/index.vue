<template>
    <div>
        <!-- Client notes -->
        <editor-wrapper title="Client Information" class="my-16">
            <rich-editor
                v-model="clientDetails.notes"
                :empty-placeholder="'What goals does your client have? What physical measures have you taken?'"
                @on-edit-change="resolve_client_info_editor"
            />
        </editor-wrapper>

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
                            })
                    "
                    :icon-size="28"
                />
            </div>

            <!-- Plans grid -->
            <skeleton v-if="loading" :type="'plan'" class="fadeIn" />
            <div
                v-else-if="clientDetails.plans.length !== 0"
                class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
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

const RichEditor = () =>
    import(
        /* webpackChunkName: "components.richeditor", webpackPreload: true  */ "@/components/Editor"
    );
const Bookings = () =>
    import(
        /* webpackChunkName: "components.bookings", webpackPreload: true  */ "./components/Bookings"
    );
const PlanCard = () =>
    import(
        /* webpackChunkName: "components.planCard", webpackPreload: true  */ "@/components/generic/PlanCard"
    );
const EditorWrapper = () =>
    import(
        /* webpackChunkName: "components.editorWrapper", webpackPreload: true  */ "@/components/generic/EditorWrapper"
    );

export default {
    components: {
        RichEditor,
        Bookings,
        PlanCard,
        EditorWrapper,
    },
    async beforeRouteLeave(to, from, next) {
        if (
            this.dontLeave
                ? await this.$parent.$parent.$refs.confirm_pop_up.show(
                      "Your changes might not be saved",
                      "Are you sure you want to leave?"
                  )
                : true
        ) {
            this.$store.commit("setData", {
                attr: "dontLeave",
                data: false,
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
    created() {
        this.willBodyScroll(true);
    },
    methods: {
        /**
         * Resolves the client information editor.
         * @param {string} state - The returned state from the editor.
         */
        resolve_client_info_editor(state) {
            switch (state) {
                case "edit":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    this.editingClientNotes = true;
                    this.tempEditorStore = this.clientDetails.notes;
                    break;
                case "save":
                    this.editingClientNotes = false;
                    this.$parent.updateClient(this.clientDetails);
                    break;
                case "cancel":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: false,
                    });
                    this.editingClientNotes = false;
                    this.clientDetails.notes = this.tempEditorStore;
                    break;
            }
        },
    },
};
</script>
