<template>
    <card-wrapper class="p-2 md:p-4" noHover>
        <txt type="large-body" class="mb-1" bold>
            {{ plan.name }}
        </txt>
        <div class="flex">
            <router-link :to="link" href="javascript:void(0)" class="mr-3">
                {{ trainer ? "Edit" : "View" }}
            </router-link>
            <a
                v-if="plan.notes && plan.notes !== '<p></p>'"
                href="javascript:void(0)"
                @click="
                    () => {
                        $store.commit('setData', {
                            attr: 'previewHTML',
                            data: plan.notes,
                        });
                        $store.dispatch('openModal', {
                            name: 'preview',
                        });
                    }
                "
            >
                Notes
            </a>
        </div>
    </card-wrapper>
</template>

<script>
const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );

export default {
    components: {
        CardWrapper,
    },
    props: ["plan", "link", "trainer"],
};
</script>
