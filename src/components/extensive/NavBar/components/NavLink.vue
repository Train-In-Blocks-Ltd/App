<style lang="scss" scoped>
.router-link-exact-active {
    opacity: 1;
}
</style>

<template>
    <router-link
        v-if="internal && forUser.includes(claims.user_type)"
        :to="link"
        :title="name"
        :class="{ 'md:hidden': name === 'Refresh' }"
        class="flex justify-center h-fit no-underline cursor-pointer my-3 opacity-50 hover:opacity-100 transition-all p-3 md:p-0"
    >
        <icon :svg="svg" :icon-size="24" />
    </router-link>
    <a
        v-else
        :href="link"
        :title="name"
        @click="onClick()"
        :class="{ 'md:hidden': name === 'Refresh' }"
        class="flex justify-center h-fit no-underline cursor-pointer my-3 opacity-50 hover:opacity-100 transition-all p-3 md:p-0"
    >
        <icon :svg="svg" :icon-size="24" />
    </a>
</template>

<script>
import { mapState } from "vuex";

export default {
    props: {
        internal: Boolean,
        name: String,
        link: String,
        svg: String,
        forUser: Array,
        onClick: Function,
    },
    computed: mapState(["claims"]),
};
</script>
