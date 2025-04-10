/* eslint-disable @typescript-eslint/no-require-imports */
const daisyui = require('daisyui');

console.log('Using Tailwind config');

module.exports = {
  content: ['./views/*.ejs'],
  important: true,
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [daisyui],
  safelist: ['items-start'],
  daisyui: {
    themes: ['light', 'dark'],
  },
};
