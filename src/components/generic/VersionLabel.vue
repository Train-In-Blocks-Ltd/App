<template>
    <div class="flex items-center">
        <inline-svg
            :src="require(`@/assets/svg/${versionName.toLowerCase()}.svg`)"
            :aria-label="versionName"
        />
        <txt type="tiny" class="ml-2" bold>
            {{ versionName }} {{ versionBuild }}
        </txt>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(["versionName", "versionBuild"]),
};
</script>
