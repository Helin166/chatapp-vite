/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-purple-800',
    'from-purple-800',
    'via-purple-900',
    'to-black',
    'bg-gradient-to-br',
    'bg-gradient-to-b',
    'border-purple-700',
    'text-purple-400',
    'hover:from-purple-700',
    'hover:to-purple-900',
    'text-white',
    'bg-zinc-900',
    'bg-zinc-800'
  ],
  plugins: [],
};
