import daisyui from 'daisyui';
import tailwindTypography from '@tailwindcss/typography';

const config = {
  content: ['./views/*.ejs'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [tailwindTypography, daisyui],
  daisyui: {
    themes: ['light', 'dark'],
  },
  important: true,
};
export default config;
