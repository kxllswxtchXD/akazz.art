import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'varela': ['Varela', 'sans-serif'],
        'lexend': ['Lexend', 'sans-serif']
      },
      colors: {
        whitepure: '#ffffff',
        darkcarbon: '#1c1c1c',
        blackonyx: '#111111',
        grayshadow: '#1F1F1F',
        steelgray: '#333333',
        mediumslate: '#4d4d4d',
        silverlight: '#D0D2D6',
        stormgray: '#B4B7BD',
        darkcharcoal: '#0A0A0A',
        ibackground: '#0e0e0e'
      },
      borderWidth: {
        1: '1px',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-20deg)' },
          '75%': { transform: 'rotate(20deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        'wave': 'wave 0.8s linear',
      },
    },
  },
};

export default config;
