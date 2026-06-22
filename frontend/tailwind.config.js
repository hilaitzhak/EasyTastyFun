/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Cozy Pantry design system ──────────────────────────────
      // Tokens are CSS variables (RGB triplets) so a `.dark` class can swap the
      // whole palette without touching components. Alpha utilities (bg-paper/90)
      // keep working through the <alpha-value> placeholder.
      colors: {
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--c-surface) / <alpha-value>)',
          muted:   'rgb(var(--c-surface-muted) / <alpha-value>)',
          warm:    'rgb(var(--c-surface-warm) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          soft: 'rgb(var(--c-ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--c-ink-muted) / <alpha-value>)',
        },
        terracotta: {
          light: 'rgb(var(--c-terracotta-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--c-terracotta) / <alpha-value>)',
          dark: 'rgb(var(--c-terracotta-dark) / <alpha-value>)',
        },
        olive: {
          light: 'rgb(var(--c-olive-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--c-olive) / <alpha-value>)',
          dark: 'rgb(var(--c-olive-dark) / <alpha-value>)',
        },
        butter: {
          light: 'rgb(var(--c-butter-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--c-butter) / <alpha-value>)',
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
