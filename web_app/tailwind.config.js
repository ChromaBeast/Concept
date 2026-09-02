/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        electric: {
          DEFAULT: '#E2FB3C',
          400: '#EEFC6A',
          500: '#E2FB3C',
          600: '#C2DB2A',
          dim: '#B5CE22',
        },
        obsidian: {
          bg: '#070B12',
          surface: '#0E1420',
          card: '#141C2B',
          variant: '#1B263B',
          border: '#243249',
          subtle: '#101726',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        dark: {
          bg: '#070B12',
          surface: '#0E1420',
          card: '#131A28',
          variant: '#1A2436',
          border: '#222E42',
          subtle: '#0F1622',
          text: '#F1F5F9',
          muted: '#94A3B8',
          sub: '#64748B',
        },
        category: {
          dsa: '#58A6FF',
          system_design: '#BC8CFF',
          databases: '#39C5CF',
          operating_systems: '#FF9B4E',
          networking: '#3FB950',
          oop_design_patterns: '#F778BA',
          frontend: '#E3B341',
          backend: '#79C0FF',
          devops_infra: '#56D364',
          security: '#FF7B72',
          testing_qa: '#7EE787',
          version_control: '#D2A8FF',
          cloud: '#79B8FF',
          ml_basics: '#E279FE',
          behavioral_interview: '#FFA657',
          language_specific: '#2DD4BF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};
