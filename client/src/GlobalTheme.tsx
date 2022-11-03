import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const globalTheme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode("rgb(238, 238, 238)", "rgb(30, 39, 46)")(props),
      },
      nav: {
        color: mode("white", "white")(props),
        bg: mode("rgb(43, 52, 59)", "rgb(43, 52, 59)")(props),
      },
    }),
  },
});
