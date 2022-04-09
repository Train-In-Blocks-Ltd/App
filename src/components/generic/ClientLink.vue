<style lang="scss">
.preview_html {
    font-size: 0.8rem;
    margin-top: 0.4rem;
    p {
        margin: 0.4rem 0;
    }
    img,
    iframe,
    a,
    > div > br:only-child {
        display: none;
    }
}
</style>

<template>
    <card-wrapper class="grid p-4 md:p-8 gap-4" :no-hover="archive">
        <!-- Top section -->
        <div class="relative sm:flex">
            <div
                v-if="client.profile_image"
                :style="{ backgroundImage: `url(${client.profile_image})` }"
                class="mr-4 bg-cover bg-center rounded-full h-20 w-20"
                style="filter: grayscale(0.8)"
            />
            <icon
                v-else
                svg="user"
                :icon-size="80"
                class="p-4 border-3 border-gray-800 dark:border-white rounded-full mr-4"
            />
            <div class="mt-4 sm:mt-0">
                <txt type="large-body" bold>
                    {{ client.name }}
                </txt>
                <div v-if="client.email" class="flex items-center">
                    <icon svg="mail" :icon-size="22" class="mr-2" />
                    <txt>
                        {{ client.email }}
                    </txt>
                </div>
                <div v-if="client.number" class="flex items-center">
                    <icon svg="smartphone" :icon-size="22" class="mr-2" />
                    <txt>
                        {{ client.number }}
                    </txt>
                </div>
            </div>
            <checkbox
                v-if="archive"
                :item-id="client.client_id"
                class="absolute top-0 right-0"
            />
        </div>

        <!-- Next booking section -->
        <div v-if="nextBooking" class="flex items-center">
            <txt class="mr-2" bold> Next booking: </txt>
            <txt>
                {{
                    day(
                        nextBooking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0]
                    ).toUpperCase()
                }}
                {{ nextBooking.datetime.match(/\d{4}-\d{2}-\d{2}/)[0] }} at
                {{ shortTime(nextBooking.datetime) }}
            </txt>
        </div>

        <!-- Notes preview -->
        <txt v-if="!archive && !client.notes.replace(/<[^>]*>?/gm, '')" grey>
            What client information do you currently have? Head over to this
            page and edit it.
        </txt>
        <div
            v-else
            class="preview_html"
            v-html="updateHTML(client.notes, true)"
        />
    </card-wrapper>
</template>

<script>
import { mapState } from "vuex";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "@/components/generic/CardWrapper"
    );
const Checkbox = () =>
    import(
        /* webpackChunkName: "components.checkbox", webpackPreload: true  */ "./Checkbox"
    );

export default {
    components: {
        CardWrapper,
        Checkbox,
    },
    props: {
        client: Object,
        clientIndex: Number,
        archive: Boolean,
    },
    data() {
        return {
            nextBooking: undefined,
        };
    },
    computed: mapState(["bookings"]),
    created() {
        if (this.bookings) {
            const clientBookings = this.bookings.filter(
                (booking) => booking.client_id === this.client.client_id
            );
            if (clientBookings) this.nextBooking = clientBookings[0];
        }
    },
};
</script>
