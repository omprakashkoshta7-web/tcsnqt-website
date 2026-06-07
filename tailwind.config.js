/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "fade-slide-in": "fadeSlideIn 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        gradient: "gradientMove 25s ease infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "confetti-fall": "confettiFall 2.5s ease-out forwards",
      },
      keyframes: {
        fadeSlideIn: {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        confettiFall: {
          "0%": { opacity: "1", transform: "translateY(-20px) rotate(0deg)" },
          "100%": { opacity: "0", transform: "translateY(300px) rotate(720deg)" },
        },
      },
    },
  },
  plugins: [],
};
