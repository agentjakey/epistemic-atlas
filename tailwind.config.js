/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0f172a',
          light: '#334155',
          faint: '#64748b',
        },
        page: {
          DEFAULT: '#ffffff',
          off: '#f8fafc',
          border: '#e2e8f0',
        },
        accent: {
          DEFAULT: '#1e40af',
          light: '#3b82f6',
          faint: '#eff6ff',
        },
        conf: {
          high: '#15803d',
          medium: '#b45309',
          low: '#b91c1c',
          speculative: '#7c3aed',
        },
        pos: {
          pro: '#b91c1c',
          con: '#15803d',
          neutral: '#475569',
          conditional: '#b45309',
          methodological: '#1e40af',
        },
      },
    },
  },
  plugins: [],
}
