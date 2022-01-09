module.exports = {
    darkMode: "class",
    purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            borderWidth: {
                3: "3px",
            },
            colors: {
                gray: {
                    100: "#F9F9F9",
                    200: "#686868",
                    800: "#282828",
                },
            },
        },
    },
    plugins: [],
};