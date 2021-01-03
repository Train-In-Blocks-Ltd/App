<style scoped>

  /* Attr */

  [data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #888;
    font-style: italic
  }

  /* Toolbars */

  #rich_toolbar {
    display: flex;
    position: sticky;
    background-color: white;
    border-bottom: 2px solid #28282820;
    top: 0;
    padding-top: 1rem
  }
  #rich_toolbar button {
    padding: 0;
    margin-right: 1rem;
    color: #282828;
    background-color: transparent
  }
  #rich_toolbar button:disabled {
    opacity: .6
  }
  .activeState {
    color: blue
  }

  /* Pop-ups */

  .pop_up--add_link, .pop_up--add_image, .pop_up--add_video {
    position: absolute;
    background-color: white;
    z-index: 99;
    display: flex;
    width: fit-content;
    border-radius: 8px;
    margin: 1rem 0;
    padding: .8rem;
    box-shadow: 0 0 20px 10px #28282810
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

  /* Editor */

  #rich_editor {
    padding: 1rem 0;
    outline-width: 0
  }

  /* Show */

  .padding {
    padding: 1rem 0
  }
</style>

<template>
  <div>
    <div v-if="showEditState">
      <div id="rich_toolbar">
        <button @click="format('bold')"><b>B</b></button>
        <button @click="format('italic')"><i>I</i></button>
        <button @click="format('underline')"><u>U</u></button>
        <button @click="format('insertOrderedList')">List 1</button>
        <button @click="format('insertUnorderedList')">List 2</button>
        <button @click="show_link_adder(), reset_img_pop_up(), reset_video_pop_up()">Link</button>
        <button @click="show_image_adder(), reset_link_pop_up(), reset_video_pop_up()">Image</button>
        <button @click="show_video_adder(), reset_link_pop_up(), reset_img_pop_up()">Video</button>
      </div>
      <!-- LINK -->
      <form v-if="showAddLink" @submit.prevent="add_link()" class="pop_up--add_link">
        <div class="wrapper--input--add_link">
          <input v-model="addLinkName" class="input--add_link" type="text" placeholder="Name" required>
          <input v-model="addLinkURL" class="input--add_link" type="text" placeholder="URL" required>
        </div>
        <button class="add_link_submit" type="submit">Add</button>
      </form>
      <!-- IMAGE -->
      <div v-if="showAddImage" class="pop_up--add_image">
        <input @change="add_img()" id="img_uploader" type="file" accept=".png, .jpeg">
      </div>
      <!-- LINK -->
      <form v-if="showAddVideo" @submit.prevent="add_video()" class="pop_up--add_video">
        <input v-model="addVideoURL" class="input--add_video" type="text" placeholder="URL" required>
        <button class="add_video_submit" type="submit">Add</button>
      </form>
      <div
        @click="reset_link_pop_up(), reset_img_pop_up(), reset_video_pop_up()"
        @input="update_edited_notes()"
        v-html="initialHTML"
        id="rich_editor"
        contenteditable="true"
        data-placeholder="Start typing..."
      />
    </div>
    <div v-if="!showEditState && !test_empty_html(htmlInjection)" v-html="htmlInjection" id="rich_show_content" class="padding"/>
    <p v-if="!showEditState && test_empty_html(htmlInjection)" class="text--small grey padding">{{ emptyPlaceholder }}</p>
  </div>
</template>

<script>
  import Compressor from 'compressorjs'

  export default {
    props: {
      showEditState: Boolean,
      htmlInjection: String,
      emptyPlaceholder: String
    },
    data () {
      return {
        savedSelection: null,
        initialHTML: '',
        editedHTML: '',

        showAddLink: false,
        addLinkName: '',
        addLinkURL: '',

        showAddImage: false,
        base64Img: null,

        showAddVideo: false,
        addVideoURL: ''
      }
    },
    watch: {
      showEditState: function () {
        this.initialHTML = this.htmlInjection
      }
    },
    methods: {

      // GENERAL

      test_empty_html (text) {
        var rmTags = text.replace(/<[^>]*>?/gm, '')
        var rmSpace = rmTags.replace(/&nbsp;/g, '')
        if (rmSpace === '') {
          return true
        } else {
          return false
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
        this.format('insertHTML', `<div><a href="${this.addLinkURL}" target="_blank">${this.addLinkName}</a></div>`)
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
          this.format('insertHTML', `<div><img src="${this.base64Img}" style="border-radius: 10px; max-width: 80%; margin: 1rem 0" /></div>`)
          this.reset_img_pop_up()
        }, false)
        if (file) {
          new Compressor(file, {
            quality: 0.2,
            success(result) {
              reader.readAsDataURL(result)
            },
            error(err) {
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
        this.format('insertHTML', `<div><iframe src="//www.youtube.com/embed/${this.get_embbed_id(this.addVideoURL)}" frameborder="0" allowfullscreen style="border-radius: 10px; max-width: 80%; margin: 1rem 0" /></div>`)
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
      }
    }
  }
</script>