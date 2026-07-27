/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand tokens — derived from the Zing Dentistry tooth-mark logo
        brand: {
          plum:   "#5B2A86", // deep purple — headings, primary buttons
          orchid: "#9B4FCE", // mid purple — accents, hover states
          bloom:  "#E85D9C", // pink — secondary accent, highlights
          petal:  "#FDEBF3", // pale pink — section backgrounds
          mist:   "#F7F3FA", // pale lavender — alt section backgrounds
          ink:    "#2B1B3D", // near-black plum — body text
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
