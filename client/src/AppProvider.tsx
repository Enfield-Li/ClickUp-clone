import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthStateProvider from "./context/auth/AuthContext";
import GlobalStateProvider from "./context/global/GlobalContext";
import TaskDetailProvider from "./context/task_detail/TaskDetailContext";
import { globalTheme } from "./globalTheme";

type Props = { children: React.ReactNode };

export default function AppProvider({ children }: Props) {
  return (
    <BrowserRouter>
      <AuthStateProvider>
        <TaskDetailProvider>
          <GlobalStateProvider>
            <ColorModeScript />
            <ChakraProvider theme={globalTheme}>{children}</ChakraProvider>
          </GlobalStateProvider>
        </TaskDetailProvider>
      </AuthStateProvider>
    </BrowserRouter>
  );
}