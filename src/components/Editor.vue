<style>
.editorActive {
  border: 2px solid var(--base_faint)
}
div#rich_editor, div#rich_show_content {
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none
}
div#rich_show_content, .placeholder {
  cursor: pointer;
  padding: 1rem;
  border: 1px solid var(--base_faint);
  border-radius: 10px;
  margin-top: 1rem;
  transition: .6s opacity cubic-bezier(.165, .84, .44, 1), .6s border cubic-bezier(.165, .84, .44, 1)
}
div#rich_show_content:hover, .placeholder:hover {
  border: 1px solid var(--base_light);
  opacity: .6
}
div#rich_editor div,
div#rich_editor p,
div#rich_show_content div,
div#rich_show_content p {
  margin: .6rem 0
}
div#rich_editor img,
div#rich_show_content img {
  cursor: pointer;
  border-radius: 10px;
  max-width: 80%;
  margin: 1rem 0;
  transition: .4s all cubic-bezier(.165, .84, .44, 1)
}
div#rich_editor img:hover {
  opacity: .6
}
div#rich_editor input[type='checkbox'],
div#rich_show_content input[type='checkbox'] {
  margin: .4rem
}
div#rich_editor a,
div#rich_show_content a {
  color: var(--link)
}
</style>

<style scoped>

/* Attr */
[data-placeholder]:empty:before {
  content: attr(data-placeholder);
  color: #888888;
  font-style: italic
}

/* Tools */
a#link_bar {
  color: var(--base);
  padding: .2rem .6rem
}
#style_bar, #link_bar {
  z-index: 1;
  position: fixed;
  top: 0;
  padding: .2rem;
  border-radius: 5px;
  background-color: var(--fore);
  box-shadow: var(--high_shadow);
  transition: var(--transition_standard)
}
#style_bar button {
  padding: 0;
  margin: .2rem .6rem;
  color: var(--base);
  background-color: transparent
}
.re_toolbar_back {
  position: sticky;
  top: 0;
  padding-top: 1rem;
  background-color: var(--fore)
}
#rich_toolbar {
  background-color: var(--fore);
  border: 1px solid var(--base_faint);
  border-radius: 10px 10px 0 0;
  padding: 0 1rem;
  transition: var(--transition_standard)
}
#rich_toolbar.showingPopup {
  border-bottom: 1px solid transparent
}
#rich_toolbar button {
  padding: 0;
  margin: .8rem 1rem .6rem 0;
  color: var(--base);
  background-color: transparent
}
.activeStyle {
  opacity: .4
}
#rich_toolbar svg, #style_bar svg {
  height: 20px;
  width: 20px
}

/* Pop-ups */
.pop_up--add_link, .pop_up--add_image, .pop_up--add_template {
  position: sticky;
  top: calc(1rem + 44.39px);
  background-color: var(--fore);
  z-index: 1;
  display: flex;
  border-left: 1px solid var(--base_faint);
  border-right: 1px solid var(--base_faint);
  border-bottom: 1px solid var(--base_faint);
  padding: .8rem
}
.pop_up--add_template {
  display: grid;
  grid-gap: 1rem;
  max-height: 250px;
  overflow-y: auto
}
.pop_up--add_template > h2 {
  margin-top: 1rem
}
.template_item svg {
  cursor: pointer;
  margin-left: 1rem;
  vertical-align: middle;
  transition: var(--transition_standard)
}
.template_item svg:hover {
  opacity: .6
}
.input--add_link {
  padding: .2rem .4rem;
  border: 1px solid var(--base_faint);
  border-radius: 3px;
  margin-right: 1rem
}
button.add_link_submit {
  height: auto;
  margin: 0
}
#templates_search_none {
  display: none
}

/* Editor */
div#rich_editor {
  padding: 1rem;
  outline-width: 0;
  border: 1px solid var(--base_faint);
  border-top: none;
  border-radius: 0 0 10px 10px;
  transition: var(--transition_standard)
}
.bottom_bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: .6rem;
  margin-top: 1rem;
  z-index: 1
}

/* Responsive */
@media (max-width: 768px) {
  div#rich_show_content img, div#rich_show_content iframe {
    max-width: 100%
  }
  .pop_up--add_link {
    display: grid;
    grid-gap: .6rem
  }
}
</style>

<template>
  <div id="wrapper--rich_editor">
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <response-pop-up ref="response_pop_up" />
    </transition>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <global-overlay ref="overlay" />
    </transition>
    <preview-modal
      :desc="previewDesc"
      :html="previewHTML"
      :show-media="true"
      @close="previewDesc = null, previewHTML = null"
    />
    <div v-if="editState">
      <div
        id="style_bar"
      >
        <button
          :class="{ activeStyle: boldActive }"
          title="Bold (CMD/Ctrl + B)"
          class="fadeIn"
          @click="format_style('bold'), check_cmd_state(), focus_on_editor()"
        >
          <inline-svg :src="require('../assets/svg/editor/bold.svg')" />
        </button>
        <button
          :class="{ activeStyle: italicActive }"
          title="Italic (CMD/Ctrl + I)"
          class="fadeIn"
          @click="format_style('italic'), check_cmd_state(), focus_on_editor()"
        >
          <inline-svg :src="require('../assets/svg/editor/italic.svg')" />
        </button>
        <button
          :class="{ activeStyle: underlineActive }"
          title="Underline (CMD/Ctrl + U)"
          class="fadeIn"
          @click="format_style('underline'), check_cmd_state(), focus_on_editor()"
        >
          <inline-svg :src="require('../assets/svg/editor/underline.svg')" />
        </button>
      </div>
      <a
        id="link_bar"
        :href="linkAddress"
        target="_blank"
      >
        {{ linkAddress }}
      </a>
      <div class="re_toolbar_back">
        <div id="rich_toolbar" :class="{ showingPopup: showAddLink || showAddImage || showAddTemplate }">
          <button
            :class="{ activeStyle: olActive }"
            title="Ordered List"
            :disabled="!inEditor"
            @click="add_list('ol'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/ol.svg')" />
          </button>
          <button
            :class="{ activeStyle: ulActive }"
            title="Unordered List"
            :disabled="!inEditor"
            @click="add_list('ul'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/ul.svg')" />
          </button>
          <button
            :class="{ activeStyle: ulActive }"
            title="Checkbox"
            :disabled="!inEditor"
            @click="add_checkbox(), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/checkbox.svg')" />
          </button>
          <button
            title="Add Link"
            :disabled="!inEditor"
            @click="showAddLink = !showAddLink, reset_img_pop_up(), reset_template_pop_up()"
          >
            <inline-svg :src="require('../assets/svg/editor/link.svg')" />
          </button>
          <button
            title="Insert Image"
            :disabled="!inEditor"
            @click="showAddImage = !showAddImage, reset_link_pop_up(), reset_template_pop_up()"
          >
            <inline-svg :src="require('../assets/svg/editor/image.svg')" />
          </button>
          <button
            v-if="dataForTemplates !== undefined && dataForTemplates !== null"
            title="Use Template"
            :disabled="!inEditor"
            @click="showAddTemplate = !showAddTemplate, reset_link_pop_up(), reset_img_pop_up(), will_body_scroll(false)"
          >
            <inline-svg :src="require('../assets/svg/editor/template.svg')" />
          </button>
        </div>
      </div>
      <!-- LINK -->
      <form v-if="showAddLink" class="pop_up--add_link" @submit.prevent="add_link()">
        <input v-model="addLinkName" class="input--add_link small_border_radius" type="text" placeholder="Name" required>
        <input v-model="addLinkURL" class="input--add_link small_border_radius" type="text" placeholder="URL" required>
        <button class="add_link_submit" type="submit">
          Add
        </button>
      </form>
      <!-- IMAGE -->
      <div v-if="showAddImage" class="pop_up--add_image">
        <input id="img_uploader" type="file" accept=".png, .jpeg, .jpg, .webp, .gif" @change="add_img()">
      </div>
      <!-- TEMPLATE -->
      <div v-if="showAddTemplate" class="pop_up--add_template small_border_radius">
        <input
          v-if="dataForTemplates.length !== 0"
          v-model="search"
          type="search"
          aria-label="Search templates"
          rel="search"
          placeholder="Search templates"
          @input="isSearchEmpty()"
        >
        <h2 v-show="search === ''">
          System templates
        </h2>
        <div v-show="search === ''" class="template_item">
          <button @click="add_template('<div>[ EXERCISE: SETS x REPS at LOAD ]</div><div>Tip: You can break LOAD into different sets. E.g. 70/80/90kg where SETS must be 3.</div>')">
            Track with sets, reps, and load
          </button>
        </div>
        <div v-show="search === ''" class="template_item">
          <button @click="add_template('<div>[ EXERCISE: SETS x REPS ]</div>')">
            Track with sets, reps
          </button>
        </div>
        <div v-show="search === ''" class="template_item">
          <button @click="add_template('<div>[ MEASUREMENT: VALUE ]</div><div>You can use any single measurements like [ BD Fat: 16% ]. E.g. RPE, weight, body-fat, jump height, etc. </div>')">
            Track with other measurements
          </button>
        </div>
        <h2>
          Your templates
        </h2>
        <div
          v-for="(item, index) in dataForTemplates"
          v-show="((!search) || ((item.name).toLowerCase()).startsWith(search.toLowerCase()))"
          :key="'template-' + index"
          class="template_item"
        >
          <button @click="add_template(item.template)">
            {{ item.name }}
          </button>
          <inline-svg
            :src="require('../assets/svg/editor/preview.svg')"
            @click="previewDesc = item.name, previewHTML = item.template, will_body_scroll(false)"
          />
        </div>
        <p id="templates_search_none">
          No templates found
        </p><br>
      </div>
      <div
        id="rich_editor"
        contenteditable="true"
        data-placeholder="Start typing..."
        @click="save_selection(), check_cmd_state(), reset_link_pop_up(), reset_img_pop_up(), reset_template_pop_up(), will_body_scroll(true)"
        @keyup="save_selection(), update_edited_notes()"
        v-html="update_content(initialHTML)"
      />
    </div>
    <div v-if="editState" class="bottom_bar">
      <button @click="editState = false , $emit('on-edit-change', 'save', itemId)">
        Save
      </button>
      <button class="red_button" @click="editState = false , $emit('on-edit-change', 'cancel', itemId)">
        Cancel
      </button>
    </div>
    <div
      v-if="!editState && !test_empty_html(htmlInjection)"
      id="rich_show_content"
      @click="editState = true, $emit('on-edit-change', 'edit', itemId)"
      v-html="update_content(remove_brackets(htmlInjection))"
    />
    <p
      v-if="!editState && test_empty_html(htmlInjection)"
      class="placeholder grey"
      @click="editState = true, $emit('on-edit-change', 'edit', itemId)"
    >
      {{ emptyPlaceholder }}
    </p>
  </div>
</template>

<script>
import Compressor from 'compressorjs'
const PreviewModal = () => import(/* webpackChunkName: "components.previewModal", webpackPrefetch: true */ './PreviewModal')

export default {
  components: {
    PreviewModal
  },
  props: {
    itemId: [Number, String],
    editing: [Number, String],
    htmlInjection: String,
    emptyPlaceholder: String,
    dataForTemplates: Array,
    forceStop: Number
  },
  data () {
    return {
      // System
      isMobile: false,
      linkAddress: '',
      editState: false,
      search: '',
      inEditor: false,
      savedSelection: null,
      initialHTML: '',
      editedHTML: '',

      // Style state
      boldActive: false,
      italicActive: false,
      underlineActive: false,
      olActive: false,
      ulActive: false,

      // Pop up
      showAddLink: false,
      addLinkName: '',
      addLinkURL: '',
      showAddImage: false,
      base64Img: null,
      showAddTemplate: false,

      // Preview
      previewDesc: null,
      previewHTML: null
    }
  },
  watch: {
    editState () {
      this.initialHTML = this.htmlInjection
      this.isMobile = /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (this.editState) {
        document.addEventListener('keyup', this.check_cmd_state)
        document.addEventListener('click', this.toggle_formatter)
        document.addEventListener(this.isMobile ? 'touchstart' : 'keydown', this.toggle_formatter)
      } else {
        document.removeEventListener('keyup', this.check_cmd_state)
        document.removeEventListener('click', this.toggle_formatter)
        document.removeEventListener(this.isMobile ? 'touchstart' : 'keydown', this.toggle_formatter)
      }
    },
    forceStop () {
      if (this.editing !== this.itemId) {
        this.editState = false
      }
    }
  },
  methods: {

    // Misc.

    isSearchEmpty () {
      let showNoneMsg = false
      this.dataForTemplates.forEach((template) => {
        if (!(((template.name).toLowerCase()).startsWith(this.search.toLowerCase()) && this.search !== '')) {
          showNoneMsg = this.search !== ''
        }
      })
      document.getElementById('templates_search_none').style.display = showNoneMsg ? 'block' : 'none'
    },
    focus_on_editor () {
      document.getElementById('rich_editor').focus()
    },
    will_body_scroll (state) {
      const body = document.getElementsByTagName('body')[0]
      if (state) {
        body.style.overflow = 'auto'
      } else {
        body.style.overflow = 'hidden'
      }
    },
    check_cmd_state () {
      const boldState = document.queryCommandState('bold')
      const italicState = document.queryCommandState('italic')
      const underlineState = document.queryCommandState('underline')
      const orderedListState = document.queryCommandState('insertOrderedList')
      const unorderedListState = document.queryCommandState('insertUnorderedList')
      this.boldActive = boldState
      this.italicActive = italicState
      this.underlineActive = underlineState
      this.olActive = orderedListState
      this.ulActive = unorderedListState
    },
    remove_brackets (dataIn) {
      if (dataIn !== null) {
        return dataIn.replace(/[[\]]/g, '').replace(/(checkbox")/g, 'checkbox" disabled').replace('onclick="resize(this)"', '')
      } else {
        return dataIn
      }
    },
    test_empty_html (text) {
      if (text !== null) {
        const rmTags = text.replace(/<[^>]*>?/gm, '')
        const rmSpace = rmTags.replace(/&nbsp;/g, '').replace(/ /g, '')
        if (rmSpace === '') {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    update_edited_notes () {
      this.editedHTML = document.getElementById('rich_editor').innerHTML
      this.$emit('update:htmlInjection', this.editedHTML)
    },
    paste_html_at_caret (html, selectPastedContent) {
      let sel, range
      if (window.getSelection) {
        sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0)
          range.deleteContents()

          const el = document.createElement('div')
          el.innerHTML = html
          const frag = document.createDocumentFragment()
          let node, lastNode
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node)
          }
          const firstNode = frag.firstChild
          range.insertNode(frag)

          if (lastNode) {
            range = range.cloneRange()
            range.setStartAfter(lastNode)
            if (selectPastedContent) {
              range.setStartBefore(firstNode)
            } else {
              range.collapse(true)
            }
            sel.removeAllRanges()
            sel.addRange(range)
          }
        }
      }
      this.update_edited_notes()
    },
    save_selection () {
      let sel
      if (window.getSelection) {
        sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          this.savedSelection = sel.getRangeAt(0)
        }
      } else if (document.selection && document.selection.createRange) {
        this.savedSelection = document.selection.createRange()
      }
    },
    restore_selection () {
      let sel
      if (this.savedSelection) {
        if (window.getSelection) {
          sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(this.savedSelection)
        } else if (document.selection && this.savedSelection.select) {
          this.savedSelection.select()
        }
      }
    },

    // TEXT

    get_caret_coordinates () {
      let x = 0
      let y = 0
      const isSupported = typeof window.getSelection !== 'undefined'
      if (isSupported) {
        const selection = window.getSelection()
        if (selection.rangeCount !== 0) {
          const range = selection.getRangeAt(0).cloneRange()
          range.collapse(true)
          const rect = range.getClientRects()[0]
          if (rect) {
            x = rect.left
            y = rect.top
          }
        }
      }
      return { x, y }
    },
    toggle_formatter (event) {
      const contenteditable = document.getElementById('rich_editor')
      const formatter = document.getElementById('style_bar')
      const linker = document.getElementById('link_bar')
      const { x, y } = this.get_caret_coordinates()
      const containing = contenteditable.contains(event.target) || false
      const sel = window.getSelection()
      this.inEditor = containing
      if (containing && sel.type === 'Range' && x !== 0 && y !== 0) {
        formatter.setAttribute('aria-hidden', 'false')
        formatter.setAttribute(
          'style',
          `left: ${x - 32}px; top: ${this.isMobile ? y : y + 22}px`
        )
      } else if (containing && sel.focusNode.parentNode.nodeName === 'A' && x !== 0 && y !== 0) {
        linker.setAttribute('aria-hidden', 'false')
        linker.setAttribute(
          'style',
          `left: ${x - 32}px; top: ${this.isMobile ? y : y + 22}px`
        )
        this.linkAddress = sel.focusNode.parentNode.attributes.href.value
      } else if (containing && event.target.nodeName === 'IMG') {
        switch (event.target.style.cssText) {
          case 'max-width: 80%;':
            event.target.style = 'max-width: 60%;'
            break
          case 'max-width: 60%;':
            event.target.style = 'max-width: 40%;'
            break
          case 'max-width: 40%;':
            event.target.style = 'max-width: 80%;'
            break
          default:
            event.target.style = 'max-width: 60%;'
            break
        }
      } else {
        formatter.setAttribute('aria-hidden', 'true')
        formatter.setAttribute('style', 'display: none')
        linker.setAttribute('aria-hidden', 'true')
        linker.setAttribute('style', 'display: none')
      }
    },
    unwrap (wrapper) {
      const docFrag = document.createDocumentFragment()
      while (wrapper.firstChild) {
        const child = wrapper.removeChild(wrapper.firstChild)
        docFrag.appendChild(child)
      }
      wrapper.parentNode.replaceChild(docFrag, wrapper)
    },
    format_style (style) {
      const el = window.getSelection()
      if (document.activeElement.contentEditable !== 'true') {
        this.focus_on_editor()
      }
      switch (style) {
        case 'bold':
          if (!document.queryCommandState('bold')) {
            if (el.type === 'Range') {
              if (el.focusNode.nodeName === '#text') {
                this.paste_html_at_caret(`<strong>${el.toString()}</strong>`, true)
              }
            }
          } else if (el.focusNode.parentNode.id !== 'rich_editor') {
            this.unwrap(el.focusNode.parentNode)
          }
          this.update_edited_notes()
          break
        case 'italic':
          if (!document.queryCommandState('italic')) {
            if (el.type === 'Range') {
              if (el.focusNode.nodeName === '#text') {
                this.paste_html_at_caret(`<em>${el.toString()}</em>`, true)
              }
            }
          } else if (el.focusNode.parentNode.id !== 'rich_editor') {
            this.unwrap(el.focusNode.parentNode)
          }
          this.update_edited_notes()
          break
        case 'underline':
          if (!document.queryCommandState('underline')) {
            if (el.type === 'Range') {
              if (el.focusNode.nodeName === '#text') {
                this.paste_html_at_caret(`<u>${el.toString()}</u>`, true)
              }
            }
          } else if (el.focusNode.parentNode.id !== 'rich_editor') {
            this.unwrap(el.focusNode.parentNode)
          }
          this.update_edited_notes()
          break
      }
    },

    // LISTS

    add_list (tag) {
      const olNode = document.createElement(tag)
      const liNode = document.createElement('li')
      this.restore_selection()
      const sel = window.getSelection()
      const isEmpty = sel.focusNode.length || 0
      if (!document.queryCommandState('insertOrderedList') && !document.queryCommandState('insertUnorderedList')) {
        const range = new Range()
        range.setStart(sel.focusNode, 0)
        range.setEnd(sel.focusNode, sel.focusNode.length)
        sel.removeAllRanges()
        sel.addRange(range)
        range.surroundContents(liNode)
        range.surroundContents(olNode)
        range.collapse(isEmpty === 0)
      } else if (sel.focusNode.parentNode.parentNode.id !== 'rich_editor' || sel.focusNode.parentNode.id !== 'rich_editor') {
        let dynamSel = sel.focusNode
        const nodes = []
        while (dynamSel.parentNode.id !== 'rich_editor') {
          if (dynamSel.parentNode.nodeName === tag.toUpperCase()) {
            dynamSel.parentNode.childNodes.forEach((node) => {
              nodes.push(node.innerHTML)
            })
            nodes.reverse().forEach((node) => {
              if (dynamSel.parentNode.parentNode.id !== 'rich_editor') {
                dynamSel.parentNode.parentNode.insertAdjacentHTML('afterend', `<div>${node}</div>`)
              } else {
                dynamSel.parentNode.insertAdjacentHTML('afterend', `<div>${node}</div>`)
              }
            })
            dynamSel.parentNode.remove()
            break
          } else if (dynamSel.parentNode.nodeName === 'OL' || dynamSel.parentNode.nodeName === 'UL') {
            const html = dynamSel.parentNode.outerHTML
            dynamSel.parentNode.insertAdjacentHTML('afterend', html.replace(`<${dynamSel.parentNode.nodeName.toLowerCase()}>`, `<${dynamSel.parentNode.nodeName === 'OL' ? 'ul' : 'ol'}>`).replace(`</${dynamSel.parentNode.nodeName.toLowerCase()}>`, `</${dynamSel.parentNode.nodeName === 'OL' ? 'ul' : 'ol'}>`))
            dynamSel.parentNode.remove()
            break
          } else {
            dynamSel = dynamSel.parentNode
          }
        }
      }
      this.update_edited_notes()
    },

    // CHECKBOX

    add_checkbox () {
      let forceFocus = false
      if (this.savedSelection === null) {
        forceFocus = true
      }
      this.restore_selection()
      if (!forceFocus) {
        this.paste_html_at_caret('<div contenteditable="false" style="display: inline"><input name="checkbox" type="checkbox" value="0" onclick="checkbox(this)"></div><div contenteditable="true" style="display: inline"></div>', false)
      } else {
        document.getElementById('rich_editor').insertAdjacentHTML('beforeend', '<div contenteditable="false" style="display: inline"><input name="checkbox" type="checkbox" value="0" onclick="checkbox(this)"></div><div contenteditable="true" style="display: inline"></div>')
      }
      this.update_edited_notes()
    },

    // LINK

    add_link () {
      let forceFocus = false
      if (this.savedSelection === null) {
        forceFocus = true
      }
      this.restore_selection()
      if (!forceFocus) {
        this.paste_html_at_caret(`<a href="${this.addLinkURL}" target="_blank">${this.addLinkName}</a>`, false)
      } else {
        document.getElementById('rich_editor').insertAdjacentHTML('beforeend', `<a href="${this.addLinkURL}" target="_blank">${this.addLinkName}</a>`)
      }
      this.update_edited_notes()
      this.reset_link_pop_up()
    },
    reset_link_pop_up () {
      this.addLinkName = ''
      this.addLinkURL = ''
      this.showAddLink = false
    },

    // IMAGE

    add_img () {
      let forceFocus = false
      const file = document.getElementById('img_uploader').files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.base64Img = reader.result
        if (this.savedSelection === null) {
          forceFocus = true
        }
        this.restore_selection()
        if (!forceFocus) {
          this.paste_html_at_caret(`<img src="${this.base64Img}">`, false)
        } else {
          document.getElementById('rich_editor').insertAdjacentHTML('beforeend', `<img src="${this.base64Img}">`)
        }
        this.update_edited_notes()
        this.reset_img_pop_up()
      }, false)
      if (file) {
        if (file.size < 1000000) {
          // eslint-disable-next-line
          new Compressor(file, {
            quality: 0.6,
            success (result) {
              reader.readAsDataURL(result)
            },
            error (err) {
              console.error(err.message)
            }
          })
        } else {
          this.$refs.response_pop_up.show('File size is too big', 'Please compress it to 1MB or lower', true, true)
          document.getElementById('img_uploader').value = ''
        }
      }
    },
    reset_img_pop_up () {
      this.base64Img = null
      this.showAddImage = false
    },

    // TEMPLATE

    add_template (templateData) {
      let forceFocus = false
      if (this.savedSelection === null) {
        forceFocus = true
      }
      this.restore_selection()
      if (!forceFocus) {
        this.paste_html_at_caret(templateData, false)
      } else {
        document.getElementById('rich_editor').insertAdjacentHTML('beforeend', templateData)
      }
      this.update_edited_notes()
      this.reset_template_pop_up()
    },
    reset_template_pop_up () {
      this.showAddTemplate = false
    }
  }
}
</script>
