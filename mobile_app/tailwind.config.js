/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        // main: "white",
        // navi: "rgb(10, 12, 25)",
        // rgb(239, 243, 246) // search bg  rgb(229, 231, 235) rgb(243, 244, 246)
        // rgb(234, 236, 249) // home bg
        // rgb(236, 240, 243) // space bg
      },
    },
  },
  plugins: [],
};
