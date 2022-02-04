<template>
    <div class="mt-4">
        <div v-if="previewHTML" v-html="previewHTML" />
        <txt v-else>Something went wrong...</txt>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(["previewHTML"]),
};
</script>
