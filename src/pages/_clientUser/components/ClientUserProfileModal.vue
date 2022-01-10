<style lang="scss" scoped>
.profile_container {
    .profile_image {
        text-align: center;
        .image {
            margin: auto;
            background-size: cover;
            background-position: center;
            height: 140px;
            width: 140px;
            border-radius: 50%;
            filter: grayscale(0.8);
        }
        .img_icon {
            margin: auto;
            padding: 1.8rem;
            height: 140px;
            width: 140px;
            border: 4px solid var(--base);
            border-radius: 50%;
        }
    }
    .client_user_details {
        display: grid;
        grid-gap: 1rem;
        margin-top: 2rem;
        margin-bottom: 4rem;
        > input {
            margin: auto;
        }
    }

    /* Booking outer container */
    .bookings_container {
        padding: 2rem;
        margin: 2rem 0;

        /* Booking inner container */
        .bookings_sub_container {
            display: grid;
            grid-template-columns: 1fr 0.9fr;
            grid-gap: 1.6rem;
            margin-top: 1rem;

            /* Container for creating bookings */
            .request_booking_container {
                display: flex;
                flex-direction: column;
                *:not(:last-child) {
                    margin-bottom: 1rem;
                }
            }

            /* Container for booking events */
            .bookings_wrapper {
                &::-webkit-scrollbar {
                    width: 6px;
                }
            }
        }
    }
}

/* Booking event */
.booking {
    display: grid;
    grid-gap: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--base_faint);
    padding-bottom: 1rem;
    height: fit-content;
    &.past {
        opacity: var(--light_opacity);
    }
    .details {
        display: grid;
        grid-gap: 0.6rem;
    }
    .status {
        display: flex;
        justify-content: space-between;
        > p:first-child {
            font-weight: bold;
        }
        > a {
            color: var(--base_red);
        }
    }
}

@media (max-width: 576px) {
    .profile_container {
        .bookings_container {
            padding: 1rem;
            .bookings_sub_container {
                display: block;
                .request_booking_container {
                    margin-top: 2rem;
                }
            }
        }
    }
}
</style>

<template>
    <div class="profile_container">
        <div class="flex flex-col items-center justify-center">
            <div
                v-if="clientUser.profile_image"
                :style="{
                    backgroundImage: `url(${clientUser.profile_image})`,
                }"
                style="filter: grayscale(0.8)"
                class="h-32 w-32 bg-cover bg-center rounded-full mb-8"
                @click="
                    $refs.input_pop_up.show(
                        'image',
                        'Select your image to upload',
                        'Make sure that it\'s less than 1MB'
                    )
                "
            />
            <inline-svg
                v-else
                :src="require('@/assets/svg/profile-image.svg')"
                class="h-32 w-32 bg-cover bg-center rounded-full mb-8 border-3 border-gray-800"
                @click="
                    $refs.input_pop_up.show(
                        'image',
                        'Select your image to upload',
                        'Make sure that it\'s less than 1MB'
                    )
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
            <div class="flex flex-col xl:flex-row">
                <div
                    v-if="clientUser.bookings.length !== 0"
                    class="mb-4 xl:mt-0 xl:w-1/2 xl:mr-8"
                >
                    <booking
                        v-for="(booking, bookingIndex) in clientUser.bookings"
                        :key="`bookings_${bookingIndex}`"
                        :booking="booking"
                    />
                </div>
                <txt v-else grey>No bookings yet</txt>
                <form
                    class="xl:w-1/2 grid gap-4"
                    @submit.prevent="createBooking()"
                >
                    <txt-input
                        :value="bookingForm.date"
                        :min="today()"
                        type="date"
                        placeholder="Date"
                        aria-label="Date"
                        @output="
                            (data) => {
                                bookingForm.date = data;
                                checkForm();
                            }
                        "
                        required
                    />
                    <txt-input
                        :value="bookingForm.time"
                        :min="bookingForm.date === today() ? timeNow() : null"
                        class="small_border_radius"
                        type="time"
                        placeholder="Time"
                        aria-label="Time"
                        @output="
                            (data) => {
                                bookingForm.time = data;
                                checkForm();
                            }
                        "
                        required
                    />
                    <txt-area
                        :value="bookingForm.notes"
                        class="additional_notes small_border_radius"
                        rows="5"
                        placeholder="Additional information"
                        aria-label="Additional information"
                        @output="
                            (data) => {
                                bookingForm.notes = data;
                                checkForm();
                            }
                        "
                        required
                    />
                    <default-button
                        type="submit"
                        :is-disabled="disableCreateBookingButton"
                    >
                        Request a booking
                    </default-button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Compressor from "compressorjs";
import { mapState } from "vuex";

const Booking = () =>
    import(
        /* webpackChunkName: "components.booking", webpackPreload: true  */ "@/pages/_clientUser/components/Booking"
    );

export default {
    components: {
        Booking,
    },
    data() {
        return {
            bookingForm: {
                date: this.today(),
                time: this.timeNow(),
                notes: null,
            },
            disableCreateBookingButton: true,
        };
    },
    computed: mapState(["loading", "silentLoading", "claims", "clientUser"]),
    methods: {
        checkForm() {
            this.disableCreateBookingButton = !(
                this.bookingForm.date &&
                this.bookingForm.time &&
                this.bookingForm.notes
            );
        },

        /**
         * Adds a user profile image.
         */
        addImg() {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                const FILE = document.getElementById("img_uploader").files[0];
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
                        document.getElementById("img_uploader").value = "";
                    }
                }
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.$parent.resolveError(e);
            }
        },

        /**
         * Updates the client details.
         */
        updateClientDetails() {
            try {
                this.$store.commit("setData", {
                    attr: "silentLoading",
                    data: true,
                });
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                this.$store.dispatch("updateClientSideDetails", {
                    id: this.claims.client_id_db,
                    name: this.clientUser.name,
                    number: this.clientUser.number,
                    profile_image: this.clientUser.profile_image,
                });
            } catch (e) {
                this.$parent.$parent.resolveError(e);
            }
        },

        /**
         * Opens a new booking request.
         */
        async createBooking() {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                await this.$store.dispatch("createBooking", {
                    clientId: this.claims.client_id_db,
                    datetime:
                        this.bookingForm.date + " " + this.bookingForm.time,
                    notes: this.bookingForm.notes,
                    status: "Pending",
                    isTrainer: false,
                });
                this.bookingForm = {
                    date: this.today(),
                    time: this.timeNow(),
                    notes: null,
                };
                this.$store.dispatch("openResponsePopUp", {
                    title: "Booking requested",
                    description: "Your trainer will be notified",
                });
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.$parent.resolveError(e);
            }
        },
    },
};
</script>
