import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E6372E",
        "primary-hover": "#B91C1C",
        secondary: "#3B82F6",
        "secondary-hover": "#1D4ED8",
        neutral: "#E5E7EB",
        "neutral-hover": "#D5D1DB",
        background: "#FFFFFF",
        "background-subtle": "#F3F4F6",
        "primary-disabled": "#FCA5A5",
        "secondary-disabled": "#93C5FD",
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
