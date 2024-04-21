/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            'primary' : '#1071e5',
            'gray-default': '#808080',
            'verdigris': '#64B6AC',
            'snow': '#FFFBFE',
        },
        backgroundImage: {
            'BKbg' : "url('/static/BKbg.jpeg')",
            'Loginbg' : "url('/static/Loginbg.jpg')",
            'user' : "url(http://surl.li/rqbtb)",
        },
        spacing: {
            '112': '28rem',
            '128': '32rem',
            '144': '36rem',
            '160': '40rem',
            '176': '44rem',
        },
        gridTemplateColumns: {
            '14': 'repeat(14, minmax(0, 1fr))',
            '16': 'repeat(16, minmax(0, 1fr))',
        }
      },
    },
    plugins: [],
  }