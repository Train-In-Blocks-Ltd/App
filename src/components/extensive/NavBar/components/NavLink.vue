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
        class="flex h-fit no-underline cursor-pointer my-3 opacity-50 hover:opacity-100 transition-all"
    >
        <icon :svg="svg" :size="24" />
        <txt class="ml-3 hidden group-hover:block animate-fade-in">{{
            name
        }}</txt>
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
        @click="
            () => {
                if (onClick) onClick();
            }
        "
        :class="{ 'md:hidden': name === 'Refresh' }"
        class="flex h-fit no-underline cursor-pointer my-3 opacity-50 hover:opacity-100 transition-all"
    >
        <icon :svg="svg" :size="24" />
        <txt class="ml-3 hidden md:group-hover:block animate-fade-in">{{
            name
        }}</txt>
    </a>
</template>

<script lang="ts">
import appModule from "../../../../store/app.module";
import accountModule from "../../../../store/account.module";
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
        return accountModule.claims;
    }
    get isDemo() {
        return appModule.isDemo;
    }
}
</script>
