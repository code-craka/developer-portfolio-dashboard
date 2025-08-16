import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'electric-blue': {
          50: '#E6F9FF',
          100: '#CCF3FF',
          200: '#99E7FF',
          300: '#66DBFF',
          400: '#33CFFF',
          500: '#00D4FF',
          600: '#00A3CC',
          700: '#007299',
          800: '#004166',
          900: '#001033',
          '800-50': 'rgb(51 51 51 / 0.5)', // <-- add custom opacity variant
        },
        'dark': {
          50: '#F8F8F8',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A',
          950: '#0A0A0A',
        },
        'glass': {
          'light': 'rgba(255, 255, 255, 0.1)',
          'dark': 'rgba(0, 0, 0, 0.2)',
          'blue': 'rgba(0, 212, 255, 0.1)',
        },
        'dark-bg': '#0A0A0A',
        'dark-card': '#1A1A1A',
        'dark-border': '#333333',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'electric-gradient': 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
      },
      boxShadow: {
        'electric': '0 0 20px rgba(0, 212, 255, 0.3)',
        'electric-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 16px 64px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
export default config