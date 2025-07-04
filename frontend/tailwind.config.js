/** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        transitionProperty: {
          'height': 'height',
        }
      },
    },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}