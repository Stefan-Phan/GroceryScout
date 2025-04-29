// tailwind.config.js
export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  // Add any other directories with your code
];
export const theme = {
  extend: {
    fontFamily: {
      lato: ["var(--font-lato)", "sans-serif"],
    },
  },
};
export const plugins = [
  function ({ addUtilities }) {
    addUtilities({
      ".scrollbar-hide": {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    });
  },
];
