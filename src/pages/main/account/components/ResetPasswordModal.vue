<template>
    <form @submit.prevent="changePassword" class="mt-4">
        <txt-input
            ref="pass"
            :value="old"
            type="password"
            placeholder="Current password"
            aria-label="Current password"
            @output="(data) => (old = data)"
            required
            focus-first
        />
        <div class="my-4">
            <txt bold>Requirements</txt>
            <txt grey>Number (0-9)</txt>
            <txt grey>At least 8 characters</txt>
            <txt grey>Can't contain your username</txt>
        </div>
        <txt-input
            :value="newP"
            type="password"
            placeholder="New password"
            aria-label="New password"
            @output="(data) => (newP = data)"
            required
        />
        <txt-input
            :value="confirm"
            type="password"
            placeholder="Confirm new password"
            aria-label="Confirm new password"
            class="my-4"
            @output="(data) => (confirm = data)"
            :error="error"
            required
        />
        <default-button
            type="submit"
            :is-disabled="!valid"
            class="mr-4"
            aria-label="Change your password"
        >
            Change your password
        </default-button>
    </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../../store/modules/app.module";
import utilsStore from "../../../../store/modules/utils";

@Component
export default class ResetPasswordModal extends Vue {
    old: string = "";
    newP: string = "";
    confirm: string = "";
    error: string | null = "";

    /** Validates the password. */
    get valid() {
        const valid =
            !!this.newP.match(/[0-9]+/) &&
            this.newP.length >= 8 &&
            this.old.length >= 1;

        if (!valid) {
            this.error = "Please check the requirements";
        } else if (this.newP !== this.confirm) {
            this.error = "New password does not match";
        } else {
            this.error = "";
        }

        return (
            valid && !!this.old && !!this.newP && !!this.confirm && !this.error
        );
    }

    /** Changes the password. */
    async changePassword() {
        try {
            appModule.setDontLeave(true);
            this.error = "";
            utilsStore.responsePopUpRef?.open({
                title: "Password changed",
                text: "Remember to not share it and keep it safe",
            });
            this.old = "";
            this.newP = "";
            this.confirm = "";
            appModule.stopLoaders();
        } catch (e) {
            utilsStore.resolveError(e as string);
            this.error =
                "Something went wrong. Please make sure that your password is correct and the new password fulfils the requirements";
        }
    }
}
</script>
