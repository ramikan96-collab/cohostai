/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './app.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE8',
        'primary-dark': '#4840CC',
        'primary-light': '#EEF0FF',
        bg: '#F5F6FA',
        card: '#FFFFFF',
        border: '#E2E8F0',
        muted: '#64748B',
        'text-main': '#0F172A',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    }
  },
  plugins: []
}
