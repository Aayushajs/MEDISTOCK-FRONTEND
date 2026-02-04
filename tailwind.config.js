/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#2874F0',
        secondary: '#FB641B',
        success: '#388E3C',
        warning: '#F57C00',
        danger: '#D32F2F',
        dark: {
          bg: '#0A0A0A',
          card: '#1A1A1A',
          text: '#FFFFFF',
        },
      },
      fontFamily: {
        heading: ['Outfit-Bold'],
        body: ['Inter-Regular'],
      },
    },
  },
  plugins: [],
};
