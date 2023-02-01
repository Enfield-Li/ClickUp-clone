import { useToast } from "@chakra-ui/react";
import { TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { memo, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ApplicationEntry from "./ApplicationEntry";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import CreateTeam from "./component/createTeam/CreateTeam";
import Home from "./component/layout/Home";
import UnderConstruction from "./component/layout/UnderConstruction";
import TaskView from "./component/task/TaskView";
import TestDev from "./component/test-dev/TestDev";
import { ACCESS_TOKEN, CLIENT_ROUTE } from "./constant";
import useAuthContext from "./context/auth/useAuthContext";
import { refreshUserToken } from "./networkCalls";
import { convertUTCDateToLocalDate } from "./utils/convertUTCDateToLocalDate";
import MaterialTheme from "./utils/MaterialTheme";

export default memo(App);
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, authDispatch } = useAuthContext();
  const toast = useToast({ duration: 3000, isClosable: true });

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    const isAuthPath =
      location.pathname === CLIENT_ROUTE.REGISTER ||
      location.pathname === CLIENT_ROUTE.LOGIN;

    if (accessToken) {
      refreshUserToken(authDispatch, toast, navigate, isAuthPath);

      intervalId = setInterval(() => {
        refreshUserToken(authDispatch, toast, navigate, isAuthPath);
      }, 1790000); // 29 min and 50 sec
    } else if (!isAuthPath && !accessToken) {
      navigate(CLIENT_ROUTE.LOGIN);
    }

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (
      authState.user &&
      !authState.user.defaultTeamId &&
      !authState.user.joinedTeamCount
    ) {
      navigate(CLIENT_ROUTE.ON_BOARDING);
    }
  }, [authState.user]);

  return (
    <Routes>
      <Route path={CLIENT_ROUTE.LOGIN} element={<Login />} />
      <Route path={CLIENT_ROUTE.REGISTER} element={<Register />} />
      <Route path={CLIENT_ROUTE.ON_BOARDING} element={<CreateTeam />} />

      <Route path="/:teamId" element={<ApplicationEntry />}>
        <Route path="*" element={<UnderConstruction />} />
        <Route path={CLIENT_ROUTE.HOME} element={<Home />} />
        <Route path={CLIENT_ROUTE.TEST_DEV} element={<TestDev />} />

        {/* https://stackoverflow.com/questions/70005601/alternate-way-for-optional-parameters-in-v6 */}
        <Route path={CLIENT_ROUTE.TASK_BOARD} element={<TaskView />} />
        <Route
          path={CLIENT_ROUTE.TASK_BOARD + "/:spaceId"}
          element={<TaskView />}
        />
        <Route
          path={CLIENT_ROUTE.TASK_BOARD + "/:spaceId/:listId"}
          element={<TaskView />}
        />
      </Route>
    </Routes>
  );
}

// function App() {
//   const [value, setValue] = useState<Date | null>(null);

//   function handleDatePicker(newValue: Date) {
//     if (value === null) {
//       newValue = convertUTCDateToLocalDate(newValue);
//     }
//     console.log("new: ", new Date(newValue).toISOString());
//     console.log("new: ", new Date(newValue).getDate());

//     setValue(newValue);
//   }

//   return (
//     <MaterialTheme>
//       <StaticDatePicker
//         value={value}
//         displayStaticWrapperAs="desktop"
//         renderInput={(params) => <TextField {...params} />}
//         onChange={(newValue) => newValue && handleDatePicker(newValue)}
//       />
//       <button onClick={() => setValue(null)}>clear</button>
//     </MaterialTheme>
//   );
// }
