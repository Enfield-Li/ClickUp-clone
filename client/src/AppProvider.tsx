import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React, { memo } from "react";
import { BrowserRouter } from "react-router-dom";
import { IS_SUB_NAV_OPEN } from "./constant";
import AuthStateProvider from "./context/auth/AuthContext";
import { globalTheme } from "./globalTheme";

type Props = { children: React.ReactNode };

export default memo(AppProvider);
function AppProvider({ children }: Props) {
  const colorMode = "chakra-ui-color-mode";
  if (localStorage.getItem(colorMode) === null) {
    localStorage.setItem(colorMode, "dark");
  }

  if (localStorage.getItem(IS_SUB_NAV_OPEN) === null) {
    localStorage.setItem(IS_SUB_NAV_OPEN, JSON.stringify(true));
  }

  return (
    <BrowserRouter>
      <AuthStateProvider>
        <ColorModeScript />
        <ChakraProvider theme={globalTheme}>{children}</ChakraProvider>
      </AuthStateProvider>
    </BrowserRouter>
  );
}
