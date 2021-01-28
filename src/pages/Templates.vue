<style scoped>
  .expand-all {
    text-align: right;
    margin: 2rem 0;
    font-size: .8rem;
    cursor: pointer;
    opacity: 1;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .expand-all:hover {
    opacity: .6
  }

  /* Containers */
  .activeState {
    border: 2px solid #28282860
  }
  .wrapper--template-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4rem
  }
  .container--templates {
    display: grid;
    grid-gap: 4rem;
    margin: 4rem 0
  }
  .wrapper--template {
    display: grid;
    box-shadow: 0 0 20px 10px #28282808;
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
  input.template-name {
    text-overflow: ellipsis;
    border: 0;
    border-bottom: 1px solid #282828;
    font-size: 1rem;
    outline-width: 0;
    padding: 0;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  input.template-name:hover {
    opacity: .6
  }
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
      top: -2rem;
      right: 0;
      padding: 2rem;
      width: 100%;
      background-color: white;
      box-shadow: 0 0 20px 10px #28282816
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
    <transition enter-active-class="animate animate__fadeIn animate__faster" leave-active-class="animate animate__fadeOut animate__faster">
      <div v-if="selectedTemplates.length !== 0" class="multi-select">
        <p class="text--selected">
          <b>Selected {{ selectedTemplates.length }} <span v-if="selectedTemplates.length === 1">Template</span><span v-if="selectedTemplates.length !== 1">Templates</span> to ...</b>
        </p>
        <a href="javascript:void(0)" class="text--selected selected-options" @click="deleteMultiTemplates()">Delete</a>
        <a href="javascript:void(0)" class="text--selected selected-options" @click="deselect_all()">Deselect</a>
      </div>
    </transition>
    <div class="wrapper--template-top">
      <p class="text--large">
        Templates
      </p>
      <button @click="newTemplate()">
        New Template
      </button>
    </div>
    <div v-if="$parent.templates" class="container--templates">
      <p v-if="$parent.templates.length === 0" class="text--small grey">
        No templates yet :(
      </p>
      <div
        v-for="(template, index) in $parent.templates"
        :id="'template-' + template.id"
        :key="index"
        class="wrapper--template"
        :class="{ activeState: template.id === editTemplate }"
      >
        <div class="wrapper--template__header">
          <span v-if="template.id !== editTemplate" class="text--name" :class="{newTemplate: template.name == 'Untitled' && !isEditingTemplate}"><b>{{ template.name }}</b></span><br v-if="template.id !== editTemplate">
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
              @click="toggleExpandedTemplates(template.id)"
            />
          </div>
        </div>
        <rich-editor
          v-show="expandedTemplates.includes(template.id)"
          :show-edit-state="template.id === editTemplate"
          :html-injection.sync="template.template"
          :empty-placeholder="'What do you plan for your clients frequently?'"
        />
        <div v-if="expandedTemplates.includes(template.id)" class="bottom_bar">
          <button v-if="template.id !== editTemplate && !isEditingTemplate" @click="editingTemplateNotes(template.id, true), tempEditorStore = template.template">
            Edit
          </button>
          <button v-if="template.id === editTemplate" @click="editingTemplateNotes(template.id, false)">
            Save
          </button>
          <button v-if="template.id === editTemplate" class="cancel" @click="cancelTemplateNotes(), template.template = tempEditorStore">
            Cancel
          </button>
        </div>
      </div>
    </div>
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
      // TEMPLATE DATA //
      tempEditorStore: null,
      isEditingTemplate: false,
      editTemplate: null,
      new_template: {
        name: 'Untitled',
        note: ''
      },
      selectedTemplates: [],
      expandedTemplates: []
    }
  },
  created () {
    this.$parent.loading = true
    this.$parent.setup()
    this.$parent.splashed = true
    this.$parent.willBodyScroll(true)
    this.$parent.end_loading()
  },
  async mounted () {
    await this.$parent.get_templates()
    this.checkForNew()
  },
  methods: {
    // BACKGROUND METHODS //-------------------------------------------------------------------------------
    checkForNew () {
      this.expandedTemplates.length = 0
      this.$parent.templates.forEach((template) => {
        if (template.template === null || template.template === '<p><br></p>') {
          this.expandedTemplates.push(template.id)
        }
      })
    },
    deleteMultiTemplates () {
      if (this.selectedTemplates.length !== 0) {
        if (confirm('Are you sure you want to delete all the selected templates?')) {
          this.selectedTemplates.forEach((templateId) => {
            this.delete_template(templateId)
          })
          this.deselect_all()
        }
      }
    },
    deselect_all () {
      this.$parent.templates.forEach((template) => {
        const selEl = document.getElementById('sc-' + template.id)
        if (selEl.checked === true) {
          selEl.checked = false
          const idx = this.selectedTemplates.indexOf(template.id)
          this.selectedTemplates.splice(idx, 1)
        }
      })
    },
    change_select_checkbox (id) {
      if (this.selectedTemplates.includes(id) === false) {
        this.selectedTemplates.push(id)
      } else {
        const idx = this.selectedTemplates.indexOf(id)
        this.selectedTemplates.splice(idx, 1)
      }
    },
    toggleExpandedTemplates (id) {
      if (this.expandedTemplates.includes(id)) {
        const index = this.expandedTemplates.indexOf(id)
        if (index > -1) {
          this.expandedTemplates.splice(index, 1)
        }
      } else {
        this.expandedTemplates.push(id)
      }
    },
    editingTemplateNotes (id, state) {
      this.isEditingTemplate = state
      this.editTemplate = id
      if (!state) {
        this.updateTemplateNotes(id)
      }
    },
    updateTemplateNotes (id) {
      this.updateTemplate(id)
      this.isEditingTemplate = false
      this.editTemplate = null
    },
    cancelTemplateNotes () {
      this.editTemplate = null
      this.isEditingTemplate = false
    },
    // DATABASE METHODS //-------------------------------------------------------------------------------
    async newTemplate () {
      try {
        this.$parent.pause_loading = true
        this.$parent.dontLeave = true
        await this.$axios.put('https://api.traininblocks.com/templates',
          {
            pt_id: this.$parent.claims.sub,
            name: this.new_template.name,
            template: this.new_template.template
          }
        )
        await this.$parent.get_templates(true)
        this.checkForNew()
        this.new_template = {
          name: 'Untitled',
          note: ''
        }
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async updateTemplate (id) {
      try {
        let templateName
        let templateContent
        this.$parent.pause_loading = true
        this.$parent.dontLeave = true
        if (this.$parent.templates.length !== 0) {
          this.$parent.templates.forEach((item) => {
            if (item.id === id) {
              templateName = item.name
              templateContent = item.template
            }
          })
        }
        await this.$axios.post('https://api.traininblocks.com/templates',
          {
            name: templateName,
            template: templateContent,
            id
          }
        )
        await this.$parent.get_templates(true)
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async delete_template (id) {
      try {
        this.$parent.pause_loading = true
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
