import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthStateProvider from "./context/auth/AuthContext";
import GlobalStateProvider from "./context/global/GlobalContext";
import { ChakraProvider, theme } from "@chakra-ui/react";
import TaskDetailProvider from "./context/task_detail/TaskDetailContext";
// import reportWebVitals from "./reportWebVitals"
// import * as serviceWorker from "./serviceWorker"

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
            <ChakraProvider theme={theme}>
              <App />
            </ChakraProvider>
          </GlobalStateProvider>
        </TaskDetailProvider>
      </AuthStateProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
