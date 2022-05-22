<template>
    <card-wrapper class="p-2 md:p-4" noHover>
        <txt type="large-body" class="mb-1" bold>
            {{ plan.name }}
        </txt>
        <div class="flex">
            <router-link
                :to="link"
                :aria-label="isTrainer ? 'Edit' : 'View'"
                class="mr-3"
            >
                {{ isTrainer ? "Edit" : "View" }}
            </router-link>
            <a
                v-if="plan.notes && plan.notes !== '<p></p>'"
                href="javascript:void(0)"
                aria-label="Plan notes"
                @click="handleOpenNotes"
            >
                Notes
            </a>
        </div>
    </card-wrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import utilsModule from "../../store/utils.module";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "../../components/generic/CardWrapper.vue"
    );

@Component({
    components: {
        CardWrapper,
    },
})
export default class PlanCard extends Vue {
    @Prop(Object) readonly plan!: any;
    @Prop(String) readonly link!: string;
    @Prop(Boolean) readonly isTrainer!: boolean;

    handleOpenNotes() {
        utilsModule.openModal({
            name: "preview",
            previewTitle: "Plan Notes",
            previewHTML: this.plan.notes,
        });
    }
}
</script>
