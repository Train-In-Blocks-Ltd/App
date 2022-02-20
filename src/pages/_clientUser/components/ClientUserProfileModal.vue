<template>
    <div>
        <upload-pop-up />
        <div class="flex flex-col items-center justify-center">
            <div
                v-if="clientUser.profile_image"
                :style="{
                    backgroundImage: `url(${clientUser.profile_image})`,
                }"
                style="filter: grayscale(0.8)"
                class="h-32 w-32 bg-cover bg-center rounded-full mb-8 cursor-pointer hover:opacity-60 transition-opacity"
                @click="
                    () => {
                        $store.dispatch('openUploadPopUp', {
                            title: 'Upload image',
                            text: 'Please make sure that it\'s less than 1MB.',
                        });
                    }
                "
            />
            <icon-button
                v-else
                svg="user"
                class="p-8 rounded-full mb-8 border-3 border-gray-800 dark:border-white cursor-pointer hover:opacity-60 transition-opacity"
                :icon-size="64"
                :on-click="
                    () => {
                        $store.dispatch('openUploadPopUp', {
                            title: 'Upload image',
                            text: 'Please make sure that it\'s less than 1MB.',
                        });
                    }
                "
            />
            <txt-input
                :value="clientUser.name"
                :disabled="silentLoading"
                class="w-full sm:w-2/3 lg:w-1/2 mb-4"
                type="name"
                inputmode="name"
                autocomplete="name"
                placeholder="Name"
                aria-label="Name"
                :on-blur="() => updateClientDetails()"
                @output="(data) => (clientUser.name = data)"
            />
            <txt-input
                :value="clientUser.number"
                :disabled="silentLoading"
                class="w-full sm:w-2/3 lg:w-1/2"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                placeholder="Mobile"
                aria-label="Mobile"
                pattern="\d+"
                :on-blur="() => updateClientDetails()"
                @output="(data) => (clientUser.number = data)"
            />
        </div>
        <div>
            <txt type="large-body" class="mb-4 mt-8" bold>Upcoming</txt>
            <div class="grid xl:grid-cols-2 gap-4">
                <div v-if="upcoming().length !== 0">
                    <booking
                        v-for="(booking, index) in upcoming()"
                        :key="`bookings_${index}`"
                        :booking="booking"
                        :class="{
                            'mb-4': index !== clientUser.bookings.length - 1,
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

<script>
import Compressor from "compressorjs";
import { mapState } from "vuex";

const Booking = () =>
    import(
        /* webpackChunkName: "components.booking", webpackPreload: true  */ "@/components/generic/Booking"
    );
const BookingForm = () =>
    import(
        /* webpackChunkName: "components.bookingForm", webpackPreload: true  */ "@/components/generic/BookingForm"
    );
const UploadPopUp = () =>
    import(
        /* webpackChunkName: "components.uploadPopUp", webpackPrefetch: true  */ "@/components/generic/UploadPopUp"
    );

export default {
    components: {
        Booking,
        BookingForm,
        UploadPopUp,
    },
    computed: mapState(["silentLoading", "claims", "clientUser"]),
    methods: {
        upcoming() {
            return this.clientUser.bookings.filter(
                (booking) => new Date(booking.datetime) > new Date()
            );
        },

        /**
         * Adds a user profile image.
         */
        handleImageSelect() {
            try {
                this.$store.dispatch("setLoading", {
                    dontLeave: true,
                });
                const FILE = document.getElementById("img-uploader").files[0];
                const READER = new FileReader();
                const self = this;
                READER.addEventListener(
                    "load",
                    () => {
                        this.$axios
                            .post("/.netlify/functions/upload-image", {
                                file: READER.result.toString(),
                            })
                            .then(async (response) => {
                                if (this.clientUser.profile_image) {
                                    await this.$axios.post(
                                        "/.netlify/functions/delete-image",
                                        {
                                            file: this.clientUser.profile_image,
                                        }
                                    );
                                }
                                self.$store.dispatch(
                                    "updateClientSideDetails",
                                    {
                                        id: this.claims.client_id_db,
                                        name: this.clientUser.name,
                                        number: this.clientUser.number,
                                        profile_image: response.data.url,
                                    }
                                );
                            });
                    },
                    false
                );
                if (FILE) {
                    if (FILE.size < 1100000) {
                        // eslint-disable-next-line
                        new Compressor(FILE, {
                            quality: 0.6,
                            success(result) {
                                READER.readAsDataURL(result);
                            },
                            error(err) {
                                console.error(err.message);
                            },
                        });
                    } else {
                        this.$store.dispatch("openResponsePopUp", {
                            title: "File size is too big",
                            description: "Please compress it to 1MB or lower",
                            persist: true,
                            backdrop: true,
                        });
                        document.getElementById("img-uploader").value = "";
                    }
                }
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        /**
         * Updates the client details.
         */
        updateClientDetails() {
            try {
                this.$store.dispatch("setLoading", {
                    silentLoading: true,
                    dontLeave: true,
                });
                this.$store.dispatch("updateClientSideDetails", {
                    id: this.claims.client_id_db,
                    name: this.clientUser.name,
                    number: this.clientUser.number,
                    profile_image: this.clientUser.profile_image,
                });
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>
