/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kerala: {
          teal: {
            deep: '#0D5C52',
            dark: '#064E3B',
            light: '#137A6D',
            surface: '#E6F4F1',
          },
          gold: {
            DEFAULT: '#F59E0B',
            light: '#FDE68A',
            dark: '#D97706',
            shine: '#FEF3C7',
          },
          mint: {
            DEFAULT: '#2DD4BF',
            dark: '#0D9488',
            light: '#CCFBF1',
          },
          coral: {
            DEFAULT: '#FB7185',
            dark: '#E11D48',
            light: '#FFE4E6',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'float-slow': 'float-slow 5s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}
