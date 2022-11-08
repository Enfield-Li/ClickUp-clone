import {
  ComponentStyleConfig,
  cssVar,
  extendTheme,
  StyleFunctionProps,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const darkMainBG = "rgb(30, 39, 46)"; // darkMain.300
const darkNavBG = "rgb(43, 52, 59)"; // darkMain.200
const darkCardHoverBG = "rgb(56, 64, 71)"; // darkMain.100
const darkPopover = "rgb(79, 87, 98)";
const darkColumnHeadText = "rgb(171, 174, 176)";
const darkText = "rgb(213, 214, 215)";

const lightSubNavBG = "rgb(32, 38, 43)"; // darkMain.400
const lightColumnHeadText = "rgb(84, 77, 97)";
const lightMainBG = "rgb(238, 238, 238)"; // lightMain.100

const customBlue = "rgb(123, 104, 238)";
const customHoverBlue = "rgb(91, 67, 234)";

// https://github.com/chakra-ui/chakra-ui/issues/4695#issuecomment-991023319
const $arrowBg = cssVar("popper-arrow-bg");

export const globalTheme = extendTheme({
  // Global style
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: mode("black", darkText)(props),
        bg: mode(lightMainBG, darkMainBG)(props),
      },
      nav: {
        color: mode("white", "white")(props),
        bg: mode(darkNavBG, darkNavBG)(props),
      },
    }),
  },

  // components
  components: {
    Tooltip: {
      baseStyle: {
        px: "3",
        py: "2px",
        pb: "3px",
        bgColor: "darkMain.50",
        color: "lightMain.100",
        [$arrowBg.variable]: "colors.darkMain.50",
      },
    },
  },

  // colors
  colors: {
    darkMain: {
      50: darkPopover,
      100: darkCardHoverBG,
      200: darkNavBG,
      300: darkMainBG,
      400: lightSubNavBG,
      500: lightColumnHeadText,
    },
    lightMain: {
      100: lightMainBG,
      200: darkText,
      300: darkColumnHeadText,
    },
    customBlue: {
      100: customHoverBlue,
      200: customBlue,
    },
  },
});
