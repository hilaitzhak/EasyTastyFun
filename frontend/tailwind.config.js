/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff8f2',
          100: '#ffe8d0',
          200: '#ffc896',
          300: '#ffa05e',
          400: '#f97316',
          500: '#ea6c1a',
          600: '#c2500d',
          700: '#9a3b09',
          800: '#7c2d08',
          900: '#621f06',
        },
        accent: {
          50:  '#fff1f4',
          100: '#ffe0e6',
          200: '#ffc0cb',
          300: '#ff8fa0',
          400: '#f96680',
          500: '#f43f5e',
          600: '#d62a4a',
        },
        surface: {
          DEFAULT: '#fffbf7',
          muted:   '#fef3e2',
          warm:    '#fde8c8',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionProperty: {
        height: 'height',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
