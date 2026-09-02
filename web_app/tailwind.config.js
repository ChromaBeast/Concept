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
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        dark: {
          bg: '#0D1117',
          surface: '#161B22',
          card: '#1C2128',
          variant: '#22272E',
          border: '#30363D',
          subtle: '#21262D',
          text: '#F0F6FC',
          muted: '#8B949E',
          sub: '#484F58',
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
      },
    },
  },
  plugins: [],
};
