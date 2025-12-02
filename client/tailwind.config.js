/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. NEON COLORS (Used in JS/CSS)
      colors: {
        // Deep Blue theme colors
        'neon-cyan': '#00aaff',
        'neon-purple': '#8a2be2',
      },
      
      // 2. NEON SHADOW (Used for the glass card glow)
      boxShadow: {
        // Darker, subtle Cyan/Purple Glow for the main card (shadow-neon)
        'neon': '0 0 5px #00aaff, 0 0 20px #8a2be2', 
      },

      // 3. TRANSLATE FIX (For the blurry text hardware acceleration fix)
      // This is generally not needed if the plugin below is correctly defined, 
      // but ensures compatibility if default configuration uses it.
      translate: {
        'z-0': '0',
      }
    },
  },
  
  // 4. PLUGINS (For custom utilities like translate-z-0)
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        // Define the translate-z-0 utility explicitly for the text blur fix
        '.translate-z-0': {
          'transform': 'translateZ(0)',
        },
      }
      addUtilities(newUtilities, ['responsive'])
    },
  ],
}