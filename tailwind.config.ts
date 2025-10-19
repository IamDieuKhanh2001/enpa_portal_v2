import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E6372E",
        "primary-hover": "#B91C1C",
        secondary: "#F3F4F6",
        "secondary-hover": "#E5E7EB",
        background: "#FFFFFF",
        "background-subtle": "#F3F4F6",
      },
      text: {
        base: "#1F2937",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-jp)", "Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
