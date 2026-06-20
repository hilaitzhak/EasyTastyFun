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
        surface: '#FFFDF9',   // cards / panels (warm white)
        line: '#EBE3D8',      // hairline borders / dividers
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
      },
      fontFamily: {
        // Friendly rounded display (EN: Quicksand, HE: Rubik)
        display: ['Quicksand', 'Rubik', 'system-ui', 'sans-serif'],
        // Warm readable body (EN: Nunito, HE: Rubik)
        sans: ['Nunito', 'Rubik', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        // Soft, warm, cozy float
        soft: '0 2px 8px -2px rgba(61, 56, 51, 0.08)',
        card: '0 12px 32px -16px rgba(168, 95, 64, 0.28)',
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
