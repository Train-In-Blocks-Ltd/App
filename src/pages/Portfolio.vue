<style scoped>
  /* Trainer Info */
  .trainer_info input {
    width: 100%;
    background-color: initial;
    border: 1px solid #28282840;
    padding: .6rem 1rem;
    border-radius: 3px;
    transition: .4s all cubic-bezier(.165, .84, .44, 1)
  }
  .trainer_info input:hover {
    opacity: .6
  }
  .trainer_info input:focus {
    opacity: 1;
    border: 1px solid #282828;
    padding: .6rem 1.4rem
  }
  .trainer_info .trainer_info__business {
    max-width: 100%;
    margin-bottom: 1rem
  }

  /* Card */
  .wrapper_card {
    display: grid;
    box-shadow: 0 0 20px 10px #28282808;
    padding: 1rem 2rem 2rem 2rem;
    border-radius: 3px;
    margin: 4rem 0
  }
</style>

<template>
  <div id="portfolio">
    <form class="trainer_info" @submit.prevent="">
      <input
        class="trainer_info__business text--large"
        placeholder="Business name"
        aria-label="Business name"
        type="text"
        autocomplete="name"
      >
      <input
        class="input--forms allow_text_overflow"
        placeholder="Trainer Name"
        aria-label="Trainer Name"
        type="text"
        autocomplete="name"
      >
    </form>
    <div class="wrapper_card">
      <div v-if="!editingCard" class="show_card" />
      <quill v-if="editingCard" output="html" class="quill animate animate__fadeIn" />
      <div class="bottom_bar">
        <div>
          <button v-if="!editingCard" @click="editingCard = true">Edit</button>
          <button v-if="editingCard" @click="editingCard= false">Save</button>
          <button v-if="editingCard" @click="editingCard= false" class="cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        editingCard: false
      }
    }
  }
</script>