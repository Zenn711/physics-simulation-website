import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Update color palette to use black, dark charcoal, and white
        background: {
          DEFAULT: "#000000e6",     // Black with slight transparency
          dark: "#221F26",          // Dark Charcoal
          light: "#FFFFFF"          // Pure White
        },
        foreground: {
          DEFAULT: "#FFFFFF",       // White text on black
          dark: "#221F26",          // Dark text on light background
          light: "#000000"          // Black text on white
        },
        primary: {
          DEFAULT: "#221F26",       // Dark Charcoal
          foreground: "#FFFFFF"     // White text
        },
        secondary: {
          DEFAULT: "#000000e6",     // Black
          foreground: "#FFFFFF"     // White text
        },
        border: {
          DEFAULT: "#221F26",       // Dark Charcoal for borders
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // Existing radius and other theme extensions remain the same
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Keep existing keyframes and animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 10px 5px rgba(139, 92, 246, 0.3)",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 20px 10px rgba(139, 92, 246, 0.5)",
            transform: "scale(1.02)"
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in-up": {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        "scale-in": {
          "0%": { 
            opacity: "0",
            transform: "scale(0.95)"
          },
          "100%": { 
            opacity: "1",
            transform: "scale(1)"
          },
        },
        "glow": {
          "0%, 100%": { 
            boxShadow: "0 0 5px 2px rgba(139, 92, 246, 0.3)"
          },
          "50%": { 
            boxShadow: "0 0 15px 5px rgba(139, 92, 246, 0.5)"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s infinite",
        "float": "float 6s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "glow": "glow 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
