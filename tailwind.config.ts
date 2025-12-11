import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#13ec37",
        "background-light": "#f6f8f6",
        "background-dark": "#102213",
        "surface-dark": "#161e17",
        "border-dark": "#28392b",
        "text-secondary": "#9db9a1",
        background: "#102213", 
        foreground: "#ffffff",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
      },
      borderRadius: { "DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px" },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
