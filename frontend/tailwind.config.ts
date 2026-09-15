import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F1116",
          surface: "#161921",
          raised: "#1D212B",
          border: "#272C38",
          hover: "#2F3441",
        },
        mist: {
          DEFAULT: "#EDEFF3",
          muted: "#8D95A5",
          faint: "#5C6373",
        },
        mint: {
          DEFAULT: "#3ED9B0",
          dim: "#2BAE8E",
          deep: "#1B7A64",
        },
        sky: {
          DEFAULT: "#5AA9F0",
        },
        amber: {
          DEFAULT: "#E8A23D",
        },
        coral: {
          DEFAULT: "#E85D5D",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -16px rgba(0,0,0,0.9)",
        lift: "0 14px 36px -20px rgba(0,0,0,0.95)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 180ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
