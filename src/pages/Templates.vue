<style scoped>
  /* Containers */
  .template_options {
    display: flex;
    justify-content: space-between;
    margin: 2rem 0
  }
  .template_container {
    display: grid;
    grid-gap: 4rem;
    margin: 2rem 0
  }
  .template_wrapper__header {
    display: flex;
    justify-content: space-between
  }
  .header_options {
    display: flex;
    flex-direction: column;
    align-items: center
  }

  /* Inputs */
  .newTemplate {
    color: #B80000
  }

  /* Icons */
  .icon--expand {
    cursor: pointer;
    vertical-align: middle;
    margin-top: .8rem;
    transition: var(--transition_smooth)
  }
  .icon--expand.expanded {
    transform: rotate(180deg)
  }

  @media (max-width: 768px) {
    .multi-select {
      padding: 2rem;
      width: 100%;
      background-color: var(--fore);
      box-shadow: var(--high_shadow)
    }
    .multi-select a {
      grid-template-columns: 1fr
    }
    .multi-select svg {
      margin-left: auto
    }
    input.template-name {
      width: 60%
    }
  }
  @media (max-width: 576px) {
    input.template-name {
      width: 100%
    }
  }
</style>

<template>
  <div id="templates" class="view_container">
    <multiselect
      :type="'template'"
      :options="['Delete', 'Deselect']"
      :selected="selectedTemplates"
      @response="resolve_template_multiselect"
    />
    <input
      v-model="search"
      type="search"
      rel="search"
      placeholder="Find a template"
      class="text--small search"
      aria-label="Find a template"
    >
    <div class="template_options">
      <button @click="new_template()">
        New Template
      </button>
      <a
        v-if="$parent.templates !== null && $parent.templates.length !== 0 && selectedTemplates.length < $parent.templates.length"
        href="javascript:void(0)"
        class="a_link select_all"
        @click="select_all()"
      >
        Select all
      </a>
    </div>
    <div v-if="$parent.templates !== null && $parent.templates.length !== 0" class="template_container">
      <div
        v-for="(template, index) in $parent.templates"
        v-show="((!search) || ((template.name).toLowerCase()).startsWith(search.toLowerCase()))"
        :id="'template-' + template.id"
        :key="index"
        :class="{ editorActive: template.id === editTemplate }"
        class="template_wrapper editor_object"
      >
        <div class="template_wrapper__header">
          <span
            v-if="template.id !== editTemplate"
            class="text--name"
            :class="{ newTemplate: template.name == 'Untitled' && !isEditingTemplate }"
          >
            <b>
              {{ template.name }}
            </b>
          </span>
          <br v-if="template.id !== editTemplate">
          <input
            v-if="template.id === editTemplate"
            v-model="template.name"
            class="template-name small_border_radius right_margin"
            type="text"
            name="template-name"
            pattern="[^\/]"
          ><br>
          <div class="header_options">
            <checkbox :item-id="template.id" :type="'v1'" aria-label="Select this template" />
            <inline-svg
              v-show="!isEditingTemplate"
              id="expand"
              class="icon--expand"
              :class="{expanded: expandedTemplates.includes(template.id)}"
              :src="require('../assets/svg/expand.svg')"
              title="Info"
              @click="toggle_expanded_templates(template.id)"
            />
          </div>
        </div>
        <rich-editor
          v-show="expandedTemplates.includes(template.id)"
          :item-id="template.id"
          :editing="editTemplate"
          :html-injection.sync="template.template"
          :empty-placeholder="'What do you plan for your clients frequently?'"
          :force-stop="forceStop"
          @on-edit-change="resolve_template_editor"
        />
      </div>
    </div>
    <p v-else class="grey text--small">
      No templates yet :(
    </p>
  </div>
</template>

<script>
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../components/Editor')
const Checkbox = () => import(/* webpackChunkName: "components.checkbox", webpackPreload: true  */ '../components/Checkbox')
const Multiselect = () => import(/* webpackChunkName: "components.multiselect", webpackPreload: true  */ '../components/Multiselect')

export default {
  components: {
    RichEditor,
    Checkbox,
    Multiselect
  },
  async beforeRouteLeave (to, from, next) {
    if (this.$parent.dontLeave ? await this.$parent.$refs.confirm_pop_up.show('Your changes might not be saved', 'Are you sure you want to leave?') : true) {
      this.$parent.dontLeave = false
      next()
    }
  },
  data () {
    return {

      search: '',

      // CREATE

      new_template_form: {
        name: 'Untitled',
        note: ''
      },

      // EDIT

      forceStop: 0,
      isEditingTemplate: false,
      tempEditorStore: null,
      editTemplate: null,

      // SELECTED AND EXPANDED

      selectedTemplates: [],
      expandedTemplates: []
    }
  },
  created () {
    this.$parent.loading = true
    this.will_body_scroll(true)
    this.$parent.setup()
    this.$parent.end_loading()
  },
  async mounted () {
    await this.$parent.get_templates()
    this.check_for_new()
  },
  methods: {

    // BACKGROUND

    helper (type) {
      switch (type) {
        case 'new':
          this.$parent.$refs.response_pop_up.show('New template created', 'Edit and use it in a client\'s plan')
          break
        case 'update':
          this.$parent.$refs.response_pop_up.show('Updated template', 'Your changes have been saved')
          break
        case 'delete':
          this.$parent.$refs.response_pop_up.show(this.selectedTemplates.length > 1 ? 'Deleted templates' : 'Deleted template', 'Your changes have been saved')
          break
      }
    },
    resolve_template_multiselect (res) {
      switch (res) {
        case 'Delete':
          this.delete_multi_templates()
          break
        case 'Deselect':
          this.deselect_all()
          break
      }
    },
    resolve_template_editor (state, id) {
      const TEMPLATE = this.$parent.templates.find(template => template.id === id)
      switch (state) {
        case 'edit':
          this.$parent.dontLeave = true
          this.isEditingTemplate = true
          this.editTemplate = id
          this.forceStop += 1
          this.tempEditorStore = TEMPLATE.template
          break
        case 'save':
          this.isEditingTemplate = false
          this.editTemplate = null
          this.update_template(id)
          break
        case 'cancel':
          this.$parent.dontLeave = false
          this.isEditingTemplate = false
          this.editTemplate = null
          TEMPLATE.template = this.tempEditorStore
          break
      }
    },
    check_for_new () {
      this.expandedTemplates = []
      this.$parent.templates.forEach((template) => {
        if (template.template === null || template.template === '<p><br></p>') {
          this.expandedTemplates.push(template.id)
        }
      })
    },

    // CHECKBOX

    change_select_checkbox (id) {
      if (!this.selectedTemplates.includes(id)) {
        this.selectedTemplates.push(id)
      } else {
        const TEMPLATE_INDEX = this.selectedTemplates.indexOf(id)
        this.selectedTemplates.splice(TEMPLATE_INDEX, 1)
      }
    },
    toggle_expanded_templates (id) {
      if (this.expandedTemplates.includes(id)) {
        const TEMPLATE_INDEX = this.expandedTemplates.indexOf(id)
        if (TEMPLATE_INDEX > -1) {
          this.expandedTemplates.splice(TEMPLATE_INDEX, 1)
        }
      } else {
        this.expandedTemplates.push(id)
      }
    },
    select_all () {
      this.$parent.templates.forEach((template) => {
        if (!this.selectedTemplates.includes(template.id)) {
          this.selectedTemplates.push(template.id)
          document.getElementById(`sc-${template.id}`).checked = true
        }
      })
    },
    deselect_all () {
      this.$parent.templates.forEach((template) => {
        document.getElementById(`sc-${template.id}`).checked = false
      })
      this.selectedTemplates = []
    },
    async delete_multi_templates () {
      if (this.selectedTemplates.length !== 0) {
        if (await this.$parent.$refs.confirm_pop_up.show('Are you sure you want to delete all the selected templates?', 'We will remove these templates from our database and it won\'t be recoverable.')) {
          this.selectedTemplates.forEach((templateId) => {
            this.delete_template(templateId)
          })
          this.helper('delete')
          this.deselect_all()
        }
      }
    },

    // DATABASE

    async new_template () {
      try {
        this.$parent.dontLeave = true
        await this.$axios.put('https://api.traininblocks.com/templates',
          {
            pt_id: this.$parent.claims.sub,
            name: this.new_template_form.name,
            template: this.new_template_form.template
          }
        )
        await this.$parent.get_templates(true)
        this.check_for_new()
        this.new_template_form = {
          name: 'Untitled',
          note: ''
        }
        this.helper('new')
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async update_template (id) {
      try {
        this.$parent.dontLeave = true
        const TEMPLATE = this.$parent.templates.find(template => template.id === id)
        await this.$axios.post('https://api.traininblocks.com/templates',
          {
            name: TEMPLATE.name,
            template: TEMPLATE.template,
            id
          }
        )
        await this.$parent.get_templates(true)
        this.helper('update')
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async delete_template (id) {
      try {
        this.$parent.dontLeave = true
        await this.$axios.delete(`https://api.traininblocks.com/templates/${id}`)
        await this.$parent.get_templates(true)
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    }
  }
}
</script>
