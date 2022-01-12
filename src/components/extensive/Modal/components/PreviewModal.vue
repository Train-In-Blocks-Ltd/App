<template>
    <div v-if="previewHTML" v-html="previewHTML" />
    <txt v-else>Something went wrong...</txt>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(["previewHTML"]),
};
</script>
