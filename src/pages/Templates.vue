
<style scoped>

  /* Select */
  .multi-select {
    display: grid;
    grid-gap: .4rem;
    position: fixed;
    right: 2rem;
    text-align: right;
    background-color: #FFFFFF99;
    z-index: 99;
    padding: 1rem 0 1rem 1rem
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
  .wrapper--template-top {
    display: flex;
    justify-content: flex-end
  }
  .container--template-notes {
    display: grid;
    grid-gap: 6rem
  }
  .template-notes__header {
    display: flex;
    justify-content: space-between
  }
  .header-options {
    display: flex;
    flex-direction: column;
    align-items: center
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
  }
</style>

<template>
  <div id="templates">
    <div class="wrapper--template-top">
      <button @click="newTemplate()">New Template</button>
    </div>
    <div :id="'template-' + template.id" class="wrapper--template" v-for="(template, index) in $parent.templates"
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
      <quill v-if="template.id === editTemplate && expandedTemplates.includes(template.id)" v-model="template.notes" output="html" class="quill animate animate__fadeIn" :config="$parent.quill_config"/>
      <div v-if="template.id !== editTemplate && expandedTemplates.includes(template.id)" v-html="removeBracketsAndBreaks(template.notes)" tabindex="0" class="show-template animate animate__fadeIn"/>
      <div class="bottom-bar" v-if="expandedTemplates.includes(template.id)">
        <div>
          <button v-show="!isEditingTemplate" v-if="template.id !== editTemplate" @click="editingTemplateNotes(template.id, true)">Edit</button>
          <button v-if="template.id === editTemplate" @click="editingTemplateNotes(template.id, false)">Save</button>
          <button class="cancel" v-if="template.id === editTemplate" @click="cancelTemplateNotes()">Cancel</button>
          <button class="delete" v-show="isEditingTemplate" @click="deleteTemplate(template.id)">Delete</button>
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
        isEditingTemplate: false,
        editTemplate: null,
        new_template: {
          name: 'Untitled',
          note: ''
        },
        selectedTemplates: []
      }
    },
    async mounted () {
      await this.getTemplates()
    },
    methods: {
      // BACKGROUND METHODS //-------------------------------------------------------------------------------
      deleteTemplate (id) {
        if (confirm('Are you sure you want to delete this template?')) {
          this.delete_template(id, true)
        }
      },
      deleteMultiTemplates () {
        if (this.selectedTemplates.length !== 0) {
          var ready = confirm('Are you sure you want to delete all the selected template?')
          this.selectedTemplates.forEach((templateId) => {
            this.delete_template(templateId, ready)
          })
          this.deselectAll()
        }
      },
      deselectAll () {
        this.templates.forEach((template) => {
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
        if (state) {
          window.addEventListener('keydown', this.quickSaveTemplateNotes)
        } else {
          this.updateTemplateNotes(id)
          window.removeEventListener('keydown', this.quickSaveTemplateNotes)
        }
      },
      quickSaveTemplateNotes (key, state) {
        if (key.keyCode === 13 && key.ctrlKey === true) {
          this.updateTemplateNotes(this.editTemplate)
          window.removeEventListener('keydown', this.quickSaveTemplateNotes)
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
        window.removeEventListener('keydown', this.quickSaveTemplateNotes)
      },

      // DATABASE METHODS //-------------------------------------------------------------------------------
      /*
        Need to use these to update create and get the templates
        Need to add in store in local storage methods
        Need to create vue data to store the responses in
      */
      async newTemplate () {
        try {
          this.$parent.loading = true
          this.$parent.dontLeave = true
          await axios.put('https://api.traininblocks.com/templates',
            {
              pt_id: this.$parent.claims.sub,
              name: this.new_template.name,
              template: this.new_template.note
            }
          )
          await this.getTemplates()
          this.new_template = {
            name: 'Untitled',
            note: ''
          }
          this.$parent.loading = false
          this.$parent.dontLeave = false
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
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
              //eslint-disable-next-line
              if (item.id == id) {
                templateName = item.name
                templateContent = item.template
              }
            })
          }
          await axios.post('https://api.traininblocks.com/templates',
            {
              name: templateName,
              template: templateContent
            }
          )
          await this.getTemplates()
          this.$parent.loading = false
          this.$parent.dontLeave = false
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          console.error(e)
        }
      },
      async getTemplates () {
        try {
          const response = await axios.get(`https://api.traininblocks.com/templates/${this.$parent.claims.sub}`)
          this.templates = response.data
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          console.error(e)
        }
      }
    }
  }
</script>
