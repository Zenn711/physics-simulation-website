
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        heading: ["var(--font-heading)", ...fontFamily.sans],
        display: ["var(--font-display)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        destructive: "hsl(var(--destructive))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        popover: "hsl(var(--popover))",
        card: "hsl(var(--card))",
        // New color palette
        "soft-blue": "#D3E4FD",
        "soft-gray": "#F1F0FB",
        "text-primary": "#333333",
        "text-secondary": "#666666",
        // Custom neon colors
        "neon-purple": "#9333ea",
        "neon-blue": "#3b82f6",
        "neon-cyan": "#06b6d4",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: 0, transform: "translateX(-10px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: 1,
            filter: "drop-shadow(0 0 5px currentColor)"
          },
          "50%": { 
            opacity: 0.8, 
            filter: "drop-shadow(0 0 15px currentColor)"
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "orbital": {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in 0.6s ease-out forwards",
        "slide-in": "slide-in 0.4s ease-out forwards",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "orbital": "orbital 20s linear infinite",
      },
    },
  },
  plugins: [
    animate,
    plugin(function({ addUtilities }) {
      addUtilities({
        '.hover-scale': {
          '@apply transition-transform duration-300': {},
          '&:hover': {
            transform: 'scale(1.03)',
          },
        },
        '.glass-card': {
          '@apply backdrop-blur-sm bg-white/10 dark:bg-gray-900/20 border border-white/20 dark:border-gray-800/50 shadow-lg': {},
        },
        '.text-gradient': {
          '@apply bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent': {},
        },
        '.text-gradient-reverse': {
          '@apply bg-gradient-to-r from-text-secondary to-text-primary bg-clip-text text-transparent': {},
        },
        '.animate-delay': {
          'animation-delay': 'var(--delay, 0ms)',
        },
        '.parallax': {
          'perspective': '1000px',
          'transform-style': 'preserve-3d',
        },
        '.orbital': {
          'animation': 'orbital 20s linear infinite',
        },
        '.font-tech': {
          'letter-spacing': '0.025em',
          'font-feature-settings': "'ss01', 'ss03'",
        },
        '.font-tech-tight': {
          'letter-spacing': '-0.025em',
          'font-feature-settings': "'ss01', 'ss03'",
        },
      })
    }),
  ],
};
