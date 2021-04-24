<style>
/* Editor object */
.editor_object_standard {
  border: 3px solid var(--base);
  border-radius: 10px;
  background-color: var(--fore);
  transition: .6s border cubic-bezier(.165, .84, .44, 1)
}
.editor_object_standard h3 {
  position: relative;
  left: 2rem;
  padding: .6rem;
  width: fit-content;
  background: var(--base);
  color: var(--fore);
  border-radius: 0 0 10px 10px
}
.editor_object_standard #wrapper--rich_editor {
  margin: 2rem
}
.editor_object_complex {
  display: grid;
  padding: 2rem;
  border: 2px solid transparent;
  border-radius: 10px;
  background-color: var(--fore);
  box-shadow: var(--low_shadow);
  transition: .6s border cubic-bezier(.165, .84, .44, 1)
}

/* Editor */
div.ProseMirror {
  outline: none
}
div#rich_editor > div[contenteditable],
div#rich_show_content > :is(div, p) {
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none
}
div#rich_show_content,
.placeholder {
  cursor: pointer;
  padding: 1rem;
  border: 2px solid var(--base_faint);
  border-radius: 10px;
  margin-top: 1rem;
  transition: .6s opacity cubic-bezier(.165, .84, .44, 1), .6s border cubic-bezier(.165, .84, .44, 1)
}
div#rich_show_content:hover,
.placeholder:hover {
  border: 2px solid var(--base_light);
  opacity: var(--light_opacity)
}
div#rich_editor > div[contenteditable] > :is(div, p),
div#rich_show_content > :is(div, p) {
  margin: .6rem 0
}
div#rich_editor > div[contenteditable] img,
div#rich_show_content img {
  cursor: pointer;
  border-radius: 10px;
  max-width: 80%;
  margin: 1rem 0;
  transition: .4s all cubic-bezier(.165, .84, .44, 1)
}
div#rich_editor > div[contenteditable] img:hover {
  opacity: var(--light_opacity)
}
div#rich_editor > div[contenteditable] a,
div#rich_show_content a {
  color: var(--link)
}
:is(div#rich_editor, div#rich_show_content) iframe {
  display: none
}

/* Todo List */
ul[data-type='taskList'] {
  list-style: none;
  padding: 0
}
ul[data-type='taskList'] li {
  display: flex;
  align-items: center
}
ul[data-type='taskList'] li > label {
  flex: 0 0 auto;
  margin-right: .5rem
}

/* State */
.is-active {
  opacity: .4
}

/* Responsive */
@media (max-width: 576px) {
  .editor_object_standard h3 {
    left: 1rem
  }
  .editor_object_standard #wrapper--rich_editor {
    margin: 1rem
  }
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
.menu_bar_wrapper {
  z-index: 1;
  position: sticky;
  top: 0;
  padding-top: 1rem;
  background-color: var(--fore)
}
#menu_bar {
  background-color: var(--fore);
  border: 2px solid var(--base_faint);
  border-radius: 10px 10px 0 0;
  padding: 0 1rem;
  transition: var(--transition_standard)
}
#menu_bar button {
  padding: 0;
  margin: .8rem 1rem .6rem 0;
  color: var(--base);
  background-color: transparent
}
#menu_bar svg {
  height: 20px;
  width: 20px
}

/* Pop-ups */
.template_menu {
  display: grid;
  grid-gap: 1rem
}
.template_menu h3 {
  margin-top: 1rem
}
.templates_container {
  display: grid;
  grid-gap: 1rem
}
.template_item {
  display: grid;
  grid-template-columns: .5fr 1fr;
  grid-gap: 2rem
}
.template_item button {
  width: fit-content
}
.template_item svg {
  margin: auto 0 auto .6rem
}
#templates_search_none {
  display: none
}
.template_menu .preview_html {
  max-height: 400px;
  font-size: .8rem;
  padding: 1rem;
  background-color: var(--fore);
  box-shadow: var(--low_shadow);
  border-radius: 5px;
  overflow-y: auto
}
.template_menu .preview_html::-webkit-scrollbar {
  width: 3px
}
.template_menu button.red_button {
  width: 100%
}

/* Editor */
div#rich_editor {
  padding: 1rem;
  outline-width: 0;
  border: 2px solid var(--base_faint);
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

/* Caret In Editor */
#menu_bar.editorFocused {
  border: 2px solid var(--base)
}
div#rich_editor.editorFocused {
  border: 2px solid var(--base);
  border-top: none
}

/* Responsive */
@media (max-width: 992px) {
  .templates_container {
    grid-gap: 3rem
  }
  .template_item {
    display: flex;
    flex-direction: column-reverse;
    grid-gap: .6rem
  }
  .template_item button {
    width: 100%
  }
}
@media (max-width: 768px) {
  div#rich_show_content img,
  div#rich_show_content iframe {
    max-width: 100%
  }
}
</style>

<template>
  <div id="wrapper--rich_editor">
    <div :class="{ opened_sections: showAddTemplate }" class="section_overlay" />
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <input-pop-up ref="input_pop_up" />
    </transition>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <response-pop-up ref="response_pop_up" />
    </transition>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <global-overlay ref="overlay" />
    </transition>
    <div v-if="showAddTemplate" class="tab_overlay_content fadeIn delay fill_mode_both small_border_radius">
      <div class="template_menu">
        <input
          v-if="dataForTemplates.length !== 0"
          v-model="search"
          type="search"
          aria-label="Search templates"
          rel="search"
          placeholder="Search templates"
          @input="is_search_empty()"
        >
        <h3 v-show="search === ''">
          System templates
        </h3>
        <div class="templates_container">
          <div
            v-for="(example, exampleIndex) in exampleTemplates"
            v-show="search === ''"
            :key="`example_${exampleIndex}`"
            class="template_item"
          >
            <button @click="editor.commands.insertContent(example.html), showAddTemplate = false">
              {{ example.name }}
            </button>
            <div class="preview_html" v-html="example.html" />
          </div>
        </div>
        <h3>
          Your templates
        </h3>
        <div class="templates_container">
          <div
            v-for="(item, index) in dataForTemplates"
            v-show="((!search) || ((item.name).toLowerCase()).startsWith(search.toLowerCase()))"
            :key="'template-' + index"
            class="template_item"
          >
            <button @click="editor.commands.insertContent(item.template), showAddTemplate = false">
              {{ item.name }}
            </button>
            <div class="preview_html" v-html="item.template" />
          </div>
        </div>
        <p id="templates_search_none">
          No templates found
        </p><br>
        <button class="red_button" @click="showAddTemplate = false, search = ''">
          Cancel
        </button>
      </div>
    </div>
    <div
      v-if="!editState && !test_empty_html(value)"
      id="rich_show_content"
      class="fadeIn"
      @click="editState = true, $emit('on-edit-change', 'edit', itemId)"
      v-html="update_html(value, true)"
    />
    <div v-else-if="editState" class="fadeIn">
      <div class="menu_bar_wrapper">
        <div id="menu_bar" :class="{ editorFocused: caretInEditor }">
          <button
            class="fadeIn"
            :class="{ 'is-active': editor.isActive('bold') }"
            @click="editor.chain().focus().toggleBold().run()"
          >
            <inline-svg :src="require('../assets/svg/editor/bold.svg')" />
          </button>
          <button
            class="fadeIn"
            :class="{ 'is-active': editor.isActive('italic') }"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <inline-svg :src="require('../assets/svg/editor/italic.svg')" />
          </button>
          <button
            class="fadeIn"
            :class="{ 'is-active': editor.isActive('underline') }"
            @click="editor.chain().focus().toggleUnderline().run()"
          >
            <inline-svg :src="require('../assets/svg/editor/underline.svg')" />
          </button>
          <button
            class="fadeIn"
            :class="{ 'is-active': editor.isActive('ordered_list') }"
            @click="editor.chain().focus().toggleOrderedList().run()"
          >
            <inline-svg :src="require('../assets/svg/editor/ol.svg')" />
          </button>
          <button
            class="fadeIn"
            :class="{ 'is-active': editor.isActive('bullet_list') }"
            @click="editor.chain().focus().toggleBulletList().run()"
          >
            <inline-svg :src="require('../assets/svg/editor/ul.svg')" />
          </button>
          <button
            :class="{ 'is-active': editor.isActive('taskList') }"
            @click="editor.chain().focus().toggleTaskList().run()"
          >
            <inline-svg :src="require('../assets/svg/editor/checklist.svg')" />
          </button>
          <button
            class="fadeIn"
            :class="{ 'is-active': editor.isActive('link') }"
            @click="editor.isActive('link') ? editor.chain().focus().unsetLink().run() : setLinkUrl()"
          >
            <inline-svg :src="require('../assets/svg/editor/link.svg')" />
          </button>
          <button
            class="fadeIn"
            @click="showAddTemplate = false, $refs.input_pop_up.show('image', 'Select your image to upload', 'Make sure that it\'s less than 1MB')"
          >
            <inline-svg :src="require('../assets/svg/editor/image.svg')" />
          </button>
          <button
            v-if="dataForTemplates !== undefined && dataForTemplates !== null"
            class="fadeIn"
            @click="showAddTemplate = !showAddTemplate, $parent.go_to_event(itemId, weekId)"
          >
            <inline-svg :src="require('../assets/svg/editor/template.svg')" />
          </button>
          <button
            class="fadeIn"
            @click="editor.chain().focus().undo().run()"
          >
            <inline-svg :src="require('../assets/svg/editor/undo.svg')" />
          </button>
          <button
            class="fadeIn"
            @click="editor.chain().focus().redo().run()"
          >
            <inline-svg :src="require('../assets/svg/editor/redo.svg')" />
          </button>
        </div>
      </div>
      <editor-content
        id="rich_editor"
        :editor="editor"
        :class="{ editorFocused: caretInEditor }"
      />
    </div>
    <p
      v-else
      class="placeholder grey fadeIn"
      @click="editState = true, $emit('on-edit-change', 'edit', itemId)"
    >
      {{ emptyPlaceholder }}
    </p>
    <div v-if="editState" class="bottom_bar fadeIn">
      <button @click="editState = false , $emit('on-edit-change', 'save', itemId), will_body_scroll(true)">
        Save
      </button>
      <button class="red_button" @click="editState = false , $emit('on-edit-change', 'cancel', itemId), will_body_scroll(true)">
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import Compressor from 'compressorjs'
import { Editor, EditorContent } from '@tiptap/vue-2'
import { defaultExtensions } from '@tiptap/starter-kit'
import Undeline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'

export default {
  components: {
    EditorContent
  },
  props: {
    itemId: [Number, String],
    weekId: Number,
    editing: [Number, String],
    value: String,
    emptyPlaceholder: String,
    dataForTemplates: Array,
    forceStop: Number
  },
  data () {
    return {

      // Editor
      isMobile: false,
      editor: null,
      editState: false,
      caretInEditor: false,
      initialHTML: '',

      // Link
      linkUrl: null,
      linkMenuIsActive: false,

      // Image
      base64Img: null,

      // Template
      search: '',
      showAddTemplate: false,
      exampleTemplates: [
        { name: 'Track with sets, reps, and load', html: '<div>[ EXERCISE: SETS x REPS at LOAD ]</div><div>Tip: You can break LOAD into different sets. E.g. 70/80/90kg where SETS must be 3.</div>' },
        { name: 'Track with sets, reps', html: '<div>[ EXERCISE: SETS x REPS ]</div>' },
        { name: 'Track with other measurements', html: '<div>[ MEASUREMENT: VALUE ]</div><div>You can use any single measurements like [ BD Fat: 16% ]. E.g. RPE, weight, body-fat, jump height, etc. </div>' }
      ]
    }
  },
  watch: {
    value (value) {
      if (this.editor.getHTML() === value) {
        return
      }
      this.editor.commands.setContent(this.value, false)
    },
    showAddTemplate () {
      if (this.showAddTemplate) {
        this.will_body_scroll(false)
      } else {
        this.will_body_scroll(true)
      }
    },
    editState () {
      if (this.editState) {
        this.isMobile = /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        this.editor = new Editor({
          content: this.value,
          extensions: [
            ...defaultExtensions(),
            Undeline,
            Link,
            TaskList,
            TaskItem,
            Image
          ],
          onUpdate: () => {
            this.$emit('input', this.editor.getHTML())
          },
          onFocus: () => {
            this.caretInEditor = true
            this.showAddTemplate = false
            this.will_body_scroll(true)
          },
          onBlur: () => {
            this.caretInEditor = false
          }
        })
      } else {
        this.editor.destroy()
      }
    },
    forceStop () {
      if (this.editing !== this.itemId) {
        this.editState = false
      }
    }
  },
  methods: {

    // Link

    async setLinkUrl () {
      const SRC = await this.$refs.input_pop_up.show('link', 'Enter the URL link', 'Make sure to include the https://')
      if (!SRC) {
        return
      }
      this.editor.chain().focus().setLink({ href: SRC }).run()
    },

    // IMG

    add_img () {
      const FILE = document.getElementById('img_uploader').files[0]
      const READER = new FileReader()
      READER.addEventListener('load', () => {
        const SRC = READER.result
        this.editor.chain().focus().setImage({ src: SRC }).run()
      }, false)
      if (FILE) {
        if (FILE.size < 1000000) {
          // eslint-disable-next-line
          new Compressor(FILE, {
            quality: 0.6,
            success (result) {
              READER.readAsDataURL(result)
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

    // Misc.

    is_search_empty () {
      let showNoneMsg = true
      this.dataForTemplates.forEach((template) => {
        if (((template.name).toLowerCase()).startsWith(this.search.toLowerCase()) && this.search !== '') {
          showNoneMsg = false
        }
      })
      document.getElementById('templates_search_none').style.display = showNoneMsg && this.search !== '' ? 'block' : 'none'
    },
    test_empty_html (text) {
      if (text !== null) {
        const REMOVE_TAGS_AND_SPACE = text.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, '').replace(/ /g, '')
        if (REMOVE_TAGS_AND_SPACE === '') {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }
  }
}
</script>
