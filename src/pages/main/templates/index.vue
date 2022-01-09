<style lang="scss" scoped>
.template_options {
    display: flex;
    justify-content: space-between;
    margin: 2rem 0;
}
.template_container {
    display: grid;
    grid-gap: 2rem;
    margin: 2rem 0;
    .template_wrapper__header {
        display: flex;
        justify-content: space-between;
        span.newTemplate {
            color: var(--base_red);
        }
        .header_options {
            display: flex;
            flex-direction: column;
            align-items: center;
            .icon--expand {
                cursor: pointer;
                vertical-align: middle;
                margin-top: 0.8rem;
                transition: var(--transition_smooth);
                &.expanded {
                    transform: rotate(180deg);
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .multi-select {
        padding: 2rem;
        width: 100%;
        background-color: var(--fore);
        box-shadow: var(--high_shadow);
        a {
            grid-template-columns: 1fr;
        }
        svg {
            margin-left: auto;
        }
    }
    .template_options
        .template_container
        .template_wrapper__header
        .template-name {
        width: 60%;
    }
}
@media (max-width: 576px) {
    .template_options
        .template_container
        .template_wrapper__header
        .template-name {
        width: 100%;
    }
}
</style>

<template>
    <div id="templates" class="view_container">
        <multiselect
            :type="'template'"
            :options="multiselectOptions"
            :selected="selectedTemplates"
            @response="resolve_template_multiselect"
        />
        <txt-input
            v-model="search"
            type="search"
            rel="search"
            placeholder="Find a template"
            aria-label="Find a template"
            inputClass="text--small"
            style="margin-bottom: 2rem"
        />
        <div class="template_options">
            <button @click="createTemplate()">New Template</button>
            <a
                v-if="templates && selectedTemplates.length < templates.length"
                href="javascript:void(0)"
                class="a_link select_all"
                @click="selectAll()"
            >
                Select all
            </a>
        </div>
        <skeleton v-if="loading" :type="'session'" />
        <div v-else-if="templates" class="template_container fadeIn">
            <div
                v-for="(template, index) in templates"
                v-show="
                    !search ||
                    template.name.toLowerCase().startsWith(search.toLowerCase())
                "
                :id="'template-' + template.id"
                :key="index"
                class="template_wrapper editor_object_complex fadeIn"
            >
                <div class="template_wrapper__header">
                    <span
                        v-if="template.id !== editTemplate"
                        class="text--name"
                        :class="{
                            newTemplate:
                                template.name == 'Untitled' &&
                                !isEditingTemplate,
                        }"
                    >
                        <b>
                            {{ template.name }}
                        </b>
                    </span>
                    <br v-if="template.id !== editTemplate" />
                    <input
                        v-if="template.id === editTemplate"
                        v-model="template.name"
                        class="template-name small_border_radius right_margin"
                        type="text"
                        name="template-name"
                        pattern="[^\/]"
                    /><br />
                    <div class="header_options">
                        <checkbox
                            :item-id="template.id"
                            :type="'v1'"
                            aria-label="Select this template"
                        />
                        <inline-svg
                            v-show="!isEditingTemplate"
                            id="expand"
                            class="icon--expand"
                            :class="{
                                expanded: expandedTemplates.includes(
                                    template.id
                                ),
                            }"
                            :src="require('@/assets/svg/expand.svg')"
                            title="Info"
                            @click="toggle_expanded_templates(template.id)"
                        />
                    </div>
                </div>
                <rich-editor
                    v-show="expandedTemplates.includes(template.id)"
                    v-model="template.template"
                    :item-id="template.id"
                    :editing="editTemplate"
                    :empty-placeholder="'What do you plan for your clients frequently?'"
                    :force-stop="forceStop"
                    @on-edit-change="resolve_template_editor"
                />
            </div>
        </div>
        <p v-else class="grey text--small">No templates yet :(</p>
    </div>
</template>

<script>
import { mapState } from "vuex";
const RichEditor = () =>
    import(
        /* webpackChunkName: "components.richeditor", webpackPreload: true  */ "@/components/Editor"
    );
const Checkbox = () =>
    import(
        /* webpackChunkName: "components.checkbox", webpackPreload: true  */ "@/components/Checkbox"
    );
const Multiselect = () =>
    import(
        /* webpackChunkName: "components.multiselect", webpackPreload: true  */ "@/components/Multiselect"
    );

export default {
    metaInfo() {
        return {
            title: "Templates",
        };
    },
    components: {
        RichEditor,
        Checkbox,
        Multiselect,
    },

    async beforeRouteLeave(to, from, next) {
        if (
            this.dontLeave
                ? await this.$parent.$refs.confirm_pop_up.show(
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
            search: "",

            // CREATE

            new_template_form: {
                name: "Untitled",
                note: "",
            },

            // EDIT

            forceStop: 0,
            isEditingTemplate: false,
            tempEditorStore: null,
            editTemplate: null,

            // SELECTED AND EXPANDED

            multiselectOptions: [
                { name: "Delete", svg: "svg/bin.svg" },
                { name: "Deselect", svg: null },
            ],
            selectedTemplates: [],
            expandedTemplates: [],
        };
    },
    computed: mapState(["loading", "dontLeave", "templates"]),
    async created() {
        this.$store.commit("setData", {
            attr: "loading",
            data: true,
        });
        this.willBodyScroll(true);
        await this.$parent.setup();
        this.$store.dispatch("endLoading");
    },
    methods: {
        // -----------------------------
        // Background
        // -----------------------------

        /**
         * Resolves template funtions.
         * @param {string} type - The associated template action taken.
         */
        helper(type) {
            switch (type) {
                case "new":
                    this.$store.dispatch("openResponsePopUp", {
                        title: "New template created",
                        description: "Edit and use it in a client's plan",
                    });
                    this.$ga.event("Template", "new");
                    break;
                case "update":
                    this.$store.dispatch("openResponsePopUp", {
                        title: "Updated template",
                        description: "Your changes have been saved",
                    });
                    this.$ga.event("Template", "update");
                    break;
                case "delete":
                    this.$store.dispatch("openResponsePopUp", {
                        title:
                            this.selectedTemplates.length > 1
                                ? "Deleted templates"
                                : "Deleted template",
                        description: "Your changes have been saved",
                    });
                    this.$ga.event("Template", "delete");
                    break;
            }
        },

        /**
         * Resolves the action taken from the multi-select.
         * @param {string} res - The action taken.
         */
        resolve_template_multiselect(res) {
            switch (res) {
                case "Delete":
                    this.deleteMultiTemplates();
                    break;
                case "Deselect":
                    this.deselectAll();
                    break;
            }
        },

        /**
         * Resolves the editor state before taking the corresponding action.
         * @param {string} state - The returned state of the editor.
         * @param {integer} id - The id of the template.
         */
        resolve_template_editor(state, id) {
            const TEMPLATE = this.templates.find(
                (template) => template.id === id
            );
            switch (state) {
                case "edit":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    this.isEditingTemplate = true;
                    this.editTemplate = id;
                    this.forceStop += 1;
                    this.tempEditorStore = TEMPLATE.template;
                    break;
                case "save":
                    this.isEditingTemplate = false;
                    this.editTemplate = null;
                    this.updateTemplate(id);
                    break;
                case "cancel":
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: false,
                    });
                    this.isEditingTemplate = false;
                    this.editTemplate = null;
                    TEMPLATE.template = this.tempEditorStore;
                    break;
            }
        },

        /**
         * Determines if new templates were create before expanding it.
         */
        checkForNew() {
            this.expandedTemplates = [];
            this.templates.forEach((template) => {
                if (
                    template.template === null ||
                    template.template === "<p><br></p>"
                ) {
                    this.expandedTemplates.push(template.id);
                }
            });
        },

        // -----------------------------
        // Checkbox
        // -----------------------------

        /**
         * Changes the state of the custom checkbox component.
         * @param {integer} id - The id of the template.
         */
        changeSelectCheckbox(id) {
            if (!this.selectedTemplates.includes(id)) {
                this.selectedTemplates.push(id);
            } else {
                const TEMPLATE_INDEX = this.selectedTemplates.indexOf(id);
                this.selectedTemplates.splice(TEMPLATE_INDEX, 1);
            }
        },

        /**
         * Expands the main body of the template.
         * @param {integer} id - The id of the template.
         */
        toggle_expanded_templates(id) {
            if (this.expandedTemplates.includes(id)) {
                const TEMPLATE_INDEX = this.expandedTemplates.indexOf(id);
                if (TEMPLATE_INDEX > -1) {
                    this.expandedTemplates.splice(TEMPLATE_INDEX, 1);
                }
            } else {
                this.expandedTemplates.push(id);
            }
        },

        /**
         * Selects all templates.
         */
        selectAll() {
            this.templates.forEach((template) => {
                if (!this.selectedTemplates.includes(template.id)) {
                    this.selectedTemplates.push(template.id);
                    document.getElementById(`sc-${template.id}`).checked = true;
                }
            });
        },

        /**
         * Deselects all templates.
         */
        deselectAll() {
            this.templates.forEach((template) => {
                document.getElementById(`sc-${template.id}`).checked = false;
            });
            this.selectedTemplates = [];
        },
        async deleteMultiTemplates() {
            if (this.selectedTemplates.length !== 0) {
                if (
                    await this.$parent.$refs.confirm_pop_up.show(
                        "Are you sure you want to delete all the selected templates?",
                        "We will remove these templates from our database and it won't be recoverable."
                    )
                ) {
                    try {
                        this.$store.commit("setData", {
                            attr: "dontLeave",
                            data: true,
                        });
                        await this.$store.dispatch(
                            "deleteTemplate",
                            this.selectedTemplates
                        );
                        this.$store.dispatch("endLoading");
                        this.helper("delete");
                        this.deselectAll();
                    } catch (e) {
                        this.$parent.resolveError(e);
                    }
                }
            }
        },

        // -----------------------------
        // Database
        // -----------------------------

        /**
         * Creates a new template.
         */
        async createTemplate() {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                await this.$store.dispatch("newTemplate");
                this.checkForNew();
                this.helper("new");
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.resolveError(e);
            }
        },

        /**
         * Updates a template.
         * @param {integer} templateId - The id of the template.
         */
        async updateTemplate(templateId) {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                await this.$store.dispatch("updateTemplate", templateId);
                this.helper("update");
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.resolveError(e);
            }
        },
    },
};
</script>
