<template>
    <div>
        <div class="flex flex-col items-center justify-center">
            <div
                v-if="profile_image"
                :style="{
                    backgroundImage: `url(${profile_image})`,
                }"
                style="filter: grayscale(0.8)"
                class="h-32 w-32 bg-cover bg-center rounded-full mb-8 cursor-pointer hover:opacity-60 transition-opacity"
                @click="handleOpenUpload"
            />
            <icon-button
                v-else
                svg="user"
                class="p-8 rounded-full mb-8 border-3 border-gray-800 dark:border-white cursor-pointer hover:opacity-60 transition-opacity"
                :size="64"
                :on-click="handleOpenUpload"
                aria-label="Upload profile image"
                title="Upload profile image"
            />
            <txt-input
                :value="name"
                :disabled="silentLoading"
                class="w-full sm:w-2/3 lg:w-1/2 mb-4"
                type="name"
                inputmode="name"
                autocomplete="name"
                placeholder="Name"
                aria-label="Name"
                :on-blur="updateClientDetails"
                @output="(data) => (name = data)"
            />
            <txt-input
                :value="number"
                :disabled="silentLoading"
                class="w-full sm:w-2/3 lg:w-1/2"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                placeholder="Mobile"
                aria-label="Mobile"
                pattern="\d+"
                :on-blur="updateClientDetails"
                @output="(data) => (number = data)"
            />
        </div>
        <div>
            <txt type="large-body" class="mb-4 mt-8" bold>Upcoming</txt>
            <div class="grid xl:grid-cols-2 gap-4">
                <div v-if="upcoming.length !== 0">
                    <booking
                        v-for="(booking, index) in upcoming"
                        :key="`bookings_${index}`"
                        :booking="booking"
                        :class="{
                            'mb-4': index !== bookings.length - 1,
                        }"
                    />
                </div>
                <txt v-else type="large-body" class="mb-8 xl:mb-0" grey
                    >No upcoming bookings yet</txt
                >
                <booking-form />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../store/modules/app.module";
import accountModule from "../../../store/modules/account.module";
import clientUserModule from "../../../store/modules/clientUser.module";
import utilsModule from "../../../store/modules/utils.module";
import { baseAPI } from "../../../api";

const Booking = () =>
    import(
        /* webpackChunkName: "components.booking", webpackPreload: true  */ "../../../components/generic/Booking.vue"
    );
const BookingForm = () =>
    import(
        /* webpackChunkName: "components.bookingForm", webpackPreload: true  */ "../../../components/generic/BookingForm.vue"
    );

@Component({
    components: {
        Booking,
        BookingForm,
    },
})
export default class ClientUserProfileModal extends Vue {
    get silentLoading() {
        return appModule.silentLoading;
    }
    get claims() {
        return accountModule.claims;
    }
    get profile_image() {
        return clientUserModule.profile_image;
    }
    set profile_image(value) {
        clientUserModule.setProfileImage(value);
    }
    get name() {
        return clientUserModule.name;
    }
    set name(value) {
        clientUserModule.setName(value);
    }
    get number() {
        return clientUserModule.number;
    }
    set number(value) {
        clientUserModule.setNumber(value);
    }
    get bookings() {
        return clientUserModule.bookings;
    }
    get upcoming() {
        return this.bookings.filter((b) => new Date(b.datetime) > new Date());
    }

    /** Adds a user profile image. */
    handleOpenUpload() {
        try {
            appModule.setDontLeave(true);
            utilsModule.uploadPopUpRef?.open({
                title: "Upload image",
                text: "Please make sure that it's less than 1MB.",
                onSuccess: async (response) => {
                    if (this.profile_image) {
                        await baseAPI.post("/.netlify/functions/delete-image", {
                            file: this.profile_image,
                        });
                    }
                    this.profile_image = response.data.url;
                    clientUserModule.updateClientUser();
                },
            });
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }

    /** Updates the client details. */
    updateClientDetails() {
        try {
            appModule.setSilentLoading(true);
            appModule.setDontLeave(true);
            clientUserModule.updateClientUser();
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }
}
</script>
