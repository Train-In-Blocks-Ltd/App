<style>
/* Editor object */
.editor_object {
  display: grid;
  padding: 2rem;
  border: 2px solid transparent;
  border-radius: 10px;
  background-color: var(--fore);
  box-shadow: var(--low_shadow);
  transition: .6s border cubic-bezier(.165, .84, .44, 1)
}
.editorActive {
  /* stylelint-disable-next-line */
  border: 2px solid var(--base_faint) !important
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
  border: 1px solid var(--base_faint);
  border-radius: 10px;
  margin-top: 1rem;
  transition: .6s opacity cubic-bezier(.165, .84, .44, 1), .6s border cubic-bezier(.165, .84, .44, 1)
}
div#rich_show_content:hover,
.placeholder:hover {
  border: 1px solid var(--base_light);
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

/* Menububble */
.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: var(--base);
  border-radius: 5px;
  padding: .3rem;
  margin-bottom: .5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity .2s, visibility .2s
}
.menububble.is-active {
  opacity: 1;
  visibility: visible
}
.menububble__form {
  display: flex;
  align-items: center
}
.menububble__input {
  font: inherit;
  border: none;
  background: transparent;
  /* stylelint-disable-next-line */
  color: var(--fore) !important
}
.menububble__button {
  display: inline-flex;
  background: transparent;
  border: 0;
  color: var(--fore);
  padding: .2rem .5rem;
  margin-right: .2rem;
  border-radius: 3px;
  cursor: pointer
}
.menububble__button svg {
  height: 16px;
  width: 16px;
  margin-left: .4rem
}
.menububble__button svg path {
  fill: var(--fore)
}
.menububble__button:last-child {
  margin-right: 0
}
.menububble__button:hover {
  background-color: rgba(var(--fore), .1)
}
.menububble__button.is-active {
  background-color: rgba(var(--fore), .2)
}

/* Todo List */
ul[data-type='todo_list'] {
  padding-left: 0
}
li[data-type='todo_item'] {
  display: flex;
  flex-direction: row
}
.todo-checkbox {
  border: 2px solid var(--base);
  height: .9rem;
  width: .9rem;
  box-sizing: border-box;
  margin-right: 10px;
  margin-top: .3rem;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  border-radius: .2rem;
  background-color: transparent;
  transition: .4s background
}
.todo-content {
  flex: 1
}
.todo-content > p:last-of-type {
  margin-bottom: 0
}
.todo-content > ul[data-type='todo_list'] {
  margin: .5rem 0
}
li[data-done='true'] > .todo-content > p {
  text-decoration: line-through
}
li[data-done='true'] > .todo-checkbox {
  background-color: var(--base)
}
li[data-done='false'] {
  text-decoration: none
}

/* State */
.is-active {
  opacity: .4
}

/* Responsive */
@media (max-width: 576px) {
  .editor_object {
    padding: .8rem
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
  border: 1px solid var(--base_faint);
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
.template_menu, .image_menu {
  position: sticky;
  top: calc(1rem + 44.39px);
  background-color: var(--fore);
  z-index: 1;
  border-left: 1px solid var(--base_faint);
  border-right: 1px solid var(--base_faint);
  border-bottom: 1px solid var(--base_faint);
  padding: .8rem;
  display: grid;
  grid-gap: 1rem;
  max-height: 250px;
  overflow-y: auto
}
.template_menu > h2 {
  margin-top: 1rem
}
.template_item {
  width: fit-content
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

/* Caret In Editor */
#menu_bar.editorFocused {
  border: 1px solid var(--base)
}
div#rich_editor.editorFocused {
  border: 1px solid var(--base);
  border-top: none
}

/* Responsive */
@media (max-width: 768px) {
  div#rich_show_content img,
  div#rich_show_content iframe {
    max-width: 100%
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
      v-if="previewHTML !== null"
      :desc="previewDesc"
      :html="previewHTML"
      :show-media="true"
      :allow-select="true"
      @close="previewDesc = null, previewHTML = null"
    />
    <div
      v-if="!editState && !test_empty_html(htmlInjection)"
      id="rich_show_content"
      class="fadeIn"
      @click="editState = true, $emit('on-edit-change', 'edit', itemId)"
      v-html="update_html(htmlInjection, true)"
    />
    <div v-else-if="editState" class="fadeIn">
      <div class="menu_bar_wrapper">
        <editor-menu-bar
          v-slot="{ commands, isActive }"
          :editor="editor"
        >
          <div>
            <div id="menu_bar" :class="{ editorFocused: caretInEditor }">
              <button
                class="fadeIn"
                :class="{ 'is-active': isActive.bold() }"
                @click="commands.bold"
              >
                <inline-svg :src="require('../assets/svg/editor/bold.svg')" />
              </button>
              <button
                class="fadeIn"
                :class="{ 'is-active': isActive.italic() }"
                @click="commands.italic"
              >
                <inline-svg :src="require('../assets/svg/editor/italic.svg')" />
              </button>
              <button
                class="fadeIn"
                :class="{ 'is-active': isActive.underline() }"
                @click="commands.underline"
              >
                <inline-svg :src="require('../assets/svg/editor/underline.svg')" />
              </button>
              <button
                class="fadeIn"
                :class="{ 'is-active': isActive.ordered_list() }"
                @click="commands.ordered_list"
              >
                <inline-svg :src="require('../assets/svg/editor/ol.svg')" />
              </button>
              <button
                class="fadeIn"
                :class="{ 'is-active': isActive.bullet_list() }"
                @click="commands.bullet_list"
              >
                <inline-svg :src="require('../assets/svg/editor/ul.svg')" />
              </button>
              <button
                class="fadeIn"
                :class="{ 'is-active': isActive.todo_list() }"
                @click="commands.todo_list"
              >
                <inline-svg :src="require('../assets/svg/editor/checklist.svg')" />
              </button>
              <button
                class="fadeIn"
                @click="showAddImage = !showAddImage, showAddTemplate = false"
              >
                <inline-svg :src="require('../assets/svg/editor/image.svg')" />
              </button>
              <button
                v-if="dataForTemplates !== undefined && dataForTemplates !== null"
                class="fadeIn"
                @click="showAddTemplate = !showAddTemplate, showAddImage = false, $parent.go_to_event(itemId, weekId)"
              >
                <inline-svg :src="require('../assets/svg/editor/template.svg')" />
              </button>
              <button
                class="fadeIn"
                @click="commands.undo"
              >
                <inline-svg :src="require('../assets/svg/editor/undo.svg')" />
              </button>
              <button
                class="fadeIn"
                @click="commands.redo"
              >
                <inline-svg :src="require('../assets/svg/editor/redo.svg')" />
              </button>
            </div>
            <!-- IMAGE -->
            <div v-if="showAddImage" class="image_menu">
              <input id="img_uploader" type="file" accept=".png, .jpeg, .jpg, .webp, .gif" @change="add_img(commands.image)">
            </div>
          </div>
        </editor-menu-bar>
        <!-- TEMPLATE -->
        <div v-if="showAddTemplate" class="template_menu small_border_radius">
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
          <button
            v-for="(example, exampleIndex) in exampleTemplates"
            v-show="search === ''"
            :key="`example_${exampleIndex}`"
            class="template_item"
            @click="previewDesc = example.name, previewHTML = example.html"
          >
            {{ example.name }}
          </button>
          <h2>
            Your templates
          </h2>
          <button
            v-for="(item, index) in dataForTemplates"
            v-show="((!search) || ((item.name).toLowerCase()).startsWith(search.toLowerCase()))"
            :key="'template-' + index"
            class="template_item"
            @click="previewDesc = item.name, previewHTML = item.template"
          >
            {{ item.name }}
          </button>
          <p id="templates_search_none">
            No templates found
          </p><br>
        </div>
        <editor-menu-bubble
          v-slot="{ commands, isActive, getMarkAttrs, menu }"
          class="menububble fadeIn"
          :editor="editor"
          @hide="hideLinkMenu"
        >
          <div
            class="menububble"
            :class="{ 'is-active': menu.isActive }"
            :style="`left: ${menu.left}px; bottom: ${menu.bottom - (isMobile ? 80 : 0)}px;`"
          >
            <form
              v-if="linkMenuIsActive"
              class="menububble__form"
              @submit.prevent="setLinkUrl(commands.link, linkUrl)"
            >
              <input
                ref="linkInput"
                v-model="linkUrl"
                class="menububble__input"
                type="text"
                placeholder="https://"
                @keydown.esc="hideLinkMenu"
              >
              <button
                class="menububble__button"
                type="button"
                @click="setLinkUrl(commands.link, null)"
              >
                <inline-svg :src="require('../assets/svg/editor/remove.svg')" />
              </button>
            </form>
            <template v-else>
              <button
                class="menububble__button"
                :class="{ 'is-active': isActive.link() }"
                @click="showLinkMenu(getMarkAttrs('link'))"
              >
                <span>{{ isActive.link() ? 'Update Link' : 'Add Link' }}</span>
                <inline-svg :src="require('../assets/svg/editor/link.svg')" />
              </button>
            </template>
          </div>
        </editor-menu-bubble>
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
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import { Bold, Italic, Underline, ListItem, BulletList, OrderedList, TodoItem, TodoList, Link, Image, History } from 'tiptap-extensions'
const PreviewModal = () => import(/* webpackChunkName: "components.previewModal", webpackPrefetch: true */ './PreviewModal')

export default {
  components: {
    PreviewModal,
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble
  },
  props: {
    itemId: [Number, String],
    weekId: Number,
    editing: [Number, String],
    htmlInjection: String,
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

      // Preview
      previewDesc: null,
      previewHTML: null,

      // Link
      linkUrl: null,
      linkMenuIsActive: false,

      // Image
      showAddImage: false,
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
          content: '',
          extensions: [
            new Bold(),
            new Italic(),
            new Underline(),
            new ListItem(),
            new BulletList(),
            new OrderedList(),
            new TodoItem({
              nested: true
            }),
            new TodoList(),
            new Link(),
            new Image(),
            new History()
          ]
        })
        this.editor.on('update', () => { this.update_edited_notes() })
        this.editor.on('focus', () => {
          this.caretInEditor = true
          this.showAddTemplate = false
          this.showAddImage = false
          this.will_body_scroll(true)
        })
        this.editor.on('blur', () => { this.caretInEditor = false })
        this.editor.setContent(this.update_html(this.htmlInjection, false))
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

    showLinkMenu (attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu () {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl (command, url) {
      command({ href: url })
      this.hideLinkMenu()
    },

    // IMG

    add_img (command) {
      const file = document.getElementById('img_uploader').files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const src = reader.result
        command({ src })
        this.update_edited_notes()
        this.showAddImage = false
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

    // Misc.

    isSearchEmpty () {
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
      this.$emit('update:htmlInjection', document.getElementById('rich_editor').querySelector('.ProseMirror').innerHTML)
    }
  }
}
</script>
