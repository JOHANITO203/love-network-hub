/**
 * Love Network Hub - Complete Tailwind Configuration
 * Modern Dating App Design System (2025-2026)
 */

const { colors, theme } = require('./tailwind.colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    './components/**/*.{js,jsx,ts,tsx}',
  ],

  darkMode: ['class', '[data-theme="dark"]'], // Support both class and data-attribute

  theme: {
    extend: {
      colors: theme.colors,
      backgroundImage: theme.backgroundImage,
      boxShadow: theme.boxShadow,
      animation: theme.animation,
      keyframes: theme.keyframes,

      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },

      // Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // Border Radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Z-Index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // Transitions
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
      },

      // Backdrop Blur
      backdropBlur: {
        xs: '2px',
      },

      // Max Width
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      // Screens (responsive breakpoints)
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },

      // Grid Template Columns
      gridTemplateColumns: {
        'auto-fill-cards': 'repeat(auto-fill, minmax(300px, 1fr))',
        'auto-fit-cards': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },

  plugins: [
    // Forms plugin for better form styling
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class-based strategy
    }),

    // Typography plugin for rich text content
    require('@tailwindcss/typography'),

    // Aspect Ratio plugin for responsive media
    require('@tailwindcss/aspect-ratio'),

    // Container Queries plugin
    require('@tailwindcss/container-queries'),

    // Custom plugin for additional utilities
    function({ addUtilities, addComponents, theme }) {
      // Custom gradient text utilities
      const gradientTextUtilities = {
        '.text-gradient': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-image': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        },
      };

      // Custom focus ring utilities
      const focusUtilities = {
        '.focus-ring': {
          'outline': `2px solid ${theme('colors.primary.500')}`,
          'outline-offset': '2px',
        },
        '.focus-ring-secondary': {
          'outline': `2px solid ${theme('colors.secondary.500')}`,
          'outline-offset': '2px',
        },
        '.focus-ring-accent': {
          'outline': `2px solid ${theme('colors.accent.500')}`,
          'outline-offset': '2px',
        },
      };

      // Custom scrollbar utilities
      const scrollbarUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('colors.neutral.300')} transparent`,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            'background-color': theme('colors.neutral.300'),
            'border-radius': '9999px',
            '&:hover': {
              'background-color': theme('colors.neutral.400'),
            },
          },
        },
      };

      // Card component
      const cardComponents = {
        '.card': {
          'background-color': theme('colors.white'),
          'border-radius': theme('borderRadius.lg'),
          'box-shadow': theme('boxShadow.md'),
          'padding': theme('spacing.6'),
          'border': `1px solid ${theme('colors.neutral.200')}`,
        },
        '.card-elevated': {
          'box-shadow': theme('boxShadow.lg'),
          'transform': 'translateY(-2px)',
          'transition': 'all 0.2s ease',
        },
      };

      // Button component base
      const buttonComponents = {
        '.btn': {
          'display': 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          'padding': `${theme('spacing.2')} ${theme('spacing.4')}`,
          'border-radius': theme('borderRadius.lg'),
          'font-weight': theme('fontWeight.semibold'),
          'transition': 'all 0.2s ease',
          'cursor': 'pointer',
          '&:disabled': {
            'opacity': '0.5',
            'cursor': 'not-allowed',
          },
        },
        '.btn-primary': {
          'background-color': theme('colors.primary.500'),
          'color': theme('colors.white'),
          '&:hover': {
            'background-color': theme('colors.primary.600'),
            'transform': 'scale(1.02)',
          },
          '&:active': {
            'background-color': theme('colors.primary.700'),
            'transform': 'scale(0.98)',
          },
        },
        '.btn-secondary': {
          'background-color': theme('colors.secondary.500'),
          'color': theme('colors.white'),
          '&:hover': {
            'background-color': theme('colors.secondary.600'),
            'transform': 'scale(1.02)',
          },
          '&:active': {
            'background-color': theme('colors.secondary.700'),
            'transform': 'scale(0.98)',
          },
        },
      };

      addUtilities(gradientTextUtilities);
      addUtilities(focusUtilities);
      addUtilities(scrollbarUtilities);
      addComponents(cardComponents);
      addComponents(buttonComponents);
    },
  ],

  // Safelist important classes that might be dynamically generated
  safelist: [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-accent-500',
    'text-primary-500',
    'text-secondary-500',
    'text-accent-500',
    'border-primary-500',
    'border-secondary-500',
    'border-accent-500',
  ],
};
