/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0A0A0A", // near-black ground
        ink: "#F2F0EA", // off-white text
        surface: "#141311", // raised card/panel surfaces
        accent: {
          DEFAULT: "#B91C1C", // blood red — fills (white text on top)
          hover: "#991B1B",
          tint: "#2A0D0D", // tag/badge backgrounds
          bright: "#EF4444", // red *text* on dark ground (contrast-safe)
        },
        muted: "#A8A5A0",
        hairline: "#2A2825",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderWidth: {
        hairline: "0.5px",
      },
      boxShadow: {
        // harder-edged lift: tight black drop, no soft halo
        lift: "0 6px 16px -6px rgba(0, 0, 0, 0.9)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        // RGB-split glitch for the product-card image swap
        glitch: {
          "0%": { opacity: "0", transform: "translate(0, 0)", filter: "none" },
          "15%": {
            opacity: "1",
            transform: "translate(-3px, 1px)",
            filter:
              "drop-shadow(2px 0 0 rgba(239, 68, 68, 0.55)) drop-shadow(-2px 0 0 rgba(34, 211, 238, 0.45))",
          },
          "35%": {
            opacity: "1",
            transform: "translate(3px, -1px)",
            filter:
              "drop-shadow(-2px 0 0 rgba(239, 68, 68, 0.55)) drop-shadow(2px 0 0 rgba(34, 211, 238, 0.45))",
          },
          "55%": {
            opacity: "1",
            transform: "translate(-1px, 0)",
            filter: "drop-shadow(1px 0 0 rgba(239, 68, 68, 0.35))",
          },
          "100%": { opacity: "1", transform: "translate(0, 0)", filter: "none" },
        },
        // Jittering background tile for the TV-static route transition
        tvStatic: {
          "0%": { backgroundPosition: "0 0" },
          "25%": { backgroundPosition: "-40px 30px" },
          "50%": { backgroundPosition: "60px -20px" },
          "75%": { backgroundPosition: "-30px -50px" },
          "100%": { backgroundPosition: "50px 40px" },
        },
      },
      animation: {
        marquee: "marquee 24s linear infinite",
        // steps() snaps between keyframes — the jumps are the glitch
        glitch: "glitch 0.35s steps(1, end) forwards",
        "tv-static": "tvStatic 0.25s steps(3) infinite",
      },
    },
  },
  plugins: [],
}
