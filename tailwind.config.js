/** @type {import('tailwindcss').Config} */
module.exports = {
  // Adicionamos a pasta app/ aqui:
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}