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
        // Primary — i have cpu red
        primary: {
          DEFAULT: "#E53935",
          50: "#FFEBEE",
          100: "#FFCDD2",
          200: "#EF9A9A",
          300: "#E57373",
          400: "#EF5350",
          500: "#E53935",
          600: "#D32F2F",
          700: "#C62828",
          800: "#B71C1C",
          900: "#8E0000",
        },
        // Secondary — dark/charcoal
        secondary: {
          DEFAULT: "#1A1A2E",
          50: "#E8E8ED",
          100: "#C5C5D0",
          200: "#9E9EB3",
          300: "#777796",
          400: "#5A5A7A",
          500: "#3D3D5C",
          600: "#2D2D47",
          700: "#1A1A2E",
          800: "#12121F",
          900: "#0A0A12",
        },
        // Backgrounds
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F5F7",
          dim: "#EEEEEf",
        },
        // Text
        text: {
          primary: "#1A1A2E",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
        // Border
        border: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
        },
        // Legacy aliases (keep for existing code)
        accent: "#E53935",
        topHeadingPrimary: "#1A1A2E",
        topHeadingSecondary: "#2D2D47",
        pink: "#FD4B6B",
      },
      container: {
        center: true,
        padding: "15px",
      },
      fontFamily: {
        heading: ['"Russo One"', "sans-serif"],
        body: ['"Chakra Petch"', "sans-serif"],
      },
      boxShadow: {
        "btn-red":
          "0 4px 14px 0 rgba(229, 57, 53, 0.35)",
        "btn-red-hover":
          "0 6px 20px 0 rgba(229, 57, 53, 0.5)",
        card: "0 2px 12px 0 rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px 0 rgba(0, 0, 0, 0.12)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
