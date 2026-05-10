import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0914',
        surface: '#131120',
        surface2: '#1c1a2e',
        border: '#2a2740',
        primary: '#7c5cfc',
        'primary-light': '#a48bff',
        yellow: '#ffd166',
        green: '#06d6a0',
        red: '#ef476f',
        orange: '#ff9f1c',
        pink: '#ff6b9d',
        text: '#f0eeff',
        'text-muted': '#8e8cb0',
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
