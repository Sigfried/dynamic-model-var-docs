/** @type {import('tailwindcss').Config} */
export default {
  // the app is currently unreadable in dark mode, this was supposed to help fix it but doesn't
  // darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
