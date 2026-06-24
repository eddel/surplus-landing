import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surplus: {
          black: "var(--surplus-black)",
          white: "var(--surplus-white)",
          orange: "var(--surplus-orange)",
          "orange-dim": "var(--surplus-orange-dim)",
          grey: "var(--surplus-grey)",
          "grey-text": "var(--surplus-grey-text)",
          green: "var(--surplus-green)",
          line: "var(--surplus-line)"
        }
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4)"
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-syne-mono)", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
