/** @type {import('tailwindcss').Config} */
// TODO: extend the config in `packages/config/tailwind` instead of copying it
const config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};

module.exports = config;
