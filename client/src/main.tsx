import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import { globalTheme } from "./globalTheme";
import { BrowserRouter } from "react-router-dom";
import AuthStateProvider from "./context/auth/AuthContext";
import GlobalStateProvider from "./context/global/GlobalContext";
import TaskDetailProvider from "./context/task_detail/TaskDetailContext";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthStateProvider>
        <TaskDetailProvider>
          <GlobalStateProvider>
            <ColorModeScript />
            <ChakraProvider theme={globalTheme}>
              <App />
            </ChakraProvider>
          </GlobalStateProvider>
        </TaskDetailProvider>
      </AuthStateProvider>
    </BrowserRouter>
  </React.StrictMode>
);
