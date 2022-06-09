<style lang="scss" scoped>
#splash {
    height: 100%;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: space-around;
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    .box {
        position: relative;
        top: calc(50% - 8rem);
        border: 0.25rem solid #282828;
        border-radius: 3px;
        height: 8rem;
        width: 8rem;
        outline: 0;
        overflow: hidden;
        background-color: #282828;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: flashing 1s ease-in-out alternate-reverse infinite;
        &:after {
            content: "";
            position: absolute;
            background: white;
            height: 16rem;
            width: 16rem;
            bottom: -50%;
            left: -50%;
            border-radius: 40%;
            animation: spin 5s forwards;
        }
        .logo_svg {
            height: 50%;
            width: auto;
            path {
                fill: white;
            }
        }
    }
}

@keyframes spin {
    0% {
        transform: translateY(0) rotate(0deg);
    }
    100% {
        transform: translateY(-100%) rotate(500deg);
    }
}
@keyframes flashing {
    0% {
        opacity: 0.6;
    }
    100% {
        opacity: 1;
    }
}
</style>

<template>
    <div id="splash">
        <div class="box">
            <svg
                class="logo_svg"
                width="38"
                height="38"
                viewBox="0 0 38 38"
                version="1.1"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="Icon">
                    <path
                        id="Rectangle"
                        d="M0 0L38 0L38 15L15 15L15 38L0 38L0 0Z"
                        fill="#282828"
                        stroke="none"
                    />
                    <path
                        id="Rectangle-2"
                        d="M0 0L14 0L14 14L0 14L0 0Z"
                        transform="translate(24 24)"
                        fill="#282828"
                        stroke="none"
                    />
                </g>
            </svg>
        </div>
    </div>
</template>
