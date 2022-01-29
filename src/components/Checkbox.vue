<style lang="scss" scoped>
.check svg {
    position: relative;
    z-index: 1;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5;
    transform: translate3d(0, 0, 0);
    transition: all 0.2s ease;
    path {
        stroke-dasharray: 60;
        stroke-dashoffset: 0;
    }
    polyline {
        stroke-dasharray: 22;
        stroke-dashoffset: 66;
    }
}

.checked_box:checked + .check svg {
    path {
        stroke-dashoffset: 60;
        transition: all 0.3s linear;
    }
    polyline {
        stroke-dashoffset: 42;
        transition: all 0.2s linear;
        transition-delay: 0.15s;
    }
}
</style>

<template>
    <div>
        <input
            :id="`checkbox-${itemId}`"
            :name="`checkbox-${itemId}`"
            class="checked_box"
            type="checkbox"
            style="display: none"
            @change="$store.dispatch('toggleCheckbox', itemId)"
        />
        <label
            :for="`checkbox-${itemId}`"
            class="check cursor-pointer relative m-auto w-4 h-4"
        >
            <svg
                width="18px"
                height="18px"
                viewBox="0 0 18 18"
                class="hover:opacity-60"
            >
                <path
                    d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"
                />
                <polyline points="1 9 7 14 15 4" />
            </svg>
        </label>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: {
        itemId: [Number, Boolean],
    },
    computed: mapState(["selectedIds"]),
    watch: {
        selectedIds(val) {
            const checkboxEl = document.getElementById(
                `checkbox-${this.itemId}`
            );
            if (checkboxEl) checkboxEl.checked = val.includes(this.itemId);
        },
    },
};
</script>
