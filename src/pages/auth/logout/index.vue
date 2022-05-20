<style lang="scss" scoped>
.logout_message {
    margin-top: 10vh;
    .top {
        display: flex;
        svg {
            margin-right: 2rem;
        }
        .text-container {
            .large_body {
                margin-top: 1rem;
                margin-bottom: 0.4rem;
            }
        }
    }
}
@media (max-width: 768px) {
    .logout_message .top {
        display: grid;
        grid-gap: 2rem;
    }
}
</style>

<template>
    <wrapper id="logout">
        <div class="logout_message">
            <div class="top">
                <icon svg="check" :size="64" />
                <div class="text-container">
                    <txt type="title" main
                        >You have been logged out successfully</txt
                    >
                    <txt type="large-body" bold
                        >You will be redirected automatically</txt
                    >
                    <a href="/" class="grey">
                        <txt>Click here if it takes too long</txt>
                    </a>
                </div>
            </div>
        </div>
    </wrapper>
</template>
