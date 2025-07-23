// tailwind.config.js
import { themes } from 'tailwindcss-themes'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-bg)",
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
        'forest'
      ],
      className: 'theme',
    }),
  ],
};
