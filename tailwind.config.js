module.exports = {
    darkMode: "class",
    purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                fade: {
                    "0%": {
                        opacity: "0%",
                    },
                    "100%": {
                        opacity: "100%",
                    },
                },
            },
            animation: {
                "fade-in": "fade .3s ease-in forwards",
            },
            minHeight: {
                28: "112px",
            },
            borderWidth: {
                3: "3px",
            },
            colors: {
                gray: {
                    100: "#F9F9F9",
                    200: "#28282840",
                    400: "#686868",
                    600: "#484848",
                    800: "#282828",
                },
                red: {
                    700: "#B91C1C",
                },
                green: {
                    700: "#047857",
                },
                skeleton: {
                    "light-fore": "#F2F2F2",
                    "light-back": "#E4E4E4",
                    "dark-fore": "#686868",
                    "dark-back": "#484848",
                },
            },
            maxHeight: {
                "4/5": "80%",
            },
            zIndex: {
                60: 60,
            },
        },
    },
    variants: {
        extend: {
            inset: ["group-hover"],
            display: ["group-hover"],
            translate: ["group-hover"],
        },
    },
    plugins: [],
};
