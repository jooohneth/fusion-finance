/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9569EC",
        secondary: "#03D394",
        primaryBg: "#0B0A1D",
      },
    },
  },
  plugins: [],
};
