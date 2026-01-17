

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                secondary: {
                    50: "#e6efff",
                    100: "#c3d8fe",
                    200: "#a0c1fd",
                    300: "#7daafc",
                    400: "#5a93fc",
                    500: "#377cfb",
                    600: "#2d66cf",
                    700: "#2451a3",
                    800: "#1a3b77",
                    900: "#11254b",
                    foreground: "#000",
                    DEFAULT: "#377cfb"
                }
            }
        },
    },
    darkMode: "class",
    plugins: []
}
