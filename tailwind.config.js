/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // couleurs  inspirées de Figma pour Sorea !!
        sorea: {
          violet: "#9B8FD9", // Couleur principale
          lavande: "#E2DCF9", //  Couleur secondaire
          peche: "#F4C49E", // Couleur  foncer douce
          gris: "#3D3D3D", // Couleur de contrast
        },

        primary: {
          DEFAULT: "#9B8FD9", // Couleur principale
          dark: "#6A18A4", // Teinte plus foncée
          darker: "#280267", // Teinte encore plus foncée
        },

        background: {
          light: "#FFFFFF",
          lighter: "#F5F5F5", // backgrounds/lighterrr
          dark: "#212121",
        },

        text: {
          light: "#FFFFFF",
          medium: "#3D3D3D",
          dark: "#212121",
        },

        button: {
          hover: "#6A18A4",
        },

        accent: {
          rubrique2: "#F4C49E",
        },
      },
      // --- Dégradés Figma (Lineaire + Radial) ---
      backgroundImage: {
        "sorea-lineaire": "linear-gradient(135deg, #6A18A4 0%, #280267 100%)",
        "sorea-radial":
          "radial-gradient(circle at 50% 0%, #6A18A4 0%, #280267 100%)",
      },
      //policeeee
      fontFamily: {
        // meme police que figma
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        inria: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
