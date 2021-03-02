<template>
  <div class="modal--alert">
    <div class="center_wrapped">
      <p class="text--small">
        {{ msg }}
      </p><br>
      <button @click="$modal.hideAll()">
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['msg']
}
</script>
