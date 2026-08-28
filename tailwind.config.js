/** @type {import('tailwindcss').Config} */
export default {
  /*
   * NOTE: this file is NOT read. The app is on Tailwind v4 (`@import
   * "tailwindcss"` in src/index.css), which takes its configuration from CSS.
   * A `darkMode: 'class'` here did nothing for exactly that reason — the real
   * switch is the `@custom-variant dark` line in src/index.css. Kept only
   * because the v4 migration left it behind; safe to delete.
   */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
