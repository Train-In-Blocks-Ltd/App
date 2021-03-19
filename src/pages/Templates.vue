<style scoped>
  /* Containers */
  .template_options {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem
  }
  .container--templates {
    display: grid;
    grid-gap: 4rem;
    margin: 2rem 0
  }
  .wrapper--template {
    display: grid;
    background-color: var(--fore);
    box-shadow: var(--low_shadow);
    padding: 2rem;
    border-radius: 10px
  }
  .wrapper--template__header {
    display: flex;
    justify-content: space-between
  }
  .header-options {
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
    transition: all .4s
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
  <div id="templates">
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <div v-if="selectedTemplates.length !== 0" class="multi-select">
        <p>
          <b>Selected {{ selectedTemplates.length }} <span v-if="selectedTemplates.length === 1">Template</span><span v-if="selectedTemplates.length !== 1">Templates</span> to ...</b>
        </p>
        <a href="javascript:void(0)" class="a_link" @click="delete_multi_templates()">Delete</a>
        <a href="javascript:void(0)" class="a_link" @click="deselect_all()">Deselect</a>
      </div>
    </transition>
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
    <div v-if="$parent.templates !== null && $parent.templates.length !== 0" class="container--templates">
      <div
        v-for="(template, index) in $parent.templates"
        v-show="((!search) || ((template.name).toLowerCase()).startsWith(search.toLowerCase()))"
        :id="'template-' + template.id"
        :key="index"
        :class="{ editorActive: template.id === editTemplate }"
        class="wrapper--template"
      >
        <div class="wrapper--template__header">
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
          <div class="header-options">
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
    <p v-else class="grey top_margin">
      No templates yet :(
    </p>
  </div>
</template>

<script>
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../components/Editor')
const Checkbox = () => import(/* webpackChunkName: "components.checkbox", webpackPreload: true  */ '../components/Checkbox')

export default {
  components: {
    RichEditor,
    Checkbox
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
          this.$parent.responseHeader = 'New template created'
          this.$parent.responseDesc = 'Edit and use it in a client\'s plan'
          break
        case 'update':
          this.$parent.responseHeader = 'Updated template'
          this.$parent.responseDesc = 'Your changes have been saved'
          break
        case 'delete':
          this.$parent.responseHeader = this.selectedTemplates.length > 1 ? 'Deleted templates' : 'Deleted template'
          this.$parent.responseDesc = 'Your changes have been saved'
          break
      }
    },
    resolve_template_editor (state, id) {
      const template = this.$parent.templates.find(template => template.id === id)
      switch (state) {
        case 'edit':
          this.isEditingTemplate = true
          this.editTemplate = id
          this.forceStop += 1
          this.tempEditorStore = template.template
          break
        case 'save':
          this.isEditingTemplate = false
          this.editTemplate = null
          this.update_template(id)
          break
        case 'cancel':
          this.isEditingTemplate = false
          this.editTemplate = null
          template.template = this.tempEditorStore
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
        const idx = this.selectedTemplates.indexOf(id)
        this.selectedTemplates.splice(idx, 1)
      }
    },
    toggle_expanded_templates (id) {
      if (this.expandedTemplates.includes(id)) {
        const index = this.expandedTemplates.indexOf(id)
        if (index > -1) {
          this.expandedTemplates.splice(index, 1)
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
    delete_multi_templates () {
      if (this.selectedTemplates.length !== 0) {
        if (confirm('Are you sure you want to delete all the selected templates?')) {
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
        const template = this.$parent.templates.find(template => template.id === id)
        await this.$axios.post('https://api.traininblocks.com/templates',
          {
            name: template.name,
            template: template.template,
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
