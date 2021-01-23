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
    background-color: white
  }
  #rich_toolbar {
    display: flex;
    background-color: white;
    border: 1px solid #28282840;
    border-radius: 5px 5px 0 0;
    padding: 0 1rem
  }
  #rich_toolbar.showingPopup {
    border-bottom: 2px solid transparent
  }
  #rich_toolbar button {
    padding: 0;
    margin: .8rem 1rem .6rem 0;
    color: #282828;
    background-color: transparent
  }
  #rich_toolbar button:hover {
    opacity: .4
  }
  #rich_toolbar button:disabled {
    opacity: .6
  }
  .activeStyle {
    opacity: .4
  }

  /* Pop-ups */
  .pop_up--add_link, .pop_up--add_image, .pop_up--add_video, .pop_up--add_template {
    position: sticky;
    top: calc(1rem + 44.39px);
    background-color: white;
    z-index: 99;
    display: flex;
    border-left: 1px solid #28282840;
    border-right: 1px solid #28282840;
    border-bottom: 1px solid #28282840;
    padding: .8rem
  }
  .pop_up--add_template {
    display: grid;
    grid-gap: 1rem
  }
  .template_item {
    display: flex
  }
  .template_item svg {
    margin: auto 1rem;
    cursor: pointer
  }
  .wrapper--input--add_link {
    display: grid;
    grid-gap: .4rem
  }
  .input--add_link, .input--add_video {
    padding: .2rem .4rem;
    border: 1px solid #28282840;
    border-radius: 3px;
    margin-right: 1rem
  }
  button.add_link_submit, button.add_video_submit {
    height: auto;
    margin: 0
  }

  /* Tooltip */
  .tooltip {
    position: absolute;
    top: 120%;
    background-color: #282828;
    color: white;
    font-size: .8rem;
    opacity: .9;
    text-align: center;
    padding: .5rem;
    border-radius: 3px;
    z-index: 100
  }

  /* Editor */
  div#rich_editor {
    padding: 1rem;
    outline-width: 0;
    border: 1px solid #28282840;
    border-top: none;
    border-radius: 0 0 5px 5px
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
  }
</style>

<template>
  <div id="wrapper--rich_editor">
    <p id="rich_editor_version" style="display: none">
      {{ editorVersion }}
    </p>
    <p v-if="outdated">
      This editor is outdated but it's still working. You can update by creating a new session and moving the plans over. We don't recommend copy and pasting images and videos into the new session.
    </p>
    <div v-if="showEditState">
      <div class="re_toolbar_back">
        <div id="rich_toolbar" :class="{ showingPopup: showAddLink || showAddImage || showAddVideo || showAddTemplate }">
          <button
            :class="{ activeStyle: boldActive }"
            title="Bold"
            @click="format('bold'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/bold.svg')" />
          </button>
          <button
            :class="{ activeStyle: italicActive }"
            title="Italic"
            @click="format('italic'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/italic.svg')" />
          </button>
          <button
            :class="{ activeStyle: underlineActive }"
            title="Underline"
            @click="format('underline'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/underline.svg')" />
          </button>
          <button
            :class="{ activeStyle: olActive }"
            title="Ordered List"
            @click="format('insertOrderedList'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/ol.svg')" />
          </button>
          <button
            :class="{ activeStyle: ulActive }"
            title="Unordered List"
            @click="format('insertUnorderedList'), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/ul.svg')" />
          </button>
          <button
            :class="{ activeStyle: ulActive }"
            title="Checkbox"
            @click="add_checkbox(), check_cmd_state(), focus_on_editor()"
          >
            <inline-svg :src="require('../assets/svg/editor/checkbox.svg')" />
          </button>
          <div
            @mouseover="showTooltip = true"
            @mouseleave="showTooltip = false"
          >
            <button
              :disabled="!caretIsInEditor"
              title="Add Link"
              @click="show_link_adder(), reset_img_pop_up(), reset_video_pop_up(), reset_template_pop_up()"
            >
              <inline-svg :src="require('../assets/svg/editor/link.svg')" />
            </button>
            <button
              :disabled="!caretIsInEditor"
              title="Insert Image"
              @click="show_image_adder(), reset_link_pop_up(), reset_video_pop_up(), reset_template_pop_up()"
            >
              <inline-svg :src="require('../assets/svg/editor/image.svg')" />
            </button>
            <button
              :disabled="!caretIsInEditor"
              title="Insert Video"
              @click="show_video_adder(), reset_link_pop_up(), reset_img_pop_up(), reset_template_pop_up()"
            >
              <inline-svg :src="require('../assets/svg/editor/youtube.svg')" />
            </button>
            <button
              v-if="dataForTemplates !== undefined && dataForTemplates !== null"
              :disabled="!caretIsInEditor"
              title="Use Template"
              @click="show_template_adder(), reset_link_pop_up(), reset_img_pop_up(), reset_video_pop_up()"
            >
              <inline-svg :src="require('../assets/svg/editor/template.svg')" />
            </button>
          </div>
          <span v-show="showTooltip && !caretIsInEditor" class="tooltip">Click on an empty line where you want to insert.</span>
        </div>
      </div>
      <!-- LINK -->
      <form v-if="showAddLink" class="pop_up--add_link" @submit.prevent="add_link()">
        <div class="wrapper--input--add_link right_margin">
          <input v-model="addLinkName" class="input--add_link small_border_radius" type="text" placeholder="Name" required>
          <input v-model="addLinkURL" class="input--add_link small_border_radius" type="text" placeholder="URL" required>
        </div>
        <button class="add_link_submit" type="submit">
          Add
        </button>
      </form>
      <!-- IMAGE -->
      <div v-if="showAddImage" class="pop_up--add_image">
        <input id="img_uploader" type="file" accept=".png, .jpeg" @change="add_img()">
      </div>
      <!-- VIDEO -->

      <form v-if="showAddVideo" class="pop_up--add_video" @submit.prevent="add_video()">
        <input v-model="addVideoURL" class="input--add_video small_border_radius" type="text" placeholder="YouTube URL" required>
        <button class="add_video_submit" type="submit">
          Add
        </button>
      </form>
      <!-- TEMPLATE -->
      <div v-if="showAddTemplate" class="pop_up--add_template small_border_radius">
        <div
          v-for="(item, index) in dataForTemplates"
          :key="'template-' + index"
          class="template_item"
        >
          <modal :name="'preview_template_' + item.id" height="100%" width="100%" :adaptive="true" :click-to-close="false">
            <div class="modal--preview_template">
              <div class="wrapper--centered-item">
                <div v-if="previewTemplate !== null">
                  <div v-html="previewTemplate" /><br>
                  <button class="cancel" @click="$modal.hide(`preview_template_${item.id}`), will_body_scroll(true), previewTemplate = null">
                    Close
                  </button>
                </div>
                <div v-else>
                  <p class="text--small">
                    Something went wrong with the preview
                  </p>
                  <p class="text--small grey">
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
        </div>
      </div>
      <div
        id="rich_editor"
        contenteditable="true"
        data-placeholder="Start typing..."
        @click="reset_link_pop_up(), reset_img_pop_up(), reset_video_pop_up(), reset_template_pop_up()"
        @input="update_edited_notes()"
        v-html="initialHTML"
      />
    </div>
    <div v-if="!showEditState && !test_empty_html(htmlInjection)" id="rich_show_content" class="padding" v-html="remove_brackets_and_checkbox(htmlInjection)" />
    <p v-if="!showEditState && test_empty_html(htmlInjection)" class="text--small grey padding">
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
      editorVersion: 'Graphite 1.1',
      outdated: false,
      showTooltip: false,
      caretIsInEditor: false,
      savedSelection: null,
      initialHTML: '',
      editedHTML: '',
      boldActive: false,
      italicActive: false,
      underlineActive: false,
      olActive: false,
      ulActive: false,
      showAddLink: false,
      addLinkName: '',
      addLinkURL: '',
      showAddImage: false,
      base64Img: null,
      showAddVideo: false,
      addVideoURL: '',
      showAddTemplate: false,
      previewTemplate: null
    }
  },
  watch: {
    showEditState () {
      this.update_html()
      this.initialHTML = this.htmlInjection
      if (this.showEditState) {
        document.addEventListener('click', this.check_caret_pos)
        document.addEventListener('keydown', this.check_cmd_state)
      } else {
        this.update_edited_notes()
        document.removeEventListener('click', this.check_caret_pos)
        document.removeEventListener('keydown', this.check_cmd_state)
        this.caretIsInEditor = false
      }
    }
  },
  mounted () {
    this.update_html()
  },
  methods: {
    // GENERAL
    /*
    check_version () {
      let versionId = document.getElementById('rich_editor_version').innerText
      let version = parseFloat(versionId.match(/\d+.\d+/gmi))
    },
    */
    update_html () {
      const imgs = document.querySelectorAll('p > img')
      const iframes = document.querySelectorAll('.ql-video')
      iframes.forEach((item) => {
        item.removeAttribute('class')
        item.setAttribute('style', 'border-radius: 10px; max-width: 80%; margin: 1rem 0')
      })
      imgs.forEach((item) => {
        item.setAttribute('style', 'border-radius: 10px; max-width: 80%; margin: 1rem 0')
      })
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
      setInterval(() => {
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
      }, 100)
    },
    check_caret_pos () {
      const caretPosition = document.getSelection()
      if (caretPosition.focusNode !== null) {
        if (caretPosition.focusNode.parentNode.parentNode.id === 'rich_editor' || caretPosition.focusNode.parentNode.id === 'rich_editor' || caretPosition.focusNode.id === 'rich_editor') {
          this.caretIsInEditor = true
        } else {
          this.caretIsInEditor = false
        }
      }
    },
    remove_brackets_and_checkbox (dataIn) {
      if (dataIn !== null) {
        return dataIn.replace(/[[\]]/g, '').replace(/<input name="checklist"/gmi, '<p><input name="checklist" disabled')
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
    format (com, val) {
      document.execCommand(com, false, val)
    },
    save_selection () {
      let sel
      if (window.getSelection) {
        sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          return sel.getRangeAt(0)
        }
      } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange()
      }
      return null
    },
    restore_selection (range) {
      let sel
      if (range) {
        if (window.getSelection) {
          sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
        } else if (document.selection && range.select) {
          range.select()
        }
      }
    },
    // CHECKBOX
    add_checkbox () {
      this.format('insertHTML', '<input name="checklist" type="checkbox" style="margin: .4rem" onclick="change_checked_state(this)">')
    },
    // LINK
    show_link_adder () {
      this.savedSelection = this.save_selection()
      this.showAddLink = !this.showAddLink
      if (!this.showAddLink) {
        this.savedSelection = null
      }
    },
    add_link () {
      this.restore_selection(this.savedSelection)
      this.format('insertHTML', `<a href="${this.addLinkURL}" target="_blank">${this.addLinkName}</a>`)
      this.reset_link_pop_up()
    },
    reset_link_pop_up () {
      this.addLinkName = ''
      this.addLinkURL = ''
      this.showAddLink = false
    },
    // IMAGE
    show_image_adder () {
      this.savedSelection = this.save_selection()
      this.showAddImage = !this.showAddImage
      if (!this.showAddImage) {
        this.savedSelection = null
      }
    },
    add_img () {
      const file = document.getElementById('img_uploader').files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.base64Img = reader.result
        this.restore_selection(this.savedSelection)
        this.format('insertHTML', `<img src="${this.base64Img}" style="border-radius: 10px; max-width: 80%; margin: 1rem 0" />`)
        this.reset_img_pop_up()
      }, false)
      if (file) {
        // eslint-disable-next-line
        new Compressor(file, {
          quality: 0.6,
          success (result) {
            reader.readAsDataURL(result)
          },
          error (err) {
            console.log(err.message)
          }
        })
      }
    },
    reset_img_pop_up () {
      this.base64Img = null
      this.showAddImage = false
    },
    // VIDEO
    show_video_adder () {
      this.savedSelection = this.save_selection()
      this.showAddVideo = !this.showAddVideo
      if (!this.showAddVideo) {
        this.savedSelection = null
      }
    },
    add_video () {
      this.restore_selection(this.savedSelection)
      this.format('insertHTML', `<iframe src="//www.youtube.com/embed/${this.get_embbed_id(this.addVideoURL)}" frameborder="0" allowfullscreen style="border-radius: 10px; max-width: 80%; margin: 1rem 0" />`)
      this.reset_video_pop_up()
    },
    get_embbed_id (url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = url.match(regExp)
      return (match && match[2].length === 11) ? match[2] : null
    },
    reset_video_pop_up () {
      this.addVideoURL = ''
      this.showAddVideo = false
    },
    // TEMPLATE
    show_template_adder () {
      this.savedSelection = this.save_selection()
      this.showAddTemplate = !this.showAddTemplate
      if (!this.showAddTemplate) {
        this.savedSelection = null
      }
    },
    add_template (templateData) {
      this.restore_selection(this.savedSelection)
      this.format('insertHTML', templateData)
      this.reset_template_pop_up()
    },
    reset_template_pop_up () {
      this.showAddTemplate = false
    }
  }
}
</script>
