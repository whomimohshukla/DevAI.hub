// Tailwind v4 still supports config; Vite plugin prefers JS config by default
// Force class-based dark mode so toggling html.classList('dark') updates UI
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
};
