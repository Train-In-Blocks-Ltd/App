module.exports = {
    darkMode: "class",
    purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
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
    plugins: [],
};
