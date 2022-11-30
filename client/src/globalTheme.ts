import {
  ComponentStyleConfig,
  cssVar,
  extendTheme,
  StyleFunctionProps,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const darkMainBG = "rgb(30, 39, 46)"; // darkMain.300
export const darkNavBG = "rgb(43, 52, 59)"; // darkMain.200
export const darkCardHoverBG = "rgb(56, 64, 71)"; // darkMain.100
export const darkPopover = "rgb(79, 87, 98)";
export const darkColumnHeadText = "rgb(171, 174, 176)";
export const lighterDark = "rgb(130, 133, 136)";
export const darkText = "rgb(213, 214, 215)";
export const lightSubNavBG = "rgb(32, 38, 43)"; // darkMain.400
export const lightColumnHeadText = "rgb(84, 77, 97)";
export const lightMainBG = "rgb(238, 238, 238)"; // lightMain.100
export const customBlue = "rgb(123, 104, 238)";
export const customHoverBlue = "rgb(91, 67, 234)";
export const lightText = "black";

const $arrowBg = cssVar("popper-arrow-bg");

export const globalTheme = extendTheme({
  // Global style
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: mode(lightText, darkText)(props),
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
        // https://github.com/chakra-ui/chakra-ui/issues/4695#issuecomment-991023319
      },
    },
    // https://stackoverflow.com/a/74395392/16648127
    Popover: {
      baseStyle: (props: StyleFunctionProps) => ({
        content: {
          border: "",
          shadow: "xl",
          bgColor: mode("white", "darkMain.100")(props),
        },
      }),
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
      50: "rgb(250, 251, 252)",
      100: lightMainBG,
      200: darkText,
      300: darkColumnHeadText,
      400: lighterDark,
    },
    customBlue: {
      50: "rgb(107, 93, 202)",
      100: customHoverBlue,
      200: customBlue,
    },
  },
});
