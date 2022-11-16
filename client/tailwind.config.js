/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'nerko': ["nerko", "sans-serif"]
    },
    extend: {
      backgroundImage: {
        'base-img': "url('./assets/bg.png')",
        'game-status': "url('./assets/game_status.png')",
      }
    },
  },
  plugins: [],
}