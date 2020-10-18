<style scoped>

  /* Select */
  .multi-select {
    display: grid;
    grid-gap: .4rem;
    position: fixed;
    top: 0;
    right: 0;
    text-align: right;
    background-color: white;
    box-shadow: 0 0 20px 10px #28282810;
    width: 100%;
    z-index: 9;
    padding: 2rem
  }
  .multi-select a {
    color: #282828;
    text-decoration: none;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .multi-select a:hover {
    opacity: .6
  }
  .select-checkbox {
    vertical-align: middle;
    height: 1.4rem;
    width: 1.4rem;
    cursor: pointer
  }
  .text--selected {
    font-size: .8rem
  }
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
    justify-content: flex-end;
    margin-bottom: 4rem
  }
  .container--templates {
    display: grid;
    grid-gap: 4rem;
    margin: 4rem 0
  }
  .wrapper--template {
    display: grid;
    box-shadow: 0 0 20px 10px #28282810;
    padding: 2rem;
    border-radius: 3px
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
    letter-spacing: 1px;
    border: 0;
    border-bottom: 1px solid #282828;
    font-size: 1rem;
    outline-width: 0;
    cursor: pointer;
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
      box-shadow: 0 0 20px 10px #28282812
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
      <div class="multi-select" v-if="selectedTemplates.length !== 0">
        <p class="text--selected">
          <b>Selected {{selectedTemplates.length}} <span v-if="selectedTemplates.length === 1">Template</span><span v-if="selectedTemplates.length !== 1">Templates</span> to ...</b>
        </p>
        <a href="javascript:void(0)" class="text--selected selected-options" @click="deleteMultiTemplates()">Delete</a>
        <a href="javascript:void(0)" class="text--selected selected-options" @click="deselectAll()">Deselect</a>
      </div>
    </transition>
    <div class="wrapper--template-top">
      <button @click="newTemplate()">New Template</button>
    </div>
    <div class="container--templates" v-if="$parent.templates">
      <p v-if="$parent.templates.length === 0" class="text--small grey">No templates yet :(</p>
      <div
        :id="'template-' + template.id"
        class="wrapper--template"
        :class="{ activeState: template.id === editTemplate }"
        v-for="(template, index) in $parent.templates"
        :key="index">
        <div class="wrapper--template__header">
          <div>
            <span v-if="template.id !== editTemplate" class="text--name" :class="{newTemplate: template.name == 'Untitled' && !isEditingTemplate}"><b>{{template.name}}</b></span><br v-if="template.id !== editTemplate">
            <input v-if="template.id === editTemplate" class="template-name" type="text" name="template-name" pattern="[^\/]" v-model="template.name" /><br>
          </div>
          <div class="header-options">
            <input name="select-checkbox" :id="'sc-' + template.id" class="select-checkbox" type="checkbox" @change="changeSelectCheckbox(template.id)" aria-label="Select this template">
            <inline-svg id="expand" class="icon--expand" :class="{expanded: expandedTemplates.includes(template.id)}" :src="require('../assets/svg/expand.svg')" title="Info" @click="toggleExpandedTemplates(template.id)"/>
          </div>
        </div>
        <quill v-if="template.id === editTemplate && expandedTemplates.includes(template.id)" v-model="template.template" output="html" class="quill animate animate__fadeIn" :config="$parent.quill_config"/>
        <div v-if="template.id !== editTemplate && expandedTemplates.includes(template.id) && template.template !== null && template.template !== ''" v-html="removeBracketsAndBreaks(template.template)" tabindex="0" class="show-template animate animate__fadeIn"/>
        <p v-if="template.id !== editTemplate && expandedTemplates.includes(template.id) && (template.template === null || template.template === '')" class="grey text--no-content">No content yet :(</p>
        <div class="bottom-bar" v-if="expandedTemplates.includes(template.id)">
          <div>
            <button v-show="!isEditingTemplate" v-if="template.id !== editTemplate" @click="editingTemplateNotes(template.id, true), tempQuillStore = template.template">Edit</button>
            <button v-if="template.id === editTemplate" @click="editingTemplateNotes(template.id, false)">Save</button>
            <button class="cancel" v-if="template.id === editTemplate" @click="cancelTemplateNotes(), template.template = tempQuillStore">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InlineSvg from 'vue-inline-svg'
  import axios from 'axios'

  export default {
    components: {
      InlineSvg
    },
    data () {
      return {
        // TEMPLATE DATA //
        tempQuillStore: null,
        isEditingTemplate: false,
        editTemplate: null,
        new_template: {
          name: 'Untitled',
          note: null
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
      this.$parent.loading = false
    },
    async mounted () {
      await this.$parent.getTemplates()
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
          if (confirm('Are you sure you want to delete all the selected template?')) {
            this.selectedTemplates.forEach((templateId) => {
              this.delete_template(templateId)
            })
            this.deselectAll()
          }
        }
      },
      deselectAll () {
        this.$parent.templates.forEach((template) => {
          var selEl = document.getElementById('sc-' + template.id)
          if (selEl.checked === true) {
            selEl.checked = false
            var idx = this.selectedTemplates.indexOf(template.id)
            this.selectedTemplates.splice(idx, 1)
          }
        })
      },
      changeSelectCheckbox (id) {
        if (this.selectedTemplates.includes(id) === false) {
          this.selectedTemplates.push(id)
        } else {
          var idx = this.selectedTemplates.indexOf(id)
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
      removeBracketsAndBreaks (dataIn) {
        if (dataIn !== null) {
          return dataIn.replace(/[[\]]/g, '')
        } else {
          return dataIn
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
      /*
        Need to add in store in local storage methods
        Need to add delete method
      */
      async newTemplate () {
        try {
          this.$parent.loading = true
          this.$parent.dontLeave = true
          await axios.put('https://api.traininblocks.com/templates',
            {
              pt_id: this.$parent.claims.sub,
              name: this.new_template.name,
              template: this.new_template.template
            }
          )
          await this.$parent.getTemplates()
          this.checkForNew()
          this.new_template = {
            name: 'Untitled',
            note: null
          }
          this.$parent.loading = false
          this.$parent.dontLeave = false
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          this.$parent.willBodyScroll(false)
          console.error(e)
        }
      },
      async updateTemplate (id) {
        try {
          let templateName
          let templateContent
          this.$parent.loading = true
          this.$parent.dontLeave = true
          if (this.$parent.templates.length !== 0) {
            this.$parent.templates.forEach((item) => {
              if (item.id === id) {
                templateName = item.name
                templateContent = item.template
              }
            })
          }
          await axios.post('https://api.traininblocks.com/templates',
            {
              name: templateName,
              template: templateContent,
              id: id
            }
          )
          await this.$parent.getTemplates()
          this.$parent.loading = false
          this.$parent.dontLeave = false
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          this.$parent.willBodyScroll(false)
          console.error(e)
        }
      },
      async delete_template (id) {
        try {
          this.$parent.loading = true
          this.$parent.dontLeave = true
          await axios.delete(`https://api.traininblocks.com/templates/${id}`)
          await this.$parent.getTemplates()
          this.$parent.loading = false
          this.$parent.dontLeave = false
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          this.$parent.willBodyScroll(false)
          console.error(e)
        }
      }
    }
  }
</script>
