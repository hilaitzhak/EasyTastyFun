/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Cozy Pantry design system ──────────────────────────────
      colors: {
        // Page & surfaces — warm cream
        paper: '#FBF7F0',     // page background (cream)
        line: '#EBE3D8',      // hairline borders / dividers
        // surface kept as an object so both `bg-surface` (cards) and the
        // remote's `surface-muted` / `surface-warm` utilities keep working
        surface: {
          DEFAULT: '#FFFDF9', // cards / panels (warm white)
          muted:   '#fef3e2',
          warm:    '#fde8c8',
        },
        // Text — warm browns, not cold grays
        ink: {
          DEFAULT: '#3D3833', // primary text / headings
          soft: '#6F665C',    // secondary text
          muted: '#A39A8C',   // captions / meta
        },
        // Primary accent — terracotta
        terracotta: {
          light: '#F6E7DF',
          DEFAULT: '#C97B5A',
          dark: '#A85F40',
        },
        // Secondary accent — olive
        olive: {
          light: '#EEF0E6',
          DEFAULT: '#7C8B5B',
          dark: '#61703F',
        },
        // Warm highlight — butter
        butter: {
          light: '#FCF1CF',
          DEFAULT: '#F4D35E',
        },
        // Legacy tokens retained so components from origin/master stay styled
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
      },
      fontFamily: {
        // Friendly rounded display (EN: Quicksand, HE: Rubik)
        display: ['Quicksand', 'Rubik', 'system-ui', 'sans-serif'],
        // Warm readable body (EN: Nunito, HE: Rubik)
        sans: ['Nunito', 'Rubik', 'system-ui', '-apple-system', 'sans-serif'],
        // Retained from origin/master
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        // Soft, warm, cozy float
        soft: '0 2px 8px -2px rgba(61, 56, 51, 0.08)',
        card: '0 12px 32px -16px rgba(168, 95, 64, 0.28)',
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
      transitionProperty: {
        'height': 'height',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
