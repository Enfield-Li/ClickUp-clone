import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const darkMainBG = "rgb(30, 39, 46)"; // darkMain.300
const darkNavBG = "rgb(43, 52, 59)"; // darkMain.200
const darkCardHoverBG = "rgb(56, 64, 71)"; // darkMain.100

const lightMainBG = "rgb(238, 238, 238)"; // lightMain.100
const lightSubNavBG = "rgb(32, 38, 43)"; // darkMain.400

export const globalTheme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode(lightMainBG, darkMainBG)(props),
      },
      nav: {
        color: mode("white", "white")(props),
        bg: mode(darkNavBG, darkNavBG)(props),
      },
    }),
  },
  colors: {
    darkMain: {
      100: darkCardHoverBG,
      200: darkNavBG,
      300: darkMainBG,
      400: lightSubNavBG,
    },
    lightMain: {
      100: lightMainBG,
    },
  },
});
