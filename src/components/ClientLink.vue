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
        <div class="flex">
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
                class="p-4 border-3 border-gray-800 rounded-full mr-4"
            />
            <div>
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
                class="ml-auto"
            />
        </div>
        <div v-if="nextBooking.datetime">
            <txt bold> Next booking: </txt>
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
        <txt
            v-if="
                (client.notes === null ||
                    client.notes === '<p><br></p>' ||
                    client.notes === '') &&
                !archive
            "
            grey
        >
            What client information do you currently have? Head over to this
            page and edit it.
        </txt>
        <div
            v-else-if="!archive"
            class="preview_html"
            v-html="updateHTML(client.notes, true)"
        />
    </card-wrapper>
</template>

<script>
import { mapState } from "vuex";

const CardWrapper = () =>
    import(
        /* webpackChunkName: "components.cardWrapper", webpackPreload: true  */ "./generic/CardWrapper"
    );
const Checkbox = () =>
    import(
        /* webpackChunkName: "components.checkbox", webpackPreload: true  */ "./Checkbox"
    );
const Icon = () =>
    import(
        /* webpackChunkName: "components.icon", webpackPreload: true  */ "./elements/Icon"
    );

export default {
    components: {
        CardWrapper,
        Checkbox,
        Icon,
    },
    props: {
        client: Object,
        clientIndex: Number,
        archive: Boolean,
    },
    data() {
        return {
            nextBooking: {
                datetime: false,
                isToday: false,
            },
        };
    },
    computed: mapState(["bookings"]),
    created() {
        const NEXT_BOOKING =
            this.bookings.filter(
                (booking) =>
                    booking.client_id === this.client.client_id &&
                    new Date(booking.datetime) > new Date()
            )[0] || false;
        if (NEXT_BOOKING) {
            const DATE_AND_TIME = NEXT_BOOKING.datetime.split(" ");
            this.nextBooking.datetime = `${
                DATE_AND_TIME[0] === this.today() ? "Today" : DATE_AND_TIME[0]
            } ${DATE_AND_TIME[1]}`;
            this.nextBooking.isToday = DATE_AND_TIME[0] === this.today();
        }
    },
};
</script>
