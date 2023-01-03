import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import { CreateTeamDTO } from "./component/onboarding/CreateTeam";
import { ACCESS_TOKEN, API_ENDPOINT, CLIENT_ROUTE } from "./constant";
import {
  AuthActionType,
  AuthenticationResponse,
  AUTH_ACTION,
  CreateStatusColumnForCategoryDTO,
  ErrorResponse,
  FieldErrors,
  InitTeamDTO,
  LoginUserDTO,
  RegisterUserDTO,
  StatusCategories,
  StatusCategory,
  Task,
  TaskEvents,
  TaskList,
  UpdateStatusCategoryNameDTO,
  UpdateStatusColumnColorDTO,
  UpdateStatusColumnTitleDTO,
  UpdateTaskDescDTO,
  UpdateTasksPositionDTO,
  UpdateTaskTitleDTO,
} from "./types";
import {
  axiosAuthServiceInstance,
  axiosGatewayInstance,
  axiosStatusCategoryServiceInstance,
  axiosTeamServiceInstance,
} from "./AxiosInstance";
import { deepCopy } from "./utils/deepCopy";

export async function fetchTeamStatusCategories(
  teamId: number,
  onSuccess: (data: StatusCategories) => void,
  onFailure?: () => void
) {
  try {
    const response =
      await axiosStatusCategoryServiceInstance.get<StatusCategories>(
        API_ENDPOINT.STATUS_CATEGORY + `/${teamId}`
      );

    response.data[0].isSelected = true;
    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function CreateStatusColumnForCategory(
  dto: CreateStatusColumnForCategoryDTO,
  onSuccess: (id: number) => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosStatusCategoryServiceInstance.post<number>(
      API_ENDPOINT.STATUS_COLUMN,
      dto
    );
    if (!response.data) throw new Error("CreateStatusColumnForCategory failed");

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function deleteStatusCategories(
  statusCategoryId: number,
  onSuccess: () => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosStatusCategoryServiceInstance.delete<boolean>(
      API_ENDPOINT.STATUS_CATEGORY + `/${statusCategoryId}`
    );
    if (!response.data) throw new Error("deleteStatusCategories failed");

    onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function deleteStatusColumn(
  statusColumnId: number,
  onSuccess: () => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosStatusCategoryServiceInstance.delete<boolean>(
      API_ENDPOINT.STATUS_COLUMN + `/${statusColumnId}`
    );
    if (!response.data) throw new Error("deleteStatusCategories failed");

    onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function updateStatusColumnColor(
  dto: UpdateStatusColumnColorDTO,
  onSuccess: () => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosStatusCategoryServiceInstance.put<boolean>(
      API_ENDPOINT.STATUS_COLUMN + "/color",
      dto
    );
    if (!response.data) throw new Error("updateStatusColumnColor failed");

    onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function updateStatusColumnTitle(
  dto: UpdateStatusColumnTitleDTO,
  onSuccess: () => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosStatusCategoryServiceInstance.put<boolean>(
      API_ENDPOINT.STATUS_COLUMN + "/title",
      dto
    );
    if (!response.data) throw new Error("updateStatusColumnTitle failed");

    onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function updateStatusCategoryName(
  dto: UpdateStatusCategoryNameDTO,
  onSuccess: () => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosStatusCategoryServiceInstance.put<boolean>(
      API_ENDPOINT.STATUS_CATEGORY + "/name",
      dto
    );
    if (!response.data) throw new Error("updateStatusCategoryName failed");

    onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function createStatusCategory(
  statusCategory: StatusCategory,
  onSuccess: (data: StatusCategory) => void
  //   onFailure?: (msg: string) => void
) {
  try {
    const response =
      await axiosStatusCategoryServiceInstance.post<StatusCategory>(
        API_ENDPOINT.STATUS_CATEGORY,
        statusCategory
      );

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
  }
}

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

export function logOutUser(
  dispatch: React.Dispatch<AuthActionType>,
  toast: (options?: UseToastOptions | undefined) => ToastId
) {
  // invalidate session
  axiosGatewayInstance.post(API_ENDPOINT.AUTH_LOGOUT, null);

  // clear local auth taskState and accessToken
  localStorage.removeItem(ACCESS_TOKEN);
  dispatch({ type: AUTH_ACTION.LOGOUT_USER });

  toast({
    title: "Successful!",
    description: "You've logged out.",
    status: "success",
  });
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
    const response = err.response?.data as ErrorResponse;

    navigate(CLIENT_ROUTE.LOGIN);
    toast({
      title: "Error!",
      description: response.message,
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
