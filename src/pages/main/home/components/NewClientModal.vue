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
            :value="name"
            @output="(data) => (name = data)"
            focusFirst
            required
        />
        <txt-input
            type="text"
            autocomplete="email"
            placeholder="Email*"
            aria-label="Email"
            :value="email"
            @output="(data) => (email = data)"
            required
        />
        <txt-input
            type="text"
            autocomplete="email"
            placeholder="Confirm email*"
            aria-label="Confirm email"
            :value="confirm"
            :error="
                !validEmail && email !== ''
                    ? 'Invalid email'
                    : email !== confirm
                    ? 'Email does\'t match'
                    : emailAlreadyUsed
                    ? 'A client is already using this email, please use another one.'
                    : ''
            "
            @output="(data) => (confirm = data)"
            required
        />
        <txt-input
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            placeholder="Mobile"
            aria-label="Mobile"
            pattern="\d+"
            :value="number"
            @output="(data) => (number = data)"
        />
        <default-button
            type="submit"
            aria-label="Save"
            :is-disabled="!valid || !validEmail || emailAlreadyUsed"
        >
            Save
        </default-button>
    </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import accountModule from "../../../../store/account.module";
import appModule from "../../../../store/app.module";
import utilsModule from "../../../../store/utils.module";
import clientsModule from "../../../../store/clients.module";
import { EMAIL_REGEX } from "../../../../common/helpers";

@Component
export default class NewClientModal extends Vue {
    name: string = "";
    email: string = "";
    confirm: string = "";
    number: string = "";
    notes: string = "";

    get claims() {
        return accountModule.claims;
    }
    get valid() {
        return (
            !!this.name &&
            !!this.email &&
            !!this.confirm &&
            this.email === this.confirm
        );
    }
    get validEmail() {
        return this.email.match(EMAIL_REGEX);
    }
    get emailAlreadyUsed() {
        const existingEmails = clientsModule.clients
            .map((c) => c.email)
            .join("|");
        return !!new RegExp(existingEmails, "i").test(this.email);
    }

    createClient() {
        if (this.email === this.claims?.email) {
            utilsModule.responsePopUpRef?.open({
                title: "You cannot create a client with your own email address!",
                text: "Please use a different one.",
                persist: true,
                backdrop: true,
            });
        } else {
            try {
                appModule.setDontLeave(true);
                clientsModule.createClient({
                    pt_id: this.claims?.sub ?? "",
                    name: this.name,
                    email: this.email,
                    number: this.number,
                });
                utilsModule.responsePopUpRef?.open({
                    title: `Added ${this.name}`,
                    text: "Well done on getting a new client",
                });
                this.name = "";
                this.email = "";
                this.confirm = "";
                this.number = "";
                this.notes = "";
                this.$ga.event("Client", "new");
                appModule.stopLoaders();
                appModule.stopLoaders();
            } catch (e) {
                utilsModule.resolveError(e as string);
            }
        }
        utilsModule.closeModal();
    }
}
</script>
