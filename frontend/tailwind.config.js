const { themes } = require('tailwindcss-themes');

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
      },
    },
  },
  plugins: [
    themes({
      themes: [
        'light',
        'dark',
        'cupcake',
        'cyberpunk',
        'dracula',
        'forest',
      ],
      className: 'theme-',
    }),
  ],
};
