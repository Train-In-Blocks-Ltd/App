<style scoped>
  /* Containers */
  .template_options {
    display: flex;
    justify-content: space-between;
    margin: 2rem 0
  }
  .template_container {
    display: grid;
    grid-gap: 2rem;
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
      :options="multiselectOptions"
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
      <button @click="createTemplate()">
        New Template
      </button>
      <a
        v-if="templates && selectedTemplates.length < templates.length"
        href="javascript:void(0)"
        class="a_link select_all"
        @click="selectAll()"
      >
        Select all
      </a>
    </div>
    <div v-if="templates" class="template_container">
      <div
        v-for="(template, index) in templates"
        v-show="((!search) || ((template.name).toLowerCase()).startsWith(search.toLowerCase()))"
        :id="'template-' + template.id"
        :key="index"
        class="template_wrapper editor_object_complex"
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
          v-model="template.template"
          :item-id="template.id"
          :editing="editTemplate"
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
import { mapState } from 'vuex'
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
    if (this.dontLeave ? await this.$parent.$refs.confirm_pop_up.show('Your changes might not be saved', 'Are you sure you want to leave?') : true) {
      this.$store.commit('setData', {
        attr: 'dontLeave',
        data: false
      })
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

      multiselectOptions: [
        { name: 'Delete', svg: 'svg/bin.svg' },
        { name: 'Deselect', svg: null }
      ],
      selectedTemplates: [],
      expandedTemplates: []
    }
  },
  computed: mapState([
    'dontLeave',
    'templates'
  ]),
  created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    this.willBodyScroll(true)
    this.$store.commit('setData', {
      attr: 'loading',
      data: false
    })
  },
  methods: {

    // BACKGROUND

    helper (type) {
      switch (type) {
        case 'new':
          this.$parent.$refs.response_pop_up.show('New template created', 'Edit and use it in a client\'s plan')
          this.$ga.event('Template', 'new')
          break
        case 'update':
          this.$parent.$refs.response_pop_up.show('Updated template', 'Your changes have been saved')
          this.$ga.event('Template', 'update')
          break
        case 'delete':
          this.$parent.$refs.response_pop_up.show(this.selectedTemplates.length > 1 ? 'Deleted templates' : 'Deleted template', 'Your changes have been saved')
          this.$ga.event('Template', 'delete')
          break
      }
    },
    resolve_template_multiselect (res) {
      switch (res) {
        case 'Delete':
          this.delete_multi_templates()
          break
        case 'Deselect':
          this.deselectAll()
          break
      }
    },
    resolve_template_editor (state, id) {
      const TEMPLATE = this.templates.find(template => template.id === id)
      switch (state) {
        case 'edit':
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: true
          })
          this.isEditingTemplate = true
          this.editTemplate = id
          this.forceStop += 1
          this.tempEditorStore = TEMPLATE.template
          break
        case 'save':
          this.isEditingTemplate = false
          this.editTemplate = null
          this.updateTemplate(id)
          break
        case 'cancel':
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: false
          })
          this.isEditingTemplate = false
          this.editTemplate = null
          TEMPLATE.template = this.tempEditorStore
          break
      }
    },
    check_for_new () {
      this.expandedTemplates = []
      this.templates.forEach((template) => {
        if (template.template === null || template.template === '<p><br></p>') {
          this.expandedTemplates.push(template.id)
        }
      })
    },

    // CHECKBOX

    changeSelectCheckbox (id) {
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
    selectAll () {
      this.templates.forEach((template) => {
        if (!this.selectedTemplates.includes(template.id)) {
          this.selectedTemplates.push(template.id)
          document.getElementById(`sc-${template.id}`).checked = true
        }
      })
    },
    deselectAll () {
      this.templates.forEach((template) => {
        document.getElementById(`sc-${template.id}`).checked = false
      })
      this.selectedTemplates = []
    },
    async delete_multi_templates () {
      if (this.selectedTemplates.length !== 0) {
        if (await this.$parent.$refs.confirm_pop_up.show('Are you sure you want to delete all the selected templates?', 'We will remove these templates from our database and it won\'t be recoverable.')) {
          this.selectedTemplates.forEach((templateId) => {
            this.deleteTemplate(templateId)
          })
          this.helper('delete')
          this.deselectAll()
        }
      }
    },

    // DATABASE

    async createTemplate () {
      try {
        await this.$store.dispatch('newTemplate')
        this.check_for_new()
        this.helper('new')
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async updateTemplate (templateId) {
      try {
        await this.$store.dispatch('updateTemplate', templateId)
        this.helper('update')
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async deleteTemplate (templateId) {
      try {
        await this.$store.dispatch('deleteTemplate', templateId)
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    }
  }
}
</script>
