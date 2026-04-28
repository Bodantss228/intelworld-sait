import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700",
        secondary: "#9333EA",
        accent: "#A855F7",
        background: "#000000",
        surface: "#0A0A0A",
        card: "#111111",
        border: "#1F1F1F",
        success: "#10B981",
      },
    },
  },
  plugins: [],
};
export default config;
