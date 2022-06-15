<template>
    <div id="bookings">
        <div class="flex justify-between items-center mb-8">
            <txt type="title">Bookings</txt>
            <icon-button
                svg="list"
                :on-click="handleOpenAllBookings"
                :size="28"
                aria-label="See all bookings"
                title="See all bookings"
            />
        </div>

        <!-- Skeleton -->
        <div v-if="loading" class="grid grid-cols-2 gap-8">
            <div>
                <div class="skeleton-box animate-pulse p-4 mb-4">
                    <div class="skeleton-item" />
                </div>
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-11/12" />
                    <div class="skeleton-item w-3/4" />
                    <div class="skeleton-item w-5/12" />
                </div>
            </div>
            <div class="grid gap-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="skeleton-box animate-pulse p-4">
                        <div class="skeleton-item" />
                    </div>
                    <div class="skeleton-box animate-pulse p-4">
                        <div class="skeleton-item" />
                    </div>
                </div>
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-1/2" />
                    <div class="skeleton-item" />
                    <div class="skeleton-item w-3/4" />
                </div>
                <div class="skeleton-box animate-pulse">
                    <div class="skeleton-item-lg" />
                </div>
            </div>
        </div>

        <!-- Booking grid -->
        <div v-else class="grid sm:grid-cols-2 sm:gap-8">
            <div v-if="bookings.length > 0" class="flex flex-col">
                <booking
                    v-for="(booking, bookingIndex) in bookings.slice(0, 3)"
                    :key="`bookings_${bookingIndex}`"
                    :booking="booking"
                    class="mb-4"
                    is-trainer
                />
            </div>
            <txt v-else type="large-body" grey class="mb-4 sm:mb-0"
                >No upcoming bookings made or confirmed</txt
            >
            <booking-form is-trainer />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../../../../store/app.module";
import bookingsModule from "../../../../../../store/bookings.module";
import utilsModule from "../../../../../../store/utils.module";
import { Booking } from "../../../../../../common/types";

const Booking = () =>
    import(
        /* webpackChunkName: "components.booking", webpackPreload: true  */ "../../../../../../components/generic/Booking.vue"
    );
const BookingForm = () =>
    import(
        /* webpackChunkName: "components.bookingForm", webpackPreload: true  */ "./../../../../../../components/generic/BookingForm.vue"
    );

@Component({
    components: {
        Booking,
        BookingForm,
    },
})
export default class Bookings extends Vue {
    get bookings() {
        return (
            bookingsModule.bookings
                .filter(
                    (booking) =>
                        new Date(booking.datetime.replace(/-/g, "/")) >
                        new Date()
                )
                .filter(
                    (booking) =>
                        booking.client_id ===
                        parseInt(this.$route.params.client_id)
                ) ?? []
        );
    }
    get loading() {
        return appModule.loading;
    }

    /** Opens all bookings modal. */
    handleOpenAllBookings() {
        utilsModule.openModal({
            name: "bookings",
        });
    }
}
</script>
