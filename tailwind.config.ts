import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Exclusions pour éviter les fichiers inutiles
    "!./app/**/*.test.{js,ts,jsx,tsx}",
    "!./components/**/*.test.{js,ts,jsx,tsx}",
    "!./node_modules/**",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#161616",
        red: {
          DEFAULT: "#E20600",
          dark: "#710600",
        },
      },
      fontFamily: {
        platform: ["Platform", "system-ui", "sans-serif"],
        poppins: ["Poppins", "system-ui", "sans-serif"],
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      spacing: {
        "13": "42px", // 42px - pour space-y-13
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
