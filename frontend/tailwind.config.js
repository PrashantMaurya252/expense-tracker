const { themes } = require("tailwindcss-themes");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        bg: "var(--color-bg)",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  safelist: [
    "theme-light",
    "theme-dark",
    "theme-cupcake",
    "theme-cyberpunk",
    "theme-dracula",
    "theme-forest",
  ],
  plugins: [
    themes({
      themes: ["light", "dark", "cupcake", "cyberpunk", "dracula", "forest"],
      className: "theme-",
    }),
  ],
};
