<style lang="scss">

/* Editor objects */
.editor_object_standard {
  border: 3px solid var(--base);
  border-radius: 10px;
  background: var(--back);
  transition: .6s border cubic-bezier(.165, .84, .44, 1);
  h3 {
    position: relative;
    left: 2rem;
    padding: .6rem;
    width: fit-content;
    background: var(--base);
    color: var(--fore);
    border-radius: 0 0 10px 10px
  }
  #wrapper--rich_editor {
    background: var(--back);
    margin: 2rem
  }

  /* State */
  &.is-active {
    opacity: .4
  }
}
.editor_object_complex {
  display: grid;
  padding: 2rem;
  background: var(--back);
  border: 2px solid var(--base);
  border-radius: 10px;
  transition: .6s border cubic-bezier(.165, .84, .44, 1);

  /* State */
  &.is-active {
    opacity: .4
  }
}

/* Editor */
@mixin todo-list {
  ul[data-type='taskList'] {
    list-style: none;
    padding: 0;
    li {
      display: flex;
      align-items: center;
      label {
        flex: 0 0 auto;
        margin-right: .5rem
      }
    }
  }
}
@mixin editor-main {
  cursor: pointer;
  padding: 1rem;
  border: 2px solid var(--base_faint);
  border-radius: 10px;
  margin-top: 1rem;
  transition: .6s opacity cubic-bezier(.165, .84, .44, 1), .6s border cubic-bezier(.165, .84, .44, 1);
  &:hover {
    border: 2px solid var(--base_light);
    opacity: var(--light_opacity)
  }
}
.placeholder {
  @include editor-main;

  outline: none
}
div#rich_show_content {
  @include todo-list;
  @include editor-main;

  display: grid;
  grid-template-columns: 1fr 24px;
  > div:first-child > :is(div, p) {
    margin: .6rem 0;
    outline: none;
    -moz-appearance: none;
    -webkit-appearance: none
  }
  iframe {
    display: none
  }
  img {
    cursor: pointer;
    border-radius: 10px;
    max-width: 40%;
    margin: 1rem 0;
    transition: .4s all cubic-bezier(.165, .84, .44, 1)
  }
  a {
    color: var(--link)
  }
  .ProseMirror {
    outline: none
  }
}
button.menu_button:focus {
  box-shadow: none
}
div#rich_editor {
  @include todo-list;
  div[contenteditable] {
    outline: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    > :is(div, p) {
      margin: .6rem 0
    }
    iframe {
      display: none
    }
    img {
      cursor: pointer;
      border-radius: 10px;
      max-width: 40%;
      margin: 1rem 0;
      transition: .4s all cubic-bezier(.165, .84, .44, 1);
      &:hover {
        opacity: var(--light_opacity)
      }
    }
    a {
      color: var(--link)
    }
  }
}
svg.edit_icon {
  &.placeholder_icon {
    float: right
  }
  path {
    stroke: var(--base_light);
    transition: var(--transition_standard)
  }
}

/* Responsive */
@media (max-width: 768px) {
  div#rich_editor > div[contenteditable] img,
  div#rich_show_content img {
    max-width: 100%
  }
}
@media (max-width: 576px) {
  .editor_object_standard {
    h3 {
      left: 1rem
    }
    #wrapper--rich_editor {
      margin: 1rem
    }
  }
  .editor_object_complex {
    padding: 1rem
  }
}
@media (max-width: 768px) {
  div#rich_show_content :is(img, iframe) {
    max-width: 100%
  }
}
</style>

<style lang="scss" scoped>

// -----------------------------
// Menu and placeholder
// -----------------------------

/* Attr */
[data-placeholder]:empty:before {
  content: attr(data-placeholder);
  color: #888888;
  font-style: italic
}

/* Outer container of menu */
.menu_bar_wrapper {
  z-index: 1;
  position: sticky;
  top: 0;
  padding-top: 1rem;
  background-color: var(--back);

  /* Inner container of menu */
  #menu_bar {
    border: 2px solid var(--base_faint);
    border-radius: 10px 10px 0 0;
    padding: 0 1rem;
    transition: var(--transition_standard);
    &.editorFocused {
      border: 2px solid var(--base)
    }
    button {
      padding: 0;
      margin: .8rem 1rem .6rem 0;
      color: var(--base);
      background-color: transparent
    }
    svg {
      height: 20px;
      width: 20px
    }
  }
}

// -----------------------------
// Templates
// -----------------------------
.template_menu {
  display: grid;
  grid-gap: 1rem;
  #templates_search_none {
    display: none
  }
  .close_icon {
    display: flex;
    justify-self: end
  }
  h3 {
    margin-top: 1rem
  }
  .templates_container {
    display: grid;
    grid-gap: 1rem;
    .template_item {
      display: grid;
      grid-template-columns: .5fr 1fr;
      grid-gap: 2rem;
      button {
        width: fit-content
      }
      svg {
        margin: auto 0 auto .6rem
      }
      .preview_html {
        max-height: 400px;
        font-size: .8rem;
        padding: 1rem;
        background-color: var(--fore);
        border: 2px solid var(--base);
        border-radius: 5px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 3px
        }
      }
    }
  }
}

// -----------------------------
// Editor
// -----------------------------
div#rich_editor {
  padding: 1rem;
  outline-width: 0;
  border: 2px solid var(--base_faint);
  border-top: none;
  border-radius: 0 0 10px 10px;
  transition: var(--transition_standard);
  &.editorFocused {
    border: 2px solid var(--base);
    border-top: none
  }
}
.bottom_bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: .6rem;
  margin-top: 1rem;
  z-index: 1
}

/* Responsive */
@media (max-width: 992px) {
  .template_menu {
    .templates_container {
      grid-gap: 3rem;
      .template_item {
        display: flex;
        flex-direction: column-reverse;
        grid-gap: .6rem;
        button {
          width: 100%
        }
      }
    }
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
        <inline-svg
          class="close_icon cursor"
          :src="require('../assets/svg/close.svg')"
          aria-label="Close"
          @click="showAddTemplate = false, search = ''"
        />
        <input
          v-if="dataForTemplates.length !== 0"
          v-model="search"
          type="search"
          aria-label="Search templates"
          rel="search"
          placeholder="Search templates"
          @input="isSearchEmpty()"
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
        </p>
      </div>
    </div>
    <div
      v-if="!editState && !test_empty_html(value)"
      id="rich_show_content"
      class="fadeIn"
      @click="editState = true, $emit('on-edit-change', 'edit', itemId)"
    >
      <div v-html="updateHTML(value, true)" />
      <inline-svg
        :src="require('../assets/svg/editor/pencil.svg')"
        class="edit_icon no_fill"
      />
    </div>
    <transition v-else-if="editState" enter-active-class="fadeIn">
      <div>
        <div class="menu_bar_wrapper">
          <div id="menu_bar" :class="{ editorFocused: caretInEditor }">
            <button
              class="fadeIn menu_button"
              :class="{ 'is-active': editor.isActive('bold') }"
              title="Bold"
              @click="editor.chain().focus().toggleBold().run()"
            >
              <inline-svg :src="require('../assets/svg/editor/bold.svg')" />
            </button>
            <button
              class="fadeIn menu_button"
              :class="{ 'is-active': editor.isActive('italic') }"
              title="Italic"
              @click="editor.chain().focus().toggleItalic().run()"
            >
              <inline-svg :src="require('../assets/svg/editor/italic.svg')" />
            </button>
            <button
              class="fadeIn menu_button"
              :class="{ 'is-active': editor.isActive('underline') }"
              title="Underline"
              @click="editor.chain().focus().toggleUnderline().run()"
            >
              <inline-svg :src="require('../assets/svg/editor/underline.svg')" />
            </button>
            <button
              class="fadeIn menu_button"
              :class="{ 'is-active': editor.isActive('ordered_list') }"
              title="Ordered list"
              @click="editor.chain().focus().toggleOrderedList().run()"
            >
              <inline-svg :src="require('../assets/svg/editor/ol.svg')" />
            </button>
            <button
              class="fadeIn menu_button"
              :class="{ 'is-active': editor.isActive('bullet_list') }"
              title="Bullet list"
              @click="editor.chain().focus().toggleBulletList().run()"
            >
              <inline-svg :src="require('../assets/svg/editor/ul.svg')" />
            </button>
            <button
              class="menu_button"
              :class="{ 'is-active': editor.isActive('taskList') }"
              title="Checklist"
              @click="editor.chain().focus().toggleTaskList().run()"
            >
              <inline-svg :src="require('../assets/svg/editor/checklist.svg')" />
            </button>
            <button
              class="fadeIn menu_button"
              :class="{ 'is-active': editor.isActive('horizontalRule') }"
              title="Horizontal line"
              @click="editor.chain().focus().setHorizontalRule().run()"
            >
              <inline-svg :src="require('../assets/svg/editor/horizontal-rule.svg')" />
            </button>
            <button
              class="fadeIn menu_button"
              :class="{ 'is-active': editor.isActive('link') }"
              title="Hyperlink"
              @click="editor.isActive('link') ? editor.chain().focus().unsetLink().run() : setLinkUrl()"
            >
              <inline-svg :src="require('../assets/svg/editor/link.svg')" />
            </button>
            <button
              class="fadeIn menu_button"
              title="Image"
              @click="showAddTemplate = false, $refs.input_pop_up.show('image', 'Select your image to upload', 'Make sure that it\'s less than 1MB')"
            >
              <inline-svg :src="require('../assets/svg/editor/image.svg')" />
            </button>
            <button
              v-if="dataForTemplates !== undefined && dataForTemplates !== null"
              class="fadeIn menu_button"
              title="Template"
              @click="showAddTemplate = !showAddTemplate, $parent.goToEvent(itemId, weekId)"
            >
              <inline-svg :src="require('../assets/svg/editor/template.svg')" />
            </button>
            <button
              class="fadeIn menu_button"
              title="Undo"
              @click="editor.chain().focus().undo().run()"
            >
              <inline-svg :src="require('../assets/svg/editor/undo.svg')" />
            </button>
            <button
              class="fadeIn menu_button"
              title="Redo"
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
    </transition>
    <p
      v-else
      class="placeholder grey fadeIn"
      @click="editState = true, $emit('on-edit-change', 'edit', itemId)"
    >
      {{ emptyPlaceholder }}
      <inline-svg
        :src="require('../assets/svg/editor/pencil.svg')"
        class="edit_icon placeholder_icon no_fill"
      />
    </p>
    <div v-if="editState" class="bottom_bar fadeIn">
      <button @click="saving = true, editState = false , $emit('on-edit-change', 'save', itemId), willBodyScroll(true)">
        Save
      </button>
      <button
        class="red_button"
        @click="saving = false, editState = false , $emit('on-edit-change', 'cancel', itemId), willBodyScroll(true)"
      >
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
import LazyImage from './js/LazyImage'

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
      initialValue: null,
      editor: null,
      editState: false,
      caretInEditor: false,
      cloudinaryImages: {
        startingWith: [],
        endingWith: []
      },
      newImgs: [],
      saving: false,

      // Link
      linkUrl: null,
      linkMenuIsActive: false,

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
        this.willBodyScroll(false)
      } else {
        this.willBodyScroll(true)
      }
    },
    editState () {
      if (this.editState) {
        this.initialValue = this.value
        this.editor = new Editor({
          content: this.value,
          extensions: [
            ...defaultExtensions(),
            Undeline,
            Link,
            TaskList,
            TaskItem,
            LazyImage
          ],
          onUpdate: () => {
            this.cloudinaryImages.endingWith = this.imgFinder(this.value)
            this.$emit('input', this.editor.getHTML())
          },
          onFocus: () => {
            this.caretInEditor = true
            this.showAddTemplate = false
            this.willBodyScroll(true)
          },
          onBlur: () => {
            this.cloudinaryImages.endingWith = this.imgFinder(this.value)
            this.caretInEditor = false
          },
          onDestroy: async () => {
            if (!this.saving) {
              await this.cancelledRemoveNewImgs()
              this.cloudinaryImages.endingWith = this.cloudinaryImages.startingWith
            }
            this.cloudinaryImages.startingWith.forEach(async (url) => {
              if (!this.cloudinaryImages.endingWith.includes(url)) {
                await this.$axios.post('/.netlify/functions/delete-image', { file: url })
              }
            })
            this.initialValue = null
            this.cloudinaryImages = {
              startingWith: [],
              endingWith: []
            }
            this.newImgs = []
          }
        })

        const FOUND_IMGS = this.imgFinder(this.value)
        this.cloudinaryImages.startingWith = FOUND_IMGS
        this.cloudinaryImages.endingWith = FOUND_IMGS
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
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Finds all the images in the html.
     * @param {string} html - The html to search.
     * @returns An array of all the found ids of cloudinary images.
     */
    imgFinder (html) {
      const IMG_REGEX = /<img.*?src="(.*?)".*?>/gi
      const RETURN_ARR = []
      let finder
      while ((finder = IMG_REGEX.exec(html)) !== null) {
        if (finder.index === IMG_REGEX.lastIndex) {
          IMG_REGEX.lastIndex++
        }
        finder.forEach(async (match, groupIndex) => {
          if (groupIndex === 1) {
            if (match.includes('base64')) {
              await this.$axios.post('/.netlify/functions/upload-image', { file: match }).then((response) => {
                RETURN_ARR.push(response.data.url)
                this.cloudinaryImages.startingWith.push(response.data.url)
                this.cloudinaryImages.endingWith.push(response.data.url)
                this.newImgs.push(response.data.url)
                this.initialValue = this.initialValue.replace(`${match}"`, `${response.data.url}" loading="lazy"`)
                this.editor.commands.setContent(this.initialValue)
                this.$emit('input', this.editor.getHTML())
              })
            } else {
              RETURN_ARR.push(match)
            }
          } else if (match.includes('base64')) {
            const WRAPPED_REGEX = /<p>(<img.*?">).*?<\/p>/gi
            let wrappedFinder
            while ((wrappedFinder = WRAPPED_REGEX.exec(this.initialValue)) !== null) {
              if (wrappedFinder.index === WRAPPED_REGEX.lastIndex) {
                WRAPPED_REGEX.lastIndex++
              }
              this.initialValue = this.initialValue.replace(wrappedFinder[0], wrappedFinder[1])
            }
          }
        })
      }
      return RETURN_ARR
    },

    cancelledRemoveNewImgs () {
      if (this.newImgs) {
        this.newImgs.forEach(async (url) => {
          await this.$axios.post('/.netlify/functions/delete-image', { file: url })
        })
      }
    },

    /**
     * Adds tracked data custom node.
     */
    addTrackData () {
      this.editor.commands.insertContent('<div data-type="protocol-item"></div>')
    },

    /**
     * Sets the link of the selected text.
     */
    async setLinkUrl () {
      const SRC = await this.$refs.input_pop_up.show('link', 'Enter the URL link', 'Make sure to include the https://')
      if (!SRC) {
        return
      }
      this.editor.chain().focus().setLink({ href: SRC }).run()
    },

    /**
     * Adds an image.
     */
    addImg () {
      const FILE = document.getElementById('img_uploader').files[0]
      const READER = new FileReader()
      READER.addEventListener('load', () => {
        this.$axios.post('/.netlify/functions/upload-image', { file: READER.result.toString() }).then((response) => {
          this.editor.chain().focus().setImage({ src: response.data.url, loading: 'lazy' }).run()
          this.cloudinaryImages.startingWith.push(response.data.url)
          this.cloudinaryImages.endingWith.push(response.data.url)
          this.newImgs.push(response.data.url)
        })
      }, false)

      if (FILE) {
        if (FILE.size < 1100000) {
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

    // -----------------------------
    // Misc.
    // -----------------------------

    /**
     * Checks if the template search is empty.
     */
    isSearchEmpty () {
      let showNoneMsg = true
      this.dataForTemplates.forEach((template) => {
        if (((template.name).toLowerCase()).startsWith(this.search.toLowerCase()) && this.search !== '') {
          showNoneMsg = false
        }
      })
      document.getElementById('templates_search_none').style.display = showNoneMsg && this.search !== '' ? 'block' : 'none'
    },

    /**
     * Tests injected html to see if it's empty.
     */
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
