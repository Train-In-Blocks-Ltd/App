<template>
    <div class="mt-4">
        <!-- Search -->
        <txt-input
            v-if="templates.length !== 0"
            type="search"
            aria-label="Search templates"
            rel="search"
            placeholder="Search templates"
            class="mb-8"
            :value="search"
            @output="(data) => (search = data)"
        />

        <!-- Default templates -->
        <txt v-show="search === ''" type="large-body" class="mb-4" bold
            >System templates</txt
        >
        <card-wrapper
            v-for="(system, systemIndex) in systemTemplates"
            v-show="search === ''"
            :key="`system-${systemIndex}`"
            class="grid gap-4 p-4 mb-4"
        >
            <div v-html="system.html" />
            <default-button
                :on-click="
                    () => {
                        editor.commands.insertContent(system.html);
                        $store.dispatch('closeModal');
                    }
                "
            >
                {{ system.name }}
            </default-button>
        </card-wrapper>

        <!-- User templates -->
        <txt type="large-body" class="mt-8 mb-4" bold>Your templates</txt>
        <div v-if="!searchEmpty">
            <card-wrapper
                v-for="(item, index) in templates"
                v-show="
                    !search ||
                    item.name.toLowerCase().startsWith(search.toLowerCase())
                "
                :key="'template-' + index"
                class="grid gap-4 p-4 mb-4"
            >
                <div v-html="item.template" />
                <default-button
                    :on-click="
                        () => {
                            editor.commands.insertContent(item.template);
                            $store.dispatch('closeModal');
                        }
                    "
                >
                    {{ item.name }}
                </default-button>
            </card-wrapper>
        </div>
        <txt v-else type="large-body" grey>No templates found</txt>
    </div>
</template>

<script>
import { mapState } from "vuex";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );

export default {
    components: {
        CardWrapper,
    },
    data() {
        return {
            search: "",
            systemTemplates: [
                {
                    name: "Track with sets, reps, and load",
                    html: "<div>[ EXERCISE: SETS x REPS at LOAD ]</div><div>Tip: You can break LOAD into different sets. E.g. 70/80/90kg where SETS must be 3.</div>",
                },
                {
                    name: "Track with sets, reps",
                    html: "<div>[ EXERCISE: SETS x REPS ]</div>",
                },
                {
                    name: "Track with other measurements",
                    html: "<div>[ MEASUREMENT: VALUE ]</div><div>You can use any single measurements like [ BD Fat: 16% ]. E.g. RPE, weight, body-fat, jump height, etc. </div>",
                },
            ],
        };
    },
    computed: {
        ...mapState(["templates", "editor"]),
        searchEmpty() {
            return (
                this.templates.filter((template) =>
                    template.name
                        .toLowerCase()
                        .startsWith(this.search.toLowerCase())
                ).length === 0
            );
        },
    },
};
</script>
