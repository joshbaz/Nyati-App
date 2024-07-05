/** @type {import('tailwindcss').Config} */

const tokens = {
   primary: {
      50: "#FBD6DD",
      100: "#FAC8D2",
      200: "#F8B5C3",
      300: "#F59DAF",
      400: "#F27C94",
      500: "#EE5170",
      600: "#EA254D",
      700: "#D2143A",
      800: "#B21132",
      900: "#980F2A",
   },

   secondary: {
      50: "#AEB0AD",
      100: "#989798",
      200: "#7E7D81",
      300: "#66636C",
      400: "#56525D",
      500: "#443F4D",
      600: "#36323E",
      700: "#24222A",
      800: "#141118",
      900: "#000000",
   },

   black: {
      40: "#27252b",
      50: "#C3C3C3",
      100: "#AFAFAF",
      200: "#949494",
      300: "#717171",
      400: "#404040",
      500: "#231F20",
      600: "#000000",
      700: "#151313",
      800: "#0e0c0d",
      900: "#070606",
   },

   whites: {
      40: "#F2F2F2",
      50: "#ffffff",
      100: "#FFFDFC",
      200: "#fdfbfa",
      300: "#fcfaf8",
      400: "#fbf8f5",
      500: "#faf6f3",
      600: "#c8c5c2",
      700: "#969492",
      800: "#646261",
      900: "#323131",
   },
   background: {
      light: "#faf6f3",
      main: "#ffffff",
      dark: "#231f20",
   },
}

const themeSettings = {
   palette: {
      primary: {
         ...tokens.primary,
         main: tokens.primary[500],
         light: tokens.primary[400],
      },
      secondary: {
         ...tokens.secondary,
         main: tokens.secondary[500],
      },
      tertiary: {
         ...tokens.black,
         main: tokens.black[500],
      },
      whites: {
         ...tokens.whites,
         main: tokens.whites[500],
      },
      background: {
         default: tokens.background.main,
         light: tokens.background.light,
         dark: tokens.background.dark,
      },
   },
   typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
         fontFamily: ["Inter", "sans-serif"].join(","),
         fontSize: 32,
      },
      h2: {
         fontFamily: ["Inter", "sans-serif"].join(","),
         fontSize: 24,
      },
      h3: {
         fontFamily: ["Inter", "sans-serif"].join(","),
         fontSize: 20,
         fontWeight: 800,
         color: tokens.secondary[700],
      },
      h4: {
         fontFamily: ["Inter", "sans-serif"].join(","),
         fontSize: 14,
         fontWeight: 600,
         color: tokens.secondary[300],
      },
      h5: {
         fontFamily: ["Inter", "sans-serif"].join(","),
         fontSize: 15,
         fontWeight: 500,
         color: tokens.secondary[500],
      },
      h6: {
         fontFamily: ["Inter", "sans-serif"].join(","),
         fontSize: 10,
         color: tokens.secondary[700],
      },
   },
}

module.exports = {
   darkMode: "class",
   content: ["./app.{js,jsx,ts,tsx}", "./src/**/*.{js, jsx, ts, tsx}"],
   theme: {
      colors: {
         transparent: "transparent",
         ...themeSettings.palette,
      },
      extend: {},
   },
   plugins: [],
}
