/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        upla: {
          50: "#EAF3FB",
          100: "#D3E6F5",
          200: "#A0C6E2",
          300: "#4D93C8",
          500: "#0065B1",
          600: "#00589B",
          700: "#004A83",
          800: "#003A68",
          900: "#002B4E",
        },
        campo: "#7C8AA0",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
