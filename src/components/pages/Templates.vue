
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
    <transition enter-active-class="animate animate__fadeIn animate__faster" leave-active-class="animate animate__fadeOut animate__faster">
      <div class="multi-select" v-if="selectedTemplates.length !== 0">
        <p class="text--selected">
          <b>Selected {{selectedTemplates.length}} <span v-if="selectedTemplates.length === 1">Template</span><span v-if="selectedTemplates.length !== 1">Templates</span> to ...</b>
        </p>
        <a href="javascript:void(0)" class="text--selected selected-options">Delete</a>
        <a href="javascript:void(0)" class="text--selected selected-options" @click="deselectAll()">Deselect all</a>
      </div>
    </transition>
    <h1 class="main-title">Templates</h1>
    <p class="expand-all" @click="expandAll(expandText(expandedTemplates))">{{ expandText(expandedTemplates) }} all</p>
    <button @click="saveTemplate()">Press</button>
    <div class="container--template-notes">
      <div class="template-notes" v-for="(item, index) in storedTemplates" :key="'temp-' + index">
        <div class="template-notes__header">
          <p class="template-notes__header__text"><b>{{item.name}}</b></p>
          <div class="header-options">
            <input name="select-checkbox" :id="'temp-sc-' + index" class="select-checkbox" type="checkbox" @change="changeSelectCheckbox(index)" aria-label="Select this template">
            <inline-svg id="expand" class="icon--expand" :class="{expanded: expandedTemplates.includes(index)}" :src="require('../../assets/svg/expand.svg')" @click="toggleExpandedTemplates(index)"/>
          </div>
        </div>
        <quill v-show="isEditingTemplate && expandedTemplates.includes(index)" v-model="item.html" output="html" class="quill animate animate__fadeIn" :config="$parent.quill_config"/>
        <div v-if="!isEditingTemplate && expandedTemplates.includes(index)" v-html="item.html" class="show-template-notes animate animate__fadeIn"/>
        <div class="bottom-bar" v-if="expandedTemplates.includes(index)">
          <div>
            <button v-show="!isEditingTemplate" @click="editingTemplateNotes(index, true)" class="button--edit">Edit</button>
            <button v-show="isEditingTemplate && editTemplate === index" @click="editingTemplateNotes(index, false)" class="button--save">Save</button>
            <button v-show="isEditingTemplate && editTemplate === index" @click="cancelTemplateNotes()" class="cancel">Cancel</button>
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
        isEditingTemplate: false,
        editTemplate: null,
        expandedTemplates: [],
        selectedTemplates: [],
        storedTemplates: []
      }
    },
    created () {
      this.$parent.claims.templates.replace(/\},/g, '}},').split('},').forEach((item) => {
        this.storedTemplates.push(JSON.parse(item))
      })
    },
    methods: {

      // BACKGROUND METHODS //-------------------------------------------------------------------------------

      changeSelectCheckbox (id) {
        if (this.selectedTemplates.includes(id) === false) {
          this.selectedTemplates.push(id)
        } else {
          var idx = this.selectedTemplates.indexOf(id)
          this.selectedTemplates.splice(idx, 1)
        }
      },
      expandAll (toExpand) {
        this.$parent.claims.templates.forEach((item, index) => {
          if (toExpand === 'Expand') {
            this.expandedTemplates.push(index)
          } else {
            let x = 0
            let y = this.expandedTemplates.length
            for (; x < y; x++) {
              this.expandedTemplates.pop()
            }
          }
        })
      },
      expandText (array) {
        if (array.length !== 0) {
          return 'Collapse'
        } else {
          return 'Expand'
        }
      },
      deselectAll () {
        this.$parent.claims.templates.forEach((item, index) => {
          var selEl = document.getElementById('temp-sc-' + index)
          if (selEl.checked === true) {
            selEl.checked = false
            var idx = this.selectedTemplates.indexOf(index)
            this.selectedTemplates.splice(idx, 1)
          }
        })
      },

      // TEMPLATES METHODS //-------------------------------------------------------------------------------

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
        if (state) {
          window.addEventListener('keydown', this.quickSaveTemplateNotes)
        } else {
          // UPDATE
          window.removeEventListener('keydown', this.quickSaveTemplateNotes)
        }
      },
      quickSaveTemplateNotes (key, state) {
        if (key.keyCode === 13 && key.ctrlKey === true) {
          // UPDATE
          window.removeEventListener('keydown', this.quickSaveTemplateNotes)
        }
      },
      cancelTemplateNotes () {
        this.editTemplate = null
        this.isEditingTemplate = false
        window.removeEventListener('keydown', this.quickSaveTemplateNotes)
      }
    }
  }
</script>
