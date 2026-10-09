import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)",
        "accent-light": "var(--color-accent-light)",
        border: "var(--color-border)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        ivory: {
          50: "#FCFAF6",
          100: "#F9F6F0",
          200: "#F2EBE0",
          300: "#E9DFCE",
          400: "#DECDBA",
          500: "#CEB79F",
          600: "#B89D82",
          700: "#987E66",
          800: "#755F4D",
          900: "#544336",
        },
        gold: {
          50: "#FAF7EE",
          100: "#F3ECCF",
          200: "#E7D8A2",
          300: "#DBC474",
          400: "#CFAA4B",
          500: "#C5A880", // Muted luxury gold
          600: "#B09062",
          700: "#8C7149",
          800: "#685334",
          900: "#453621",
        },
        terracotta: {
          50: "#FAF4F2",
          100: "#F5E8E4",
          200: "#ECD1C8",
          300: "#DEB2A4",
          400: "#C47B69",
          500: "#B57359",
          600: "#86412D",
          700: "#6B3323",
          800: "#4A190B",
          900: "#2B0F07",
        },
        charcoal: {
          50: "#706B65",
          100: "#5D5852",
          200: "#4B4641",
          300: "#3B3732",
          400: "#2C2925",
          500: "#23211E",
          600: "#1C1A17",
          700: "#161412",
          800: "#11100E",
          900: "#0B0A09",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "Cinzel", "Cormorant Garamond", "serif"],
      },
      letterSpacing: {
        widest: ".25em",
        luxury: ".35em",
        editorial: ".15em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
        cinematic: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

