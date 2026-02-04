import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      /* Color Palette - OLED Optimized Dark */
      colors: {
        /* Base Colors */
        black: {
          900: '#000000',  /* Pure black for OLED */
        },
        grey: {
          950: '#0A0A0A',  /* Ultra dark grey */
          900: '#121212',  /* Dark grey for cards/surfaces */
          800: '#1A1A1A',  /* Medium dark grey */
        },
        white: {
          50: '#FFFFFF',   /* Pure white for text */
        },

        /* Neon Accents */
        neon: {
          green: '#00FF41',    /* Cyan-green neon */
          blue: '#00D9FF',     /* Electric blue neon */
          purple: '#D946EF',   /* Vibrant purple neon */
          gold: '#FFD700',     /* Rich gold neon */
          red: '#FF0000',      /* Pure red neon */
        },

        /* Semantic Colors */
        success: '#00FF41',
        info: '#00D9FF',
        warning: '#FFD700',
        error: '#FF0000',
        primary: '#D946EF',
        secondary: '#00D9FF',

        /* Transparent Variants */
        'white-10': 'rgba(255, 255, 255, 0.1)',
        'white-20': 'rgba(255, 255, 255, 0.2)',
        'white-30': 'rgba(255, 255, 255, 0.3)',
        'white-40': 'rgba(255, 255, 255, 0.4)',
        'white-50': 'rgba(255, 255, 255, 0.5)',
        'white-60': 'rgba(255, 255, 255, 0.6)',
        'white-70': 'rgba(255, 255, 255, 0.7)',
        'white-80': 'rgba(255, 255, 255, 0.8)',

        /* Dark Overlay */
        'overlay-80': 'rgba(0, 0, 0, 0.8)',
        'overlay-60': 'rgba(0, 0, 0, 0.6)',
      },

      /* Background Colors */
      backgroundColor: {
        'black': '#000000',
        'dark-grey': '#121212',
        'dark-grey-alt': '#1A1A1A',
      },

      /* Border Radius - ZERO (Sharp Corners) */
      borderRadius: {
        'none': '0px',
        '0': '0px',
        'DEFAULT': '0px',
      },

      /* Border Width - 2-4px Strong */
      borderWidth: {
        'thin': '2px',
        'DEFAULT': '2px',
        'medium': '3px',
        'thick': '4px',
      },

      /* Font Family - System Fonts Only */
      fontFamily: {
        'sans': [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
        'mono': [
          'Courier New',
          'monospace',
        ],
        'code': [
          'Courier New',
          'monospace',
        ],
      },

      /* Font Weight - Bold Only (700+) */
      fontWeight: {
        'bold': '700',
        '700': '700',
        '800': '800',
        '900': '900',
      },

      /* Line Height */
      lineHeight: {
        'tight': '1.2',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '1.75',
        'code': '1.6',
      },

      /* Letter Spacing */
      letterSpacing: {
        'tight': '-0.02em',
        'normal': '0em',
        'wide': '0.02em',
        'code': '0.05em',
      },

      /* Spacing - 8px Grid System */
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
      },

      /* Gap (for flex/grid) */
      gap: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },

      /* Padding */
      padding: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },

      /* Margin */
      margin: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },

      /* Box Shadow - Minimal Glows Only */
      boxShadow: {
        'none': 'none',
        'glow-soft': '0 0 8px rgba(0, 255, 65, 0.3)',
        'glow-medium': '0 0 16px rgba(0, 255, 65, 0.5)',
        'glow-strong': '0 0 24px rgba(0, 255, 65, 0.7)',
        'glow-blue': '0 0 16px rgba(0, 217, 255, 0.4)',
        'glow-purple': '0 0 16px rgba(217, 70, 239, 0.4)',
        'glow-gold': '0 0 16px rgba(255, 215, 0, 0.3)',
      },

      /* Min Height */
      minHeight: {
        'touch': '44px',      /* Mobile touch target */
        'button': '44px',
      },

      /* Min Width */
      minWidth: {
        'touch': '44px',
        'button': '44px',
      },

      /* Z-Index Scale */
      zIndex: {
        'dropdown': '10',
        'sticky': '20',
        'popover': '25',
        'modal': '30',
        'tooltip': '35',
        'notification': '40',
      },

      /* Opacity */
      opacity: {
        '0': '0',
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '100': '1',
      },

      /* Transition - None or Instant (0s) */
      transitionDuration: {
        '0': '0s',
        'instant': '0s',
      },

      /* Animation */
      animation: {
        'spin-slow': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      /* Keyframes for Custom Animations */
      keyframes: {
        'pulse': {
          '0%, 100%': { 'opacity': '1' },
          '50%': { 'opacity': '0.5' },
        },
      },

      /* Width */
      width: {
        'full': '100%',
        'screen': '100vw',
      },

      /* Height */
      height: {
        'full': '100%',
        'screen': '100vh',
      },
    },
  },

  /* Plugins */
  plugins: [
    // Custom plugin for focus ring styling
    function ({ addComponents, theme }: any) {
      addComponents({
        /* Focus Ring for Accessibility */
        '.focus-ring': {
          '@apply outline-2 outline-neon-green focus:outline-neon-green': {},
        },

        /* Button Base Styles */
        '.btn-base': {
          '@apply px-md py-xs min-h-touch min-w-touch': {},
          '@apply border-medium border-white-50': {},
          '@apply text-white-50 font-bold': {},
          '@apply cursor-pointer transition-none': {},
          '@apply hover:scale-[1.02] active:scale-[0.98]': {},
        },

        /* Primary Button */
        '.btn-primary': {
          '@apply btn-base': {},
          '@apply bg-primary border-primary': {},
          '@apply hover:shadow-glow-purple': {},
        },

        /* Secondary Button */
        '.btn-secondary': {
          '@apply btn-base': {},
          '@apply bg-black border-neon-blue': {},
          '@apply hover:shadow-glow-blue': {},
          '@apply text-neon-blue': {},
        },

        /* Input Base Styles */
        '.input-base': {
          '@apply w-full px-md py-xs min-h-touch': {},
          '@apply bg-black border-thin border-white-50': {},
          '@apply text-white-50 font-bold': {},
          '@apply placeholder-white-30': {},
          '@apply focus:border-primary focus:outline-none': {},
          '@apply disabled:opacity-50 disabled:cursor-not-allowed': {},
        },

        /* Card Base Styles */
        '.card-base': {
          '@apply bg-black border-thin border-white-20': {},
          '@apply p-md rounded-none': {},
        },

        /* Code Block Styles */
        '.code-block': {
          '@apply font-mono text-sm text-neon-green': {},
          '@apply bg-grey-900 p-md border-thin border-neon-green': {},
          '@apply overflow-x-auto': {},
        },

        /* Accessibility - Skip Navigation Link */
        '.skip-nav': {
          '@apply absolute -top-12 left-0 z-40': {},
          '@apply px-md py-xs bg-neon-green text-black font-bold': {},
          '@apply focus:top-0': {},
        },

        /* Focus Visible (Keyboard Navigation) */
        '.focus-visible': {
          '@apply outline-2 outline-offset-2 outline-neon-green': {},
        },
      })
    },
  ],
}

export default config
