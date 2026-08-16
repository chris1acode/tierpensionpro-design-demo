/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#df6420',
        'primary-dark': '#b94b12',
        'primary-button': '#d25938',
        'primary-button-hover': '#be4524',
        'primary-button-border': '#aa3110',
        'primary-button-text': '#fff',
        petrol: '#2f5d62',
        app: {
          bg: '#f7f6f3',
          surface: '#fff',
          text: '#24211f',
          muted: '#6d6762',
          border: '#ded9d3',
        },
      },
    },
  },
  plugins: [],
}
