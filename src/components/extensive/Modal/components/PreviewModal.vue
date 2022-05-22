<template>
    <div class="mt-4">
        <div v-if="previewHTML" v-html="previewHTML" />
        <txt v-else>Something went wrong...</txt>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import utilsModule from "../../../../store/modules/utils.module";

@Component
export default class PreviewModal extends Vue {
    get previewHTML() {
        return utilsModule.previewHTML;
    }
}
</script>
