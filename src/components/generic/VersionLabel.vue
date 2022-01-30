<template>
    <div class="flex items-center">
        <icon :svg="versionName.toLowerCase()" :icon-size="20" />
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
