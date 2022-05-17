<style lang="scss" scoped>
.router-link-exact-active {
    opacity: 1;
}
</style>

<template>
    <router-link
        v-if="
            internal &&
            forUser.includes(claims.user_type) &&
            !(isDemo && link === '/account')
        "
        :to="link"
        :title="name"
        :aria-label="name"
        :class="{ 'md:hidden': name === 'Refresh' }"
        class="flex justify-center h-fit no-underline cursor-pointer my-3 opacity-50 hover:opacity-100 transition-all"
    >
        <icon :svg="svg" :icon-size="24" />
    </router-link>
    <a
        v-else-if="
            forUser.includes(claims.user_type) &&
            !(isDemo && link === '/account')
        "
        :href="link"
        :target="name === 'Help' && '_blank'"
        :title="name"
        :aria-label="name"
        @click="onClick()"
        :class="{ 'md:hidden': name === 'Refresh' }"
        class="flex justify-center h-fit no-underline cursor-pointer my-3 opacity-50 hover:opacity-100 transition-all"
    >
        <icon :svg="svg" :icon-size="24" />
    </a>
</template>

<script lang="ts">
import appState from "../../../../store/modules/appState";
import accountStore from "../../../../store/modules/account";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class NavLink extends Vue {
    @Prop(Boolean) readonly internal!: boolean;
    @Prop(String) readonly name!: string;
    @Prop(String) readonly link!: string;
    @Prop(String) readonly svg!: string;
    @Prop(Array) readonly forUser!: string[];
    @Prop(Function) readonly onClick!: () => void;

    get claims() {
        return accountStore.claims;
    }
    get isDemo() {
        return appState.isDemo;
    }
}
</script>
