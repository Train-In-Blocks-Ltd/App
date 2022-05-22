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
        <div class="flex justify-end items-center my-8">
            <a
                v-if="templates && selectedIds.length < templates.length"
                href="javascript:void(0)"
                aria-label="Select all"
                @click="handleSelectAll"
            >
                <txt>Select all</txt>
            </a>
            <icon-button
                svg="file-plus"
                :on-click="() => createTemplate()"
                :size="28"
                aria-label="Create template"
                title="Create template"
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
        <div v-else-if="templates.length > 0" class="grid gap-8 my-8">
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
                        <checkbox v-if="!isDemo" :item-id="template.id" />
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
                            :size="20"
                            aria-label="Expand"
                            title="Expand"
                            class="mt-2"
                        />
                    </div>
                </div>
                <rich-editor
                    v-show="expandedTemplates.includes(template.id)"
                    v-model="template.template"
                    :item-id="template.id"
                    :editing="editTemplate"
                    :placeholder="'What do you plan for your clients frequently?'"
                    :force-stop="forceStop"
                    @on-edit-change="resolve_template_editor"
                />
            </card-wrapper>
        </div>
        <txt v-else type="large-body" grey>No templates yet</txt>
    </wrapper>
</template>

<script lang="ts">
import appModule from "../../../store/modules/app.module";
import templatesModule from "../../../store/modules/templates.module";
import utilsModule from "../../../store/modules/utils.module";
import { Component, Vue } from "vue-property-decorator";
import { NavigationGuardNext, Route } from "vue-router";
import { EditorState } from "@/src/store/modules/types";

const Checkbox = () =>
    import(
        /* webpackChunkName: "components.checkbox", webpackPreload: true  */ "../../../components/generic/Checkbox.vue"
    );
const Multiselect = () =>
    import(
        /* webpackChunkName: "components.multiselect", webpackPreload: true  */ "../../../components/generic/Multiselect.vue"
    );
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "../../../components/generic/CardWrapper.vue"
    );

@Component({
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
})
export default class Templates extends Vue {
    search: string = "";
    new_template_form = {
        name: "Untitled",
        note: "",
    };
    forceStop: number = 0;
    isEditingTemplate: boolean = false;
    tempEditorStore: string | null = null;
    editTemplate: number | null = null;
    multiselectOptions = [
        { name: "Delete", svg: "trash" },
        { name: "Deselect", svg: null },
    ];
    expandedTemplates: number[] = [];

    get loading() {
        return appModule.loading;
    }
    get dontLeave() {
        return appModule.dontLeave;
    }
    get isDemo() {
        return appModule.isDemo;
    }
    get templates() {
        return templatesModule.templates;
    }
    set templates(value) {
        templatesModule.setTemplates(value);
    }
    get selectedIds() {
        return utilsModule.selectedIds;
    }

    async beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext) {
        if (
            this.dontLeave
                ? await utilsModule.confirmPopUpRef?.open({
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            appModule.setDontLeave(false);
            next();
        }
    }

    /** Resolves the action taken from the multi-select. */
    resolve_template_multiselect(res: string) {
        switch (res) {
            case "Delete":
                this.deleteMultiTemplates();
                break;
            case "Deselect":
                utilsModule.deselectAll();
                break;
        }
    }

    /** Resolves the editor state before taking the corresponding action. */
    resolve_template_editor(state: EditorState, id: number) {
        const foundTemplate = this.templates.find(
            (template) => template.id === id
        );
        switch (state) {
            case "edit":
                appModule.setDontLeave(true);
                this.isEditingTemplate = true;
                this.editTemplate = id;
                this.forceStop += 1;
                this.tempEditorStore = foundTemplate?.template ?? null;
                break;
            case "save":
                this.isEditingTemplate = false;
                this.editTemplate = null;
                this.updateTemplate(id);
                break;
            case "cancel":
                appModule.setDontLeave(false);
                this.isEditingTemplate = false;
                this.editTemplate = null;
                if (!foundTemplate) return;
                this.templates = this.templates.map((t) =>
                    t.id !== id
                        ? t
                        : {
                              ...foundTemplate,
                              template: this.tempEditorStore ?? "",
                          }
                );
                break;
        }
    }

    /** Determines if new templates were create before expanding it. */
    checkForNew() {
        this.expandedTemplates = [];
        this.templates.forEach((template) => {
            if (
                template.template === null ||
                template.template === "<p><br></p>"
            )
                this.expandedTemplates.push(template.id);
        });
    }

    /** Expands the main body of the template. */
    toggle_expanded_templates(id: number) {
        if (this.expandedTemplates.includes(id)) {
            const TEMPLATE_INDEX = this.expandedTemplates.indexOf(id);
            if (TEMPLATE_INDEX > -1) {
                this.expandedTemplates.splice(TEMPLATE_INDEX, 1);
            }
        } else {
            this.expandedTemplates.push(id);
        }
    }

    handleSelectAll() {
        utilsModule.selectAll(this.templates.map((template) => template.id));
    }

    /** Creates a new template. */
    async createTemplate() {
        try {
            appModule.setDontLeave(true);
            await templatesModule.addTemplate();
            this.checkForNew();
            utilsModule.responsePopUpRef?.open({
                title: "New template created",
                text: "Edit and use it in a client's plan",
            });
            this.$ga.event("Template", "new");
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }

    /** Updates a template. */
    async updateTemplate(templateId: number) {
        try {
            appModule.setDontLeave(true);
            await templatesModule.updateTemplate(templateId);
            utilsModule.responsePopUpRef?.open({
                title: "Updated template",
                text: "Your changes have been saved",
            });
            this.$ga.event("Template", "update");
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }

    /** Deletes multiple templates. */
    async deleteMultiTemplates() {
        if (this.selectedIds.length !== 0) {
            if (
                await utilsModule.confirmPopUpRef?.open({
                    title: "Are you sure you want to delete all the selected templates?",
                    text: "We will remove these templates from our database and it won't be recoverable.",
                })
            ) {
                try {
                    appModule.setDontLeave(true);
                    await templatesModule.deleteTemplates(this.selectedIds);
                    utilsModule.deselectAll();
                    appModule.stopLoaders();
                    utilsModule.responsePopUpRef?.open({
                        title:
                            this.selectedIds.length > 1
                                ? "Deleted templates"
                                : "Deleted template",
                        text: "Your changes have been saved",
                    });
                    this.$ga.event("Template", "delete");
                } catch (e) {
                    utilsModule.resolveError(e as string);
                }
            }
        }
    }
}
</script>
