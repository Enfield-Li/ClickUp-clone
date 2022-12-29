import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import { CreateTeamDTO } from "./component/onboarding/CreateTeam";
import { ACCESS_TOKEN, API_ENDPOINT, CLIENT_ROUTE } from "./constant";
import {
  AuthActionType,
  AuthenticationResponse,
  AUTH_ACTION,
  ErrorResponse,
  FieldErrors,
  InitTeamDTO,
  LoginUserDTO,
  RegisterUserDTO,
  Task,
  TaskEvents,
  TaskList,
  UpdateTaskDescDTO,
  UpdateTasksPositionDTO,
  UpdateTaskTitleDTO,
} from "./types";
import {
  axiosAuthServiceInstance,
  axiosGatewayInstance,
  axiosTeamServiceInstance,
} from "./utils/AxiosInterceptor";
import { deepCopy } from "./utils/deepCopy";

export async function fetchTeamList(
  onSuccess: (data: InitTeamDTO) => void,
  onFailure: (msg: string) => void
) {
  try {
    const response = await axiosTeamServiceInstance.get<InitTeamDTO>(
      API_ENDPOINT.TEAM
    );

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure(response.message);
  }
}

export async function registerUser(
  registerCredentials: RegisterUserDTO,
  onSuccess: (data: AuthenticationResponse) => void,
  onFailure: (msg: FieldErrors) => void
) {
  try {
    const response =
      await axiosAuthServiceInstance.post<AuthenticationResponse>(
        API_ENDPOINT.AUTH_REGISTER,
        registerCredentials
      );

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    onFailure(response.errors);
  }
}

export async function loginUser(
  loginUserDTO: LoginUserDTO,
  onSuccess: (data: AuthenticationResponse) => void,
  onFailure: (msg: FieldErrors) => void
) {
  try {
    const response =
      await axiosAuthServiceInstance.post<AuthenticationResponse>(
        API_ENDPOINT.AUTH_LOGIN,
        loginUserDTO
      );

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    onFailure(response.errors);
  }
}

export async function refreshUserToken(
  dispatch: React.Dispatch<AuthActionType>,
  toast: (options?: UseToastOptions | undefined) => ToastId,
  navigate: NavigateFunction
) {
  try {
    const response =
      await axiosAuthServiceInstance.post<AuthenticationResponse>(
        API_ENDPOINT.AUTH_REFRESH_TOKEN
      );

    // store accessToken to localStorage
    localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);

    // update auth taskState
    dispatch({
      type: AUTH_ACTION.LOGIN_USER,
      payload: { user: response.data },
    });
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);

    // clear local auth taskState and accessToken
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({ type: AUTH_ACTION.LOGOUT_USER });

    navigate(CLIENT_ROUTE.LOGIN);
    toast({
      title: "Error!",
      description: err.response?.data as string,
      status: "error",
    });
  }
}

export async function fetchTaskEvents(taskId: number) {
  try {
    const response = await axiosGatewayInstance.get<TaskEvents>(
      API_ENDPOINT.TASK_EVENT + `/${taskId}`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function deleteTask(taskId: number, taskListForUpdate: TaskList) {
  try {
    const response = await axiosGatewayInstance.put<boolean>(
      API_ENDPOINT.TASK + `/${taskId}`,
      deepCopy(taskListForUpdate)
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function updateTaskDescription(
  updateTaskDescDTO: UpdateTaskDescDTO
) {
  try {
    const response = await axiosGatewayInstance.put<boolean>(
      API_ENDPOINT.TASK_UPDATE_DESC,
      updateTaskDescDTO
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateTaskTitle(updateTaskTitleDTO: UpdateTaskTitleDTO) {
  try {
    const response = await axiosGatewayInstance.put<boolean>(
      API_ENDPOINT.TASK_UPDATE_TITLE,
      updateTaskTitleDTO
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateTasksPosition(
  updateTasksPositionDTO: UpdateTasksPositionDTO
) {
  try {
    const response = await axiosGatewayInstance.put<boolean>(
      API_ENDPOINT.TASK,
      deepCopy(updateTasksPositionDTO)
    );
    console.log({ data: response.data });

    // return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function fetchAllTasks(listId: number) {
  try {
    const response = await axiosGatewayInstance.get<TaskList>(
      API_ENDPOINT.TASK_ALL_TASKS + `/${listId}`
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function createTask(createTaskDTO: Task) {
  try {
    const res = await axiosGatewayInstance.post<Task>(
      API_ENDPOINT.TASK,
      createTaskDTO
    );

    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function createTeam(
  createTeamDTO: CreateTeamDTO,
  onSuccess: () => void
) {
  try {
    const response = await axiosTeamServiceInstance.post<boolean>(
      API_ENDPOINT.TEAM,
      createTeamDTO
    );

    onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function getTasks() {}

export async function createComment() {}

export async function assignTask() {}

export async function addAssignee() {}

export async function addWatcher() {}