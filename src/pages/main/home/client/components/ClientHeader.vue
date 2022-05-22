<template>
    <div class="grid w-full md:w-2/3 m-auto">
        <div
            v-if="clientDetails.profile_image"
            :style="{ backgroundImage: `url(${clientDetails.profile_image})` }"
            class="m-auto bg-cover bg-center rounded-full h-36 w-36"
            style="filter: grayscale(0.8)"
        />
        <icon
            v-else
            svg="user"
            :size="144"
            class="m-auto p-8 border-3 border-gray-800 dark:border-white rounded-full"
        />
        <txt-input
            type="text"
            aria-label="Client name"
            autocomplete="name"
            :value="clientDetails.name"
            :disabled="silentLoading"
            :on-blur="() => updateClient()"
            @output="(data) => (clientDetails.name = data)"
            class="mt-12"
        />
        <txt-input
            placeholder="Mobile"
            aria-label="Mobile"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            pattern="\d+"
            class="my-4"
            :min-length="9"
            :max-length="14"
            :value="clientDetails.number"
            :disabled="silentLoading"
            :on-blur="() => updateClient()"
            @output="(data) => (clientDetails.number = data)"
        />
        <div class="flex items-center mb-4">
            <icon svg="mail" :size="22" class="mr-2" />
            <txt>
                {{ clientDetails.email }}
            </txt>
        </div>
        <div class="flex justify-between">
            <default-button
                v-if="clientAlreadyMsg === 'Restricted'"
                :is-disabled="clientAlready"
                :on-click="() => giveAccess()"
                :aria-label="clientAlreadyMsg"
            >
                {{ clientAlreadyMsg }}
            </default-button>
            <default-button
                v-else-if="
                    clientAlready &&
                    clientAlreadyMsg !== 'Loading...' &&
                    clientAlreadyMsg !== 'Error'
                "
                :on-click="
                    () => {
                        clientDetails.notifications =
                            clientDetails.notifications === 1 ? 0 : 1;
                        updateClient();
                    }
                "
                aria-label="Email notification"
            >
                {{ clientDetails.notifications === 1 ? "Disable" : "Enable" }}
                email notifications
            </default-button>
            <default-button
                v-else
                :is-disabled="clientAlready"
                :on-click="() => giveAccess()"
                :aria-label="clientAlreadyMsg"
            >
                {{ clientAlreadyMsg }}
            </default-button>
            <div class="flex">
                <icon-button
                    svg="divide-square"
                    :on-click="handleOpenToolkit"
                    :size="32"
                    class="mr-4"
                    aria-label="Toolkit"
                    title="Toolkit"
                />
                <icon-button
                    v-if="!isDemo"
                    svg="archive"
                    class="ml-4"
                    :on-click="archiveClient"
                    :size="32"
                    aria-label="Archive client"
                    title="Archive client"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../../../store/modules/app.module";
import clientModule from "../../../../../store/modules/client.module.";
import clientsStore from "../../../../../store/modules/clients";
import accountModule from "../../../../../store/modules/account.module";
import utilsStore from "../../../../../store/modules/utils";
import { baseAPI } from "../../../../../api";

const emailBuilder = require("../../../../../components/js/email");
const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("../../../../../../config/prod.env")
        : require("../../../../../../config/dev.env");

@Component
export default class ClientHeader extends Vue {
    clientAlreadyMsg: string = "Loading...";
    clientAlready: boolean = true;
    clientSuspend: string | null = null;

    get clientDetails() {
        return clientModule.clientDetails;
    }
    set clientDetails(value) {
        clientModule.setClientDetails(value);
    }
    get silentLoading() {
        return appModule.silentLoading;
    }
    get isDemo() {
        return appModule.isDemo;
    }
    get claims() {
        return accountModule.claims;
    }

    mounted() {
        this.checkClient();
    }

    /** Opens toolkit. */
    handleOpenToolkit() {
        utilsStore.openModal({
            name: "toolkit",
        });
    }

    /** Updates the client. */
    async updateClient() {
        try {
            appModule.setSilentLoading(true);
            appModule.setDontLeave(true);
            await clientModule.updateClient();
            appModule.stopLoaders();
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }

    /** Gives access to the client user. */
    async giveAccess() {
        appModule.setDontLeave(true);
        try {
            if (this.clientAlreadyMsg === "Resend activation email") {
                const OKTA_ONE = await baseAPI.post(
                    "/.netlify/functions/okta",
                    {
                        type: "GET",
                        url: `?filter=profile.email+eq+"${this.clientDetails?.email}"&limit=1`,
                    }
                );
                const OKTA_TWO = await baseAPI.post(
                    "/.netlify/functions/okta",
                    {
                        type: "POST",
                        body: {},
                        url: `${OKTA_ONE.data[0].id}/lifecycle/reactivate?sendEmail=false`,
                    }
                );
                await baseAPI.post("/.netlify/functions/send-email", {
                    to: this.clientDetails?.email,
                    ...emailBuilder("activate-account", {
                        link: OKTA_TWO.data.activationUrl.replace(
                            CUSTOM_ENV.OKTA.ISSUER,
                            "https://auth.traininblocks.com"
                        ),
                    }),
                });
            } else if (this.clientSuspend) {
                await baseAPI.post("/.netlify/functions/okta", {
                    type: "POST",
                    body: {},
                    url: `${this.clientSuspend}/lifecycle/unsuspend`,
                });
                const PASSWORD = await baseAPI.post(
                    "/.netlify/functions/okta",
                    {
                        type: "POST",
                        body: {},
                        url: `${this.clientSuspend}/lifecycle/reset_password?sendEmail=false`,
                    }
                );
                await baseAPI.post("/.netlify/functions/send-email", {
                    to: this.clientDetails?.email,
                    ...emailBuilder("client-account-reactivated", {
                        link: PASSWORD.data.resetPasswordUrl.replace(
                            CUSTOM_ENV.OKTA.ISSUER,
                            "https://auth.traininblocks.com"
                        ),
                    }),
                });
            } else {
                const OKTA_ONE = await baseAPI.post(
                    "/.netlify/functions/okta",
                    {
                        type: "POST",
                        body: {
                            profile: {
                                firstName: this.clientDetails?.email,
                                email: this.clientDetails?.email,
                                login: this.clientDetails?.email,
                                ga: true,
                                client_id_db: this.clientDetails?.client_id,
                                user_type: "Client",
                            },
                            groupIds: ["00gf929legrtSjxOe4x6"],
                        },
                        url: "?activate=false",
                    }
                );
                const OKTA_TWO = await baseAPI.post(
                    "/.netlify/functions/okta",
                    {
                        type: "POST",
                        body: {},
                        url: `${OKTA_ONE.data.id}/lifecycle/activate?sendEmail=false`,
                    }
                );
                await baseAPI.post("/.netlify/functions/send-email", {
                    to: this.clientDetails?.email,
                    ...emailBuilder("activate-account", {
                        link: OKTA_TWO.data.activationUrl.replace(
                            CUSTOM_ENV.OKTA.ISSUER,
                            "https://auth.traininblocks.com"
                        ),
                    }),
                });
            }
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
        await this.checkClient();
        utilsStore.responsePopUpRef?.open({
            title: "An activation email was sent to your client",
            text: "Please ask them to check their inbox",
            persist: true,
            backdrop: true,
        });
        appModule.stopLoaders();
    }

    /** Checks if the client already exists on Okta. */
    async checkClient() {
        if (this.claims?.email !== "demo@traininblocks.com") {
            this.clientAlreadyMsg = "Loading...";
            try {
                const RESULT = await baseAPI.post("/.netlify/functions/okta", {
                    type: "GET",
                    url: `?filter=profile.email+eq+"${this.clientDetails?.email}"&limit=1`,
                });
                if (RESULT.data.length > 0) {
                    switch (RESULT.data[0].status) {
                        case "ACTIVE":
                            this.clientAlready = true;
                            this.clientAlreadyMsg = "User activated";
                            break;
                        case "PROVISIONED":
                        case "RECOVERY":
                            this.clientAlready = false;
                            this.clientAlreadyMsg = "Resend activation email";
                            break;
                        case "SUSPENDED":
                            this.clientSuspend = RESULT.data[0].id;
                            this.clientAlready = false;
                            this.clientAlreadyMsg = "Give Access";
                            break;
                    }
                } else {
                    this.clientAlready = false;
                    this.clientAlreadyMsg = "Give Access";
                }
            } catch (e) {
                this.clientAlready = true;
                this.clientAlreadyMsg = "Error";
                utilsStore.resolveError(e as string);
            }
        } else {
            this.clientAlreadyMsg = "Restricted";
        }
    }

    /** Archives the client. */
    async archiveClient() {
        if (
            (await utilsStore.confirmPopUpRef?.open({
                title: "Are you sure that you want to archive/hide this client?",
                text: "Their data will be stored, but it will be removed if deleted from the Archive.",
            })) &&
            this.clientDetails
        ) {
            try {
                const { client_id: id, email } = this.clientDetails;
                appModule.setDontLeave(true);
                await clientsStore.archiveClient(id, email);
                this.$ga.event("Client", "archive");
                utilsStore.responsePopUpRef?.open({
                    title: "Client archived",
                    text: "Their data will be kept safe on the archive page",
                });
                appModule.stopLoaders();
                this.$router.push("/");
            } catch (e) {
                utilsStore.resolveError(e as string);
            }
        }
    }
}
</script>
