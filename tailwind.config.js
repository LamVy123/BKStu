/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            'primary' : '#1071e5',
        },
        backgroundImage: {
            'BKbg' : "url('/static/BKbg.jpeg')",
            'Loginbg' : "url('/static/Loginbg.jpg')",
        },
        spacing: {
            '112': '28rem',
            '128': '32rem',
            '144': '36rem',
            '160': '40rem',
            '176': '44rem',
          }
      },
    },
    plugins: [],
  }