<template>
    <form
        name="add_client"
        class="grid gap-4 mt-8"
        spellcheck="false"
        @submit.prevent="createClient"
    >
        <txt-input
            type="text"
            autocomplete="name"
            placeholder="Name*"
            aria-label="Name"
            :value="newClient.name"
            :on-input="checkForm()"
            @output="(data) => (newClient.name = data)"
            focusFirst
            required
        />
        <txt-input
            type="text"
            autocomplete="email"
            placeholder="Email*"
            aria-label="Email"
            :value="newClient.email"
            :on-input="checkForm()"
            @output="(data) => (newClient.email = data)"
            required
        />
        <txt-input
            type="text"
            autocomplete="email"
            placeholder="Confirm email*"
            aria-label="Confirm email"
            :value="newClient.confirm"
            :error="
                newClient.email !== newClient.confirm
                    ? 'Email does\'t match'
                    : ''
            "
            :on-input="checkForm()"
            @output="(data) => (newClient.confirm = data)"
            required
        />
        <txt-input
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            placeholder="Mobile"
            aria-label="Mobile"
            pattern="\d+"
            :value="newClient.number"
            :on-input="checkForm()"
            @output="(data) => (newClient.number = data)"
        />
        <default-button
            :is-disabled="
                disableCreateClientButton ||
                newClient.email === '' ||
                newClient.email !== newClient.confirm
            "
            type="submit"
            aria-label="Save"
        >
            Save
        </default-button>
    </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import accountStore from "../../../../store/modules/account";
import appState from "../../../../store/modules/appState";
import utilsStore from "../../../../store/modules/utils";
import clientsStore from "../../../../store/modules/clients";

@Component
export default class NewClientModal extends Vue {
    newClient = {
        name: "",
        email: "",
        confirm: "",
        number: "",
        notes: "",
    };
    disableCreateClientButton: boolean = true;

    get claims() {
        return accountStore.claims;
    }

    checkForm() {
        this.disableCreateClientButton = !(
            this.newClient.name &&
            this.newClient.email &&
            this.newClient.confirm
        );
    }

    createClient() {
        if (this.newClient.email === this.claims?.email) {
            utilsStore.responsePopUpRef?.open({
                title: "You cannot create a client with your own email address!",
                text: "Please use a different one.",
                persist: true,
                backdrop: true,
            });
        } else {
            try {
                appState.setDontLeave(true);
                clientsStore.createClient({
                    pt_id: this.claims?.sub ?? "",
                    name: this.newClient.name,
                    email: this.newClient.email,
                    number: this.newClient.number,
                });
                utilsStore.responsePopUpRef?.open({
                    title: `Added ${this.newClient.name}`,
                    text: "Well done on getting a new client",
                });
                // @ts-expect-error
                this.$parent.persistResponse = this.newClient.name;
                this.newClient = {
                    name: "",
                    email: "",
                    confirm: "",
                    number: "",
                    notes: "",
                };
                this.$ga.event("Client", "new");
                appState.stopLoaders();
                appState.stopLoaders();
            } catch (e) {
                utilsStore.resolveError(e as string);
            }
        }
        utilsStore.closeModal();
    }
}
</script>
