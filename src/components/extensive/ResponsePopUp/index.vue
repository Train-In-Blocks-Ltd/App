<template>
    <div v-if="show">
        <div
            class="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg ml-8 mt-8 p-4 w-2/3 max-w-xl"
        >
            <txt bold>
                {{ title }}
            </txt>
            <txt>
                {{ text }}
            </txt>
            <default-button
                v-if="persist"
                class="mt-4"
                aria-label="Okay"
                :on-click="close"
            >
                Okay
            </default-button>
        </div>
        <backdrop v-if="backdrop" />
    </div>
</template>

<script lang="ts">
import { ResponsePopUpParams } from "../../../common/types";
import { Component, Vue } from "vue-property-decorator";

const Backdrop = () =>
    import(
        /* webpackChunkName: "components.backdrop", webpackPrefetch: true  */ "../../../components/generic/Backdrop.vue"
    );

@Component({
    components: {
        Backdrop,
    },
})
export default class ResponsePopUp extends Vue {
    show: boolean = false;
    title: string = "";
    text?: string = "";
    persist?: boolean = false;
    backdrop?: boolean = false;

    open({ title, text, persist, backdrop }: ResponsePopUpParams) {
        this.show = true;
        this.title = title;
        this.text = text;
        this.persist = persist;
        this.backdrop = backdrop;

        if (!persist) setTimeout(this.close, 3000);
    }
    close() {
        this.show = false;
        this.title = "";
        this.text = "";
        this.persist = false;
        this.backdrop = false;
    }
}
</script>
