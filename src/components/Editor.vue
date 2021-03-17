<style>
div#rich_editor {
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none
}
div#rich_editor div,
div#rich_editor p,
div#rich_show_content div,
div#rich_show_content p {
  margin: .6rem 0
}
div#rich_editor img,
div#rich_show_content img {
  border-radius: 10px;
  max-width: 80%;
  margin: 1rem 0
}
div#rich_editor img[onclick='resize(this)'] {
  cursor: pointer;
  transition: .4s all cubic-bezier(.165, .84, .44, 1)
}
div#rich_editor img[onclick='resize(this)']:hover {
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

/* Toolbars */
.re_toolbar_back {
  position: sticky;
  top: 0;
  padding-top: 1rem;
  background-color: var(--fore)
}
#rich_toolbar {
  background-color: var(--fore);
  border: 1px solid var(--base_faint);
  border-radius: 5px 5px 0 0;
  padding: 0 1rem;
  transition: all .6s cubic-bezier(.165, .84, .44, 1)
}
#rich_toolbar.showingPopup {
  border-bottom: 2px solid transparent
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
#rich_toolbar svg {
  height: 20px;
  width: 20px
}

/* Pop-ups */
.pop_up--add_link, .pop_up--add_image, .pop_up--add_template {
  position: sticky;
  top: calc(1rem + 44.39px);
  background-color: var(--fore);
  z-index: 99;
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
.template_item svg {
  cursor: pointer;
  margin-left: 1rem;
  vertical-align: middle;
  transition: .6s all cubic-bezier(.165, .84, .44, 1)
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

/* Editor */
div#rich_editor {
  padding: 1rem;
  outline-width: 0;
  border: 1px solid var(--base_faint);
  border-top: none;
  border-radius: 0 0 5px 5px;
  transition: all .6s cubic-bezier(.165, .84, .44, 1)
}

/* Show */
.padding {
  padding: 1rem 0
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
    <div v-if="showEditState">
      <div class="re_toolbar_back">
        <div id="rich_toolbar" :class="{ showingPopup: showAddLink || showAddImage || showAddTemplate }">
          <button
            :class="{ activeStyle: boldActive }"
            :disabled="!firstClickOver || !showFormatter"
            title="Bold (CMD/Ctrl + B)"
            class="fadeIn"
            @click="format_style('bold'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/bold.svg')" />
          </button>
          <button
            :class="{ activeStyle: italicActive }"
            :disabled="!firstClickOver || !showFormatter"
            title="Italic (CMD/Ctrl + I)"
            class="fadeIn"
            @click="format_style('italic'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/italic.svg')" />
          </button>
          <button
            :class="{ activeStyle: underlineActive }"
            :disabled="!firstClickOver || !showFormatter"
            title="Underline (CMD/Ctrl + U)"
            class="fadeIn"
            @click="format_style('underline'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/underline.svg')" />
          </button>
          <button
            :class="{ activeStyle: olActive }"
            title="Ordered List"
            :disabled="!firstClickOver"
            @click="add_list('ol'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/ol.svg')" />
          </button>
          <button
            :class="{ activeStyle: ulActive }"
            title="Unordered List"
            :disabled="!firstClickOver"
            @click="add_list('ul'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/ul.svg')" />
          </button>
          <button
            :class="{ activeStyle: ulActive }"
            title="Checkbox"
            :disabled="!firstClickOver"
            @click="add_checkbox(), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/checkbox.svg')" />
          </button>
          <button
            title="Add Link"
            :disabled="!firstClickOver"
            @click="showAddLink = !showAddLink, reset_img_pop_up(), reset_template_pop_up()"
          >
            <inline-svg :src="require('../assets/svg/editor/link.svg')" />
          </button>
          <button
            title="Insert Image"
            :disabled="!firstClickOver"
            @click="showAddImage = !showAddImage, reset_link_pop_up(), reset_template_pop_up()"
          >
            <inline-svg :src="require('../assets/svg/editor/image.svg')" />
          </button>
          <button
            v-if="dataForTemplates !== undefined && dataForTemplates !== null"
            title="Use Template"
            :disabled="!firstClickOver"
            @click="showAddTemplate = !showAddTemplate, reset_link_pop_up(), reset_img_pop_up()"
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
          aria-label="Search by name"
          rel="search"
          placeholder="Name"
        >
        <p v-show="search === ''">
          System templates
        </p>
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
        <p>
          Your templates
        </p>
        <div
          v-for="(item, index) in dataForTemplates"
          v-show="((!search) || ((item.name).toLowerCase()).startsWith(search.toLowerCase()))"
          :key="'template-' + index"
          class="template_item"
        >
          <modal :name="'preview_template_' + item.id" height="100%" width="100%" :adaptive="true" :click-to-close="false">
            <div class="modal--preview_template">
              <div class="center_wrapped">
                <div v-if="previewTemplate !== null">
                  <div class="show_html" v-html="previewTemplate" /><br>
                  <button class="cancel" @click="$modal.hide(`preview_template_${item.id}`), will_body_scroll(true), previewTemplate = null">
                    Close
                  </button>
                </div>
                <div v-else>
                  <h2>
                    Something went wrong with the preview
                  </h2>
                  <p class="grey">
                    Please try again
                  </p><br>
                  <button class="cancel" @click="$modal.hide(`preview_template_${item.id}`), will_body_scroll(true), previewTemplate = null">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </modal>
          <button @click="add_template(item.template)">
            {{ item.name }}
          </button>
          <inline-svg
            :src="require('../assets/svg/editor/preview.svg')"
            @click="previewTemplate = item.template, $modal.show(`preview_template_${item.id}`), will_body_scroll(false)"
          />
        </div><br>
      </div>
      <div
        id="rich_editor"
        contenteditable="true"
        data-placeholder="Start typing..."
        @click="firstClickOver = true, save_selection(), check_cmd_state(), reset_link_pop_up(), reset_img_pop_up(), reset_template_pop_up()"
        @keyup="firstClickOver = true, save_selection(), update_edited_notes()"
        v-html="update_content(initialHTML)"
      />
    </div>
    <div v-if="!showEditState && !test_empty_html(htmlInjection)" id="rich_show_content" class="padding" v-html="update_content(remove_brackets(htmlInjection))" />
    <p v-if="!showEditState && test_empty_html(htmlInjection)" class="grey padding">
      {{ emptyPlaceholder }}
    </p>
  </div>
</template>

<script>
import Compressor from 'compressorjs'

export default {
  props: {
    showEditState: Boolean,
    htmlInjection: String,
    emptyPlaceholder: String,
    dataForTemplates: Array
  },
  data () {
    return {
      // System
      search: '',
      firstClickOver: false,
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
      showFormatter: false,
      showAddLink: false,
      addLinkName: '',
      addLinkURL: '',
      showAddImage: false,
      base64Img: null,
      showAddTemplate: false,
      previewTemplate: null,

      // REGEX

      updateIframeRegex: /<iframe.*?><\/iframe>/gmi,
      updateURLRegex: /src="(.*?)"/gmi
    }
  },
  watch: {
    showEditState () {
      this.initialHTML = this.htmlInjection
      if (this.showEditState) {
        document.addEventListener('keyup', this.check_cmd_state)
        document.addEventListener('selectionchange', this.check_text_formatter)
      } else {
        document.removeEventListener('keyup', this.check_cmd_state)
        document.removeEventListener('selectionchange', this.check_text_formatter)
        this.firstClickOver = false
      }
    }
  },
  methods: {
    update_content (html) {
      let m
      const arr = []
      while ((m = this.updateIframeRegex.exec(html)) !== null) {
        if (m.index === this.updateIframeRegex.lastIndex) {
          this.updateIframeRegex.lastIndex++
        }
        m.forEach((iframeMatch) => {
          const url = iframeMatch.match(this.updateURLRegex)[0].replace('src=', '').replace(/"/g, '')
          arr.push([iframeMatch, url])
        })
      }
      if (arr.length !== 0) {
        arr.forEach((item) => {
          html = html.replace(item[0], `<a href="${item[1]}" target="_blank" contenteditable="false">Watch video</a>`)
        })
      }
      return html
    },

    // MISC.

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

    check_text_formatter () {
      this.showFormatter = false
      let sel = window.getSelection()
      const type = sel.type
      sel = sel.focusNode
      if (sel === null) {
        return
      }
      while (sel.parentNode.id !== 'app' && sel.parentNode !== null) {
        if (sel.parentNode.id === 'rich_editor' && type === 'Range') {
          this.showFormatter = true
          break
        } else {
          sel = sel.parentNode
        }
      }
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
                this.paste_html_at_caret(`<b>${el.toString()}</b>`, true)
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
                this.paste_html_at_caret(`<i>${el.toString()}</i>`, true)
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
    unwrap (wrapper) {
      const docFrag = document.createDocumentFragment()
      while (wrapper.firstChild) {
        const child = wrapper.removeChild(wrapper.firstChild)
        docFrag.appendChild(child)
      }
      wrapper.parentNode.replaceChild(docFrag, wrapper)
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
        this.paste_html_at_caret(`<div contenteditable="false" style="display: inline"><a href="${this.addLinkURL}" target="_blank">${this.addLinkName}</a></div><div contenteditable="true" style="display: inline"></div>`, false)
      } else {
        document.getElementById('rich_editor').insertAdjacentHTML('beforeend', `<div contenteditable="false" style="display: inline"><a href="${this.addLinkURL}" target="_blank">${this.addLinkName}</a></div><div contenteditable="true" style="display: inline"></div>`)
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
          this.paste_html_at_caret(`<img src="${this.base64Img}" onclick="resize(this)">`, false)
        } else {
          document.getElementById('rich_editor').insertAdjacentHTML('beforeend', `<img src="${this.base64Img}" onclick="resize(this)">`)
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
          alert('File size is too big, please compress it to 1MB or lower')
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
