/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#701a40",
          dark: "#2d0a1a",
        },
        gold: {
          DEFAULT: "#f5b041",
          dark: "#ffab25",
        },
      },
    },
  },
  plugins: [],
};
