/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          1: '#1C1F2E',
          2: '#161925',
          3: '#252A41',
          4: '#1E2757',
        }
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          background: '#fefefe',
          danger: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            DEFAULT: '#dc2626'
          },
          primary: {
            50: "#ffefdf",
            100: "#f9d5b8",
            200: "#f0bb8e",
            300: "#e99f63",
            400: "#e18438",
            500: "#c76a1e",
            600: "#9c5315",
            700: "#703a0e",
            800: "#442204",
            900: "#1c0a00",
            DEFAULT: "#e18438",
            foreground: "#ffffff",
          },
          focus: "#e99f63",
        }
      }
    }
  })],
};
