<template>
    <div id="bookings">
        <div class="flex justify-between items-center mb-8">
            <txt type="title">Bookings</txt>
            <icon-button
                svg="list"
                :on-click="
                    () =>
                        $store.dispatch('openModal', {
                            name: 'bookings',
                        })
                "
                :icon-size="28"
            />
        </div>
        <skeleton v-if="loading" :type="'bookings'" />
        <div v-else class="grid grid-cols-2 gap-8">
            <div v-if="upcoming().length > 0" class="flex flex-col">
                <booking
                    v-for="(booking, bookingIndex) in upcoming().slice(0, 3)"
                    :key="`bookings_${bookingIndex}`"
                    :booking="booking"
                    is-trainer
                />
            </div>
            <txt v-else type="large-body" grey
                >No upcoming bookings made or confirmed</txt
            >
            <booking-form is-trainer />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

const Booking = () =>
    import(
        /* webpackChunkName: "components.booking", webpackPreload: true  */ "@/components/generic/Booking"
    );
const BookingForm = () =>
    import(
        /* webpackChunkName: "components.bookingForm", webpackPreload: true  */ "@/components/generic/BookingForm"
    );

export default {
    components: {
        Booking,
        BookingForm,
    },
    computed: mapState(["bookings", "loading"]),
    methods: {
        upcoming() {
            return this.bookings
                .filter((booking) => new Date(booking.datetime) > new Date())
                .filter(
                    (booking) =>
                        booking.client_id ===
                        parseInt(this.$route.params.client_id)
                );
        },
    },
};
</script>
