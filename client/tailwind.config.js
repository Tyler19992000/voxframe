/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1A1A2E',
        card: '#16213E',
        accent: '#E94560',
        'accent-hover': '#c73650',
        muted: '#8892b0',
        border: '#2a2a4a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
