<template>
    <span class="loader" v-if="$parent.$parent.loading">
        <inline-svg :src="require('../assets/loader.svg')"/>
    </span>
</template>
<script>
  import InlineSvg from 'vue-inline-svg'
  export default {
    name: 'Loader',
    components: {
      InlineSvg
    }
  }
</script>