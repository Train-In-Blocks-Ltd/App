<template>
    <div>
        <div
            v-if="getClientBookings(bookings).length !== 0"
            class="flex flex-col mt-8"
        >
            <booking
                v-for="(booking, index) in getClientBookings(bookings)"
                :key="`all-booking-${index}}`"
                :booking="booking"
                :class="{
                    'mb-4': index !== getClientBookings(bookings).length - 1,
                }"
                is-trainer
            />
        </div>
        <txt v-else type="large-body" grey>No bookings yet</txt>
    </div>
</template>

<script>
import { mapState } from "vuex";

const Booking = () =>
    import(
        /* webpackChunkName: "components.booking", webpackPreload: true  */ "@/components/generic/Booking"
    );

export default {
    components: {
        Booking,
    },
    computed: mapState(["bookings"]),
    methods: {
        /**
         * Gets all the bookings for this client.
         */
        getClientBookings(bookings) {
            return bookings.filter(
                (booking) =>
                    booking.client_id === parseInt(this.$route.params.client_id)
            );
        },
    },
};
</script>
