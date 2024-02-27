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
            'BKbg' : "url('/src/images/BKbg.jpeg')",
            'Loginbg' : "url('/src/images/Loginbg.jpg')",
            'usericon' : "url('/src/images/usericon.png')",
          }
      },
    },
    plugins: [],
  }