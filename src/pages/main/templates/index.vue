<template>
    <wrapper id="templates">
        <multiselect
            :type="'template'"
            :options="multiselectOptions"
            @response="resolve_template_multiselect"
        />

        <!-- Top section -->
        <txt-input
            :value="search"
            @output="(data) => (search = data)"
            type="search"
            rel="search"
            placeholder="Find a template"
            aria-label="Find a template"
            inputClass="text-2xl"
            style="margin-bottom: 2rem"
        />
        <div
            v-if="templates && selectedIds.length < templates.length"
            class="flex justify-end items-center my-8"
        >
            <a
                href="javascript:void(0)"
                @click="
                    () => {
                        $store.commit('SET_DATA', {
                            attr: 'selectedIds',
                            data: templates.map((template) => template.id),
                        });
                    }
                "
            >
                <txt>Select all</txt>
            </a>
            <icon-button
                svg="file-plus"
                :on-click="() => createTemplate()"
                :icon-size="28"
                class="ml-4"
            />
        </div>

        <!-- Templates list -->
        <div v-if="loading" class="skeleton-box animate-pulse p-4 my-8">
            <div class="skeleton-item w-1/3" />
            <div class="skeleton-item w-2/3" />
            <div class="skeleton-item w-5/12" />
            <div class="skeleton-item w-1/2" />
            <div class="skeleton-item w-1/4" />
        </div>
        <div v-else-if="templates" class="grid gap-8 my-8">
            <card-wrapper
                v-for="(template, index) in templates"
                v-show="
                    !search ||
                    template.name.toLowerCase().startsWith(search.toLowerCase())
                "
                :id="'template-' + template.id"
                :key="index"
                class="p-4 md:p-8"
                no-hover
            >
                <div class="flex justify-between">
                    <txt
                        v-if="template.id !== editTemplate"
                        :class="{
                            'text-red-700':
                                template.name == 'Untitled' &&
                                !isEditingTemplate,
                        }"
                        bold
                    >
                        {{ template.name }}
                    </txt>
                    <txt-input
                        v-if="template.id === editTemplate"
                        class="template-name small_border_radius right_margin"
                        type="text"
                        name="template-name"
                        pattern="[^\/]"
                        :value="template.name"
                        @output="(data) => (template.name = data)"
                    />
                    <div class="flex flex-col items-center gap-4">
                        <checkbox
                            v-if="!isDemo"
                            :item-id="template.id"
                        />
                        <icon-button
                            v-show="!isEditingTemplate"
                            :svg="
                                expandedTemplates.includes(template.id)
                                    ? 'corner-right-up'
                                    : 'corner-right-down'
                            "
                            :on-click="
                                () => toggle_expanded_templates(template.id)
                            "
                            :icon-size="20"
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
            </card-wrapper>
        </div>
        <txt v-else type="large-body" grey>No templates yet :(</txt>
    </wrapper>
</template>

<script>
import { mapState } from "vuex";

const Checkbox = () =>
    import(
        /* webpackChunkName: "components.checkbox", webpackPreload: true  */ "@/components/generic/Checkbox"
    );
const Multiselect = () =>
    import(
        /* webpackChunkName: "components.multiselect", webpackPreload: true  */ "@/components/generic/Multiselect"
    );
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );

export default {
    metaInfo() {
        return {
            title: "Templates",
        };
    },
    components: {
        Checkbox,
        Multiselect,
        CardWrapper,
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
                { name: "Delete", svg: "trash" },
                { name: "Deselect", svg: null },
            ],
            expandedTemplates: [],
        };
    },
    computed: mapState([
        "loading",
        "dontLeave",
        "templates",
        "selectedIds",
        "isDemo",
    ]),
    async created() {
        this.$store.dispatch("setLoading", {
            loading: true,
        });
        await this.$parent.setup();
        this.$store.dispatch("setLoading", false);
    },
    methods: {
        /**
         * Resolves the action taken from the multi-select.
         * @param res - The action taken.
         */
        resolve_template_multiselect(res) {
            switch (res) {
                case "Delete":
                    this.deleteMultiTemplates();
                    break;
                case "Deselect":
                    this.$store.commit("SET_DATA", {
                        attr: "selectedIds",
                        data: [],
                    });
                    break;
            }
        },

        /**
         * Resolves the editor state before taking the corresponding action.
         * @param state - The returned state of the editor.
         * @param id - The id of the template.
         */
        resolve_template_editor(state, id) {
            const TEMPLATE = this.templates.find(
                (template) => template.id === id
            );
            switch (state) {
                case "edit":
                    this.$store.dispatch("setLoading", {
                        dontLeave: true,
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
                    this.$store.dispatch("setLoading", {
                        dontLeave: false,
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

        async deleteMultiTemplates() {
            if (this.selectedIds.length !== 0) {
                if (
                    await this.$store.dispatch("openConfirmPopUp", {
                        title: "Are you sure you want to delete all the selected templates?",
                        text: "We will remove these templates from our database and it won't be recoverable.",
                    })
                ) {
                    try {
                        this.$store.dispatch("setLoading", {
                            dontLeave: true,
                        });
                        await this.$store.dispatch(
                            "deleteTemplate",
                            this.selectedIds
                        );
                        this.$store.dispatch("setLoading", false);
                        this.$store.dispatch("openResponsePopUp", {
                            title:
                                this.selectedIds.length > 1
                                    ? "Deleted templates"
                                    : "Deleted template",
                            description: "Your changes have been saved",
                        });
                        this.$ga.event("Template", "delete");
                        this.$store.commit("SET_DATA", {
                            attr: "selectedIds",
                            data: [],
                        });
                    } catch (e) {
                        this.$store.dispatch("resolveError", e);
                    }
                }
            }
        },

        /**
         * Creates a new template.
         */
        async createTemplate() {
            try {
                this.$store.dispatch("setLoading", {
                    dontLeave: true,
                });
                await this.$store.dispatch("newTemplate");
                this.checkForNew();
                this.$store.dispatch("openResponsePopUp", {
                    title: "New template created",
                    description: "Edit and use it in a client's plan",
                });
                this.$ga.event("Template", "new");
                this.$store.dispatch("setLoading", false);
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /**
         * Updates a template.
         * @param {integer} templateId - The id of the template.
         */
        async updateTemplate(templateId) {
            try {
                this.$store.dispatch("setLoading", {
                    dontLeave: true,
                });
                await this.$store.dispatch("updateTemplate", templateId);
                this.$store.dispatch("openResponsePopUp", {
                    title: "Updated template",
                    description: "Your changes have been saved",
                });
                this.$ga.event("Template", "update");
                this.$store.dispatch("setLoading", false);
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>
