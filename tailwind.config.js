/** @type {import('tailwindcss').Config} */
export default {
    content: ["./react-app/src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: "var(--color-primary-light)",
                    DEFAULT: "var(--color-primary)",
                    dark: "var(--color-primary-dark)",
                },
            },
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1636px",
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: "1rem",
                    xl: "2rem",
                    "2xl": "4rem",
                },
            },
        },
    },
};
