/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        migo: {
          verde: '#D4E9E2',
          naranja: '#FFEDD5',
          azul: '#DBEAFE',
          rosa: '#FCE7F3',
          oscuro: '#1E293B',
        },
      },
    },
  },
  plugins: [],
}