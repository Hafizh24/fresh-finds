/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT')

module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{jsx, tsx, js, ts}',
    '../../node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'sans-serif']
    },
    extend: {}
  },
  plugins: []
})
