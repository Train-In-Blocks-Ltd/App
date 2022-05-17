<template>
    <div class="flex items-center">
        <icon :svg="versionName.toLowerCase()" :icon-size="20" />
        <txt type="tiny" class="ml-2" bold>
            {{ versionName }} {{ versionBuild }}
        </txt>
    </div>
</template>

<script lang="ts">
import appState from "../../store/modules/appState";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class VersionLabel extends Vue {
    get versionName() {
        return appState.versionName;
    }
    get versionBuild() {
        return appState.versionBuild;
    }
}
</script>
