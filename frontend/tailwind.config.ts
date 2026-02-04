import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // INOX Inspired Cinema Theme
        "primary": "#234b9e",
        "primary-light": "#3b82f6",
        "primary-dark": "#183462",
        "background-light": "#f8f9fa",
        "background-dark": "#0f1419",
        "background-modal": "#cedeff",
        "surface-dark": "#1a1f2e",
        "surface-light": "#edf3ff",
        "surface-highlight": "#2d3748",
        "text-secondary": "#9ca3af",
        "cyan-glow": "#22d3ee",
        "modal-bg": "#234b9e",
        "border-light": "#f5f9ff",
        "inox-blue": "#234b9e",
        "inox-gradient-start": "#234b9e",
        "inox-gradient-end": "#d9ecde",
        // Bootstrap-style color scales
        blue: {
          50: "#f5f9ff",
          100: "#d0e1fd",
          200: "#abc9fb",
          300: "#85b2f9",
          400: "#609af8",
          500: "#3b82f6",
          600: "#326fd1",
          700: "#295bac",
          800: "#204887",
          900: "#183462",
        },
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#eeeeee",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#9e9e9e",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
        },
      },
      fontFamily: {
        "display": ["Poppins", "system-ui", "sans-serif"],
        "body": ["Poppins", "system-ui", "sans-serif"],
        "sans": ["Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px",
      },
      boxShadow: {
        "screen": "0 25px 40px -10px rgba(59, 130, 246, 0.2)",
        "seat-selected": "0 0 15px 2px rgba(59, 130, 246, 0.6)",
        "seat-vision": "0 10px 30px -5px rgba(0, 0, 0, 0.8)",
        "inox-card": "0 4px 16px rgba(35, 75, 158, 0.1)",
        "inox-glow": "0 0 20px rgba(59, 130, 246, 0.4)",
      },
      backgroundImage: {
        "gradient-inox": "linear-gradient(334deg, #234b9e 0%, #d9ecde 100%)",
        "gradient-inox-dark": "linear-gradient(180deg, #0f1419 0%, #234b9e 100%)",
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.perspective-container': {
          perspective: '1000px',
        },
        '.screen-curve': {
          transform: 'rotateX(-5deg)',
        },
        '.glass-panel': {
          background: 'rgba(51, 25, 27, 0.7)',
          backdropFilter: 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
} satisfies Config
