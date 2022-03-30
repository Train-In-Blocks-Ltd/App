<template>
    <form @submit.prevent="changePassword()" class="mt-4">
        <txt-input
            ref="pass"
            :value="password.old"
            type="password"
            placeholder="Current password"
            aria-label="Current password"
            @output="
                (data) => {
                    password.old = data;
                    checkForm();
                }
            "
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
            :value="password.new"
            type="password"
            placeholder="New password"
            aria-label="New password"
            :class="{ check: password.check }"
            @output="
                (data) => {
                    password.new = data;
                    checkPassword();
                    checkForm();
                }
            "
            required
        />
        <txt-input
            :value="password.match"
            type="password"
            placeholder="Confirm new password"
            aria-label="Confirm new password"
            :class="{ check: password.new !== password.match }"
            class="my-4"
            @output="
                (data) => {
                    password.match = data;
                    checkPassword();
                    checkForm();
                }
            "
            :error="password.error"
            required
        />
        <default-button
            type="submit"
            :disabled="
                disableChangePasswordButton ||
                password.check ||
                password.new !== password.match
            "
            class="mr-4"
        >
            Change your password
        </default-button>
    </form>
</template>

<script>
export default {
    data() {
        return {
            password: {
                old: null,
                new: null,
                match: null,
                check: null,
                error: null,
            },
            disableChangePasswordButton: true,
        };
    },
    methods: {
        checkForm() {
            this.disableChangePasswordButton = !(
                this.password.old &&
                this.password.new &&
                this.password.match &&
                !this.password.check &&
                !this.password.error
            );
        },

        /**
         * Validates the password.
         */
        checkPassword() {
            const SELF = this;
            function requirements() {
                return (
                    SELF.password.new.match(/[0-9]+/) !== null &&
                    SELF.password.new.length >= 8 &&
                    SELF.password.old.length >= 1
                );
            }
            if (requirements() === false) {
                this.password.check = true;
                this.password.error = "Please check the requirements";
            } else if (this.password.new !== this.password.match) {
                this.password.check = true;
                this.password.error = "New password does not match";
            } else {
                this.password.check = false;
                this.password.error = "";
            }
        },

        /**
         * Changes the password.
         */
        async changePassword() {
            try {
                this.$store.dispatch("setLoading", {
                    dontLeave: true,
                });
                this.password.error = "";
                await this.$store.dispatch("changePassword", {
                    old: this.password.old,
                    new: this.password.new,
                });
                this.$store.dispatch("openResponsePopUp", {
                    title: "Password changed",
                    description: "Remember to not share it and keep it safe",
                });
                this.showPasswordReset = false;
                this.willBodyScroll(true);
                this.password = {
                    old: null,
                    new: null,
                    match: null,
                    check: null,
                    error: null,
                };
                this.$store.dispatch("setLoading", false);
            } catch (e) {
                this.password.error =
                    "Something went wrong. Please make sure that your password is correct and the new password fulfils the requirements";
            }
        },
    },
};
</script>
