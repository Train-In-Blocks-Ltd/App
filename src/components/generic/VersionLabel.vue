<template>
    <div class="flex items-center">
        <icon :svg="versionName.toLowerCase()" :size="20" />
        <txt type="tiny" class="ml-2" bold>
            {{ versionName }} {{ versionBuild }}
        </txt>
    </div>
</template>

<script lang="ts">
import appModule from "../../store/app.module";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class VersionLabel extends Vue {
    get versionName() {
        return appModule.versionName;
    }
    get versionBuild() {
        return appModule.versionBuild;
    }
}
</script>
