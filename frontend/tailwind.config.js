/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "'Space Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        sans: [
          "'Space Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        graphite: {
          DEFAULT: "#1C1C1E",
          50: "#2C2C2E",
          100: "#3A3A3C",
          200: "#48484A",
        },
        crimson: {
          DEFAULT: "#FF3B30",
          light: "#FF5F56",
          dark: "#C92A20",
        },
        amber: {
          DEFAULT: "#FF9F0A",
          light: "#FFB84D",
        },
        silver: "#EDEDED",
        success: "#00D084",
      },
      boxShadow: {
        glow: "0 0 10px rgba(255,59,48,0.4)",
        soft: "0 0 6px rgba(255,159,10,0.25)",
      },
      backgroundImage: {
        "canix-gradient": "linear-gradient(145deg, #FF3B30 0%, #FF9F0A 100%)",
      },
      animation: {
        pulseSlow: "pulse 3s ease-in-out infinite",
      },
    },
  },
};
