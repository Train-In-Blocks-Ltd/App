<template>
    <form class="grid gap-4" @submit.prevent="reset">
        <txt-input
            label="Email"
            :value="email"
            :info="success"
            :error="error"
            type="email"
            @output="(data) => (email = data)"
            focus-first
        />
        <default-button type="submit" aria-label="Send recovery email"
            >Send recovery email</default-button
        >
    </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../../store/modules/app.module";
import utilsStore from "../../../../store/modules/utils";
import { baseAPI } from "../../../../api";

@Component
export default class ResetPassword extends Vue {
    email: string = "";
    error: string = "";
    success: string = "";

    async reset() {
        appModule.setDontLeave(true);
        this.error = "";
        this.success = "";
        if (this.email !== "demo@traininblocks.com") {
            try {
                await baseAPI.post("/.netlify/functions/reset-password", {
                    email: this.email,
                });
                this.success = "An email has been sent successfully.";
                this.email = "";
            } catch (e) {
                utilsStore.resolveError(e as string);
                this.error =
                    "An error occurred. Are you sure your email is correct?";
            }
        } else {
            this.error = "You cannot reset the password for the demo account";
        }
        appModule.stopLoaders();
    }
}
</script>
