<style lang="scss">
#client_notes {
    margin: 4rem 0;
}
.add_plan {
    label {
        display: grid;
        grid-gap: 0.5rem;
    }
}
.plans_section {
    margin-top: 4rem;
    .header {
        display: flex;
        justify-content: space-between;
        button {
            margin: auto 0;
        }
    }
}
</style>

<template>
    <div>
        <div
            v-if="isNewPlanOpen"
            class="tab_overlay_content fadeIn delay fill_mode_both"
        >
            <new-plan />
        </div>
        <div
            :class="{ opened_sections: isNewPlanOpen }"
            class="section_overlay"
        />
        <div id="client_notes" class="editor_object_standard">
            <h3>Client Information</h3>
            <rich-editor
                v-model="clientDetails.notes"
                :empty-placeholder="'What goals does your client have? What physical measures have you taken?'"
                @on-edit-change="resolve_client_info_editor"
            />
        </div>
        <bookings :client-id="clientDetails.client_id" />
        <div class="plans_section">
            <div class="header">
                <h2>Plans</h2>
                <button @click="(isNewPlanOpen = true), willBodyScroll(false)">
                    New Plan
                </button>
            </div>

            <!-- Plans section -->
            <skeleton v-if="loading" :type="'plan'" class="fadeIn" />
            <div
                v-else-if="clientDetails.plans.length !== 0"
                class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                <plan-card
                    v-for="(plan, index) in clientDetails.plans"
                    :key="`plan-${index}`"
                    :plan="plan"
                    :link="`/plan/${plan.id}`"
                />
            </div>
            <p v-else class="text--holder text--small grey">
                No plans yet, use the button on the top-right of your screen
            </p>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
const NewPlan = () =>
    import(
        /* webpackChunkName: "components.newplan", webpackPrefetch: true  */ "../../components/NewPlan"
    );
const RichEditor = () =>
    import(
        /* webpackChunkName: "components.richeditor", webpackPreload: true  */ "../../components/Editor"
    );
const Bookings = () =>
    import(
        /* webpackChunkName: "components.bookings", webpackPreload: true  */ "../../components/Bookings"
    );
const PlanCard = () =>
    import(
        /* webpackChunkName: "components.planCard", webpackPreload: true  */ "@/components/generic/PlanCard"
    );

export default {
    components: {
        NewPlan,
        RichEditor,
        Bookings,
        PlanCard,
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
            // EDIT

            tempEditorStore: null,
            editingClientNotes: false,

            // PLAN CREATION

            isNewPlanOpen: false,
            response: "",
            persistResponse: "",
        };
    },
    computed: mapState(["loading", "dontLeave", "clients", "clientDetails"]),
    created() {
        this.willBodyScroll(true);
        this.$parent.checkClient();
    },
    methods: {
        // -----------------------------
        // General
        // -----------------------------

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
