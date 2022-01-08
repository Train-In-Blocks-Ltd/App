<style lang="scss" scoped>
.version {
    display: flex;
    p {
        margin-left: 0.2rem;
        line-height: 1.65;
    }
}
</style>

<template>
    <div class="version">
        <inline-svg
            :src="require(`@/assets/svg/${versionName.toLowerCase()}.svg`)"
            :aria-label="versionName"
        />
        <txt type="tiny" bold> {{ versionName }} {{ versionBuild }} </txt>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(["versionName", "versionBuild"]),
};
</script>
