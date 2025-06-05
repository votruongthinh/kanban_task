/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#635FC7",
        secondary: "#A8A4FF",
        darkBg: "#20212C",
        lightBg: "#F4F7FD",
        darkCard: "#2B2C37",
        lightCard: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
