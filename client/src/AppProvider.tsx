import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import React, { memo } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthStateProvider from "./context/auth/AuthContext";
import TaskDetailProvider from "./context/task_detail/TaskDetailContext";
import { globalTheme } from "./globalTheme";

type Props = { children: React.ReactNode };

export default memo(AppProvider);
function AppProvider({ children }: Props) {
  return (
    <BrowserRouter>
      <AuthStateProvider>
        <TaskDetailProvider>
          <ColorModeScript />
          <ChakraProvider theme={globalTheme}>{children}</ChakraProvider>
        </TaskDetailProvider>
      </AuthStateProvider>
    </BrowserRouter>
  );
}
