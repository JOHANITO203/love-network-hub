/**
 * Love Network Hub - Tailwind Color Configuration
 * Modern Dating App Color System (2025-2026)
 *
 * Usage:
 * - Import this in your tailwind.config.js
 * - Use classes like: bg-primary-500, text-secondary-600, border-accent-400
 * - Gradients: bg-gradient-to-r from-primary-400 to-primary-600
 */

const colors = {
  // Primary - Coral (Love & Warmth)
  primary: {
    50: '#fff5f3',
    100: '#ffe8e3',
    200: '#ffd0c7',
    300: '#ffb3a3',
    400: '#ff8a6f',
    500: '#ff6b4a', // Main brand color
    600: '#f04e2e',
    700: '#d63a1e',
    800: '#b02e17',
    900: '#8f2815',
    950: '#4e1108',
  },

  // Secondary - Powder Blue (Trust & Calm)
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#b9e6fe',
    300: '#7cd4fd',
    400: '#36bffa',
    500: '#0ba5e9', // Main secondary
    600: '#0086c9',
    700: '#026aa2',
    800: '#065986',
    900: '#0b4a6f',
    950: '#082f4a',
  },

  // Accent - Sage Green (Growth & Harmony)
  accent: {
    50: '#f4f8f4',
    100: '#e6f0e6',
    200: '#cee1cf',
    300: '#a8caa9',
    400: '#7dae7f',
    500: '#5a9360', // Main accent
    600: '#457549',
    700: '#385d3b',
    800: '#2e4a31',
    900: '#273d29',
    950: '#122013',
  },

  // Success - Soft Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - Warm Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error - Soft Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Info - Sky Blue
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Neutral - Warm Grays
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },

  // Dark Mode Specific (for warm dark backgrounds)
  dark: {
    bg: '#1a1715',
    'bg-secondary': '#252220',
    'bg-tertiary': '#2d2927',
    surface: '#252220',
    'surface-elevated': '#2d2927',
    border: '#3d3935',
    'border-light': '#322e2b',
  },
};

// Gradient configurations for Tailwind
const gradients = {
  'gradient-primary': 'linear-gradient(135deg, #ff8a6f 0%, #f04e2e 100%)',
  'gradient-secondary': 'linear-gradient(135deg, #36bffa 0%, #0086c9 100%)',
  'gradient-accent': 'linear-gradient(135deg, #7dae7f 0%, #457549 100%)',
  'gradient-love': 'linear-gradient(135deg, #ff8a6f 0%, #36bffa 100%)',
  'gradient-sunset': 'linear-gradient(135deg, #ffb3a3 0%, #ff6b4a 50%, #7dae7f 100%)',
  'gradient-ocean': 'linear-gradient(135deg, #7cd4fd 0%, #7dae7f 100%)',
  'gradient-warm': 'linear-gradient(135deg, #fff5f3 0%, #ffe8e3 50%, #f0f9ff 100%)',
  'gradient-hero': 'linear-gradient(180deg, #fff5f3 0%, #ffffff 100%)',
};

// Extended Tailwind theme configuration
const theme = {
  colors: {
    ...colors,
    // Semantic aliases
    brand: colors.primary,
    // Ensure we don't lose default Tailwind colors
    transparent: 'transparent',
    current: 'currentColor',
    white: '#ffffff',
    black: '#000000',
  },

  // Custom background images for gradients
  backgroundImage: {
    ...gradients,
    'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  },

  // Box shadows with brand colors
  boxShadow: {
    'sm': '0 1px 2px 0 rgba(255, 107, 74, 0.05)',
    'DEFAULT': '0 1px 3px 0 rgba(255, 107, 74, 0.08), 0 1px 2px -1px rgba(255, 107, 74, 0.05)',
    'md': '0 4px 6px -1px rgba(255, 107, 74, 0.08), 0 2px 4px -2px rgba(255, 107, 74, 0.05)',
    'lg': '0 10px 15px -3px rgba(255, 107, 74, 0.1), 0 4px 6px -4px rgba(255, 107, 74, 0.05)',
    'xl': '0 20px 25px -5px rgba(255, 107, 74, 0.12), 0 8px 10px -6px rgba(255, 107, 74, 0.05)',
    '2xl': '0 25px 50px -12px rgba(255, 107, 74, 0.15)',
    'inner': 'inset 0 2px 4px 0 rgba(255, 107, 74, 0.05)',
    'none': 'none',
    // Dark mode shadows
    'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
  },

  // Animation configurations
  animation: {
    'fade-in': 'fadeIn 0.3s ease-in-out',
    'slide-up': 'slideUp 0.3s ease-out',
    'slide-down': 'slideDown 0.3s ease-out',
    'scale-in': 'scaleIn 0.2s ease-out',
    'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    slideUp: {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideDown: {
      '0%': { transform: 'translateY(-10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    pulseSoft: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.8' },
    },
  },
};

module.exports = {
  colors,
  gradients,
  theme,
};
