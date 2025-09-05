const colors = require('./src/components/ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // iOS fonts
        'sf-pro': ['System'],
        'sf-pro-rounded': ['System-Rounded'],
        'sf-mono': ['System-Mono'],
        // Android fonts
        roboto: ['Roboto'],
        'roboto-mono': ['RobotoMono'],
        // Fallback
        inter: ['Inter'],
      },
      colors: {
        ...colors, // Legacy colors for backward compatibility
        // Semantic colors
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
          elevated: 'var(--background-elevated)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          quaternary: 'var(--text-quaternary)',
        },
      },
      spacing: {},
      borderRadius: {},
      fontSize: {
        // iOS text sizes
        'ios-largeTitle': ['34px', '41px'],
        'ios-title1': ['28px', '34px'],
        'ios-title2': ['22px', '28px'],
        'ios-title3': ['20px', '25px'],
        'ios-headline': ['17px', '22px'],
        'ios-body': ['17px', '22px'],
        'ios-callout': ['16px', '21px'],
        'ios-subheadline': ['15px', '20px'],
        'ios-footnote': ['13px', '18px'],
        'ios-caption1': ['12px', '16px'],
        'ios-caption2': ['11px', '13px'],
        // Android text sizes
        'android-displayLarge': ['57px', '64px'],
        'android-displayMedium': ['45px', '52px'],
        'android-displaySmall': ['36px', '44px'],
        'android-headlineLarge': ['32px', '40px'],
        'android-headlineMedium': ['28px', '36px'],
        'android-headlineSmall': ['24px', '32px'],
        'android-titleLarge': ['22px', '28px'],
        'android-titleMedium': ['16px', '24px'],
        'android-titleSmall': ['14px', '20px'],
        'android-bodyLarge': ['16px', '24px'],
        'android-bodyMedium': ['14px', '20px'],
        'android-bodySmall': ['12px', '16px'],
        'android-labelLarge': ['14px', '20px'],
        'android-labelMedium': ['12px', '16px'],
        'android-labelSmall': ['11px', '16px'],
      },
      width: {},
      height: {},
    },
  },
  plugins: [
    // Add plugin for CSS variables
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--background-primary': theme('colors.white'),
          '--background-secondary': '#F5F5F5',
          '--background-tertiary': theme('colors.white'),
          '--background-elevated': theme('colors.white'),
          '--text-primary': theme('colors.black'),
          '--text-secondary': '#3C3C43',
          '--text-tertiary': '#3C3C43',
          '--text-quaternary': '#3C3C43',
        },
        '.dark': {
          '--background-primary': theme('colors.black'),
          '--background-secondary': '#1C1C1E',
          '--background-tertiary': '#2C2C2E',
          '--background-elevated': '#3A3A3C',
          '--text-primary': theme('colors.white'),
          '--text-secondary': '#EBEBF5',
          '--text-tertiary': '#EBEBF5',
          '--text-quaternary': '#EBEBF5',
        },
      });
    },
  ],
};
