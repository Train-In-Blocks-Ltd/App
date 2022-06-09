<style scoped lang="scss">
.error404 {
    display: grid;
    place-items: center;
    min-height: 100vh;
    min-height: stretch;
    min-height: calc(100vh - env(safe-area-inset-bottom));
    p {
        font-size: 2.5rem;
    }
}
</style>

<template>
    <div class="error404">
        <p>Error 404 Page Not Found</p>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    metaInfo() {
        return {
            title: "404 Not Found",
        };
    },
})
export default class NotFound extends Vue {}
</script>
