// ABOUTME: Tailwind CSS configuration for Sloppedin
// ABOUTME: Defines theme and content paths for styling

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'retro-gray': '#e0e0e0',
        'retro-white': '#ffffff',
        'retro-red': '#FF2A2A',
      },
      fontFamily: {
        mono: ['var(--font-vt323)', 'monospace'],
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px #000000',
      },
      borderWidth: {
        'DEFAULT': '2px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
