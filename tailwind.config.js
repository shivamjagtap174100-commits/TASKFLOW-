/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0C0D0C',
        sidebar: '#121312',
        surface: {
          DEFAULT: '#161715',
          hover: '#1D1E1B',
          active: '#242521',
          elevated: '#1A1B18',
        },
        border: {
          DEFAULT: '#262823',
          subtle: '#1C1D1A',
          strong: '#353730',
          glass: 'rgba(255, 255, 255, 0.08)',
        },
        text: {
          primary: '#F6F5F0',
          secondary: '#9B9D95',
          muted: '#6E7068',
        },
        accent: {
          DEFAULT: '#C5A46D',
          hover: '#D6B782',
          muted: 'rgba(197, 164, 109, 0.14)',
          border: 'rgba(197, 164, 109, 0.35)',
        },
        success: {
          DEFAULT: '#82A88A',
          hover: '#95BB9D',
          muted: 'rgba(130, 168, 138, 0.15)',
          border: 'rgba(130, 168, 138, 0.35)',
        },
        danger: {
          DEFAULT: '#D77C76',
          hover: '#E48F89',
          muted: 'rgba(215, 124, 118, 0.15)',
          border: 'rgba(215, 124, 118, 0.35)',
        },
        priority: {
          high: '#D77C76',
          medium: '#C5A46D',
          low: '#82A88A',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        card: '0 4px 24px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glass-card': '0 10px 30px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        dropdown: '0 16px 40px -8px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        modal: '0 25px 60px -12px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'gold-glow': '0 0 25px -4px rgba(197, 164, 109, 0.35)',
        'gold-glow-sm': '0 0 14px -2px rgba(197, 164, 109, 0.25)',
      },
      letterSpacing: {
        widest: '.15em',
      }
    },
  },
  plugins: [],
}
