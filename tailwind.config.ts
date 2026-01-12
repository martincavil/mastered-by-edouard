import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Exclusions pour éviter les fichiers inutiles
    '!./app/**/*.test.{js,ts,jsx,tsx}',
    '!./components/**/*.test.{js,ts,jsx,tsx}',
    '!./node_modules/**',
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#161616',
        red: {
          DEFAULT: '#E20600',
          dark: '#710600',
        },
      },
      fontFamily: {
        platform: ['Platform', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '13': '3.25rem', // 52px - pour space-y-13
      },
    },
  },
  plugins: [],
};

export default config;
