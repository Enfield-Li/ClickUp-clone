import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import {
  axiosAuthServiceInstance,
  axiosStatusCategoryServiceInstance,
  axiosTaskServiceInstance,
  axiosTeamServiceInstance,
} from "./AxiosInstance";
import { CreateTeamDTO } from "./component/createTeam/CreateTeam";
import { ACCESS_TOKEN, API_ENDPOINT, CLIENT_ROUTE } from "./constant";
import {
  AddStatusColumnDTO,
  AddStatusColumnResponseDTO,
  AuthActionType,
  AuthenticationResponse,
  AUTH_ACTION,
  CreateFolderDTO,
  CreateListDTO,
  CreateSpaceDTO,
  CreateStatusCategoryDTO,
  CreateStatusColumnDTO,
  CreateTeamResponseDTO,
  ErrorResponse,
  FieldErrors,
  FolderCategory,
  InitTeamListDTO,
  ListCategory,
  LoginUserDTO,
  RegisterUserDTO,
  RegistrationResponse,
  Space,
  StatusCategories,
  StatusCategory,
  Task,
  TaskEvents,
  TaskListStatusCategoryDTO,
  Team,
  UpdateStatusCategoryNameDTO,
  UpdateStatusColumnColorDTO,
  UpdateStatusColumnDTO,
  UpdateStatusColumnTitleDTO,
  UpdateTaskDescDTO,
  UpdateTasksPositionDTO,
  UpdateTaskTitleDTO,
} from "./types";
import { deepCopy } from "./utils/deepCopy";
import { getTaskBoardURL } from "./utils/getTaskBoardURL";

export async function updateUserDefaultTeamId(
  teamId: number,
  onSuccess?: () => void,
  onFailure?: () => void
) {
  try {
    await axiosAuthServiceInstance.put(API_ENDPOINT.AUTH + `/${teamId}`);

    onSuccess && onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function deleteSpace(
  spaceId: number,
  onSuccess?: () => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosTeamServiceInstance.delete<boolean>(
      API_ENDPOINT.SPACE + `/${spaceId}`
    );

    onSuccess && onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function deleteFolder(
  folderId: number,
  onSuccess?: () => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosTeamServiceInstance.delete<boolean>(
      API_ENDPOINT.FOLDER + `/${folderId}`
    );

    onSuccess && onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function deleteList(
  listId: number,
  onSuccess?: () => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosTeamServiceInstance.delete<boolean>(
      API_ENDPOINT.LIST + `/${listId}`
    );

    onSuccess && onSuccess();
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function createSpaceForTeam(
  dto: CreateSpaceDTO,
  onSuccess: (data: Space) => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosTeamServiceInstance.post<Space>(
      API_ENDPOINT.SPACE,
      dto
    );

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function createFolder(
  dto: CreateFolderDTO,
  onSuccess: (data: FolderCategory) => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosTeamServiceInstance.post<FolderCategory>(
      API_ENDPOINT.FOLDER,
      dto
    );

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function createList(
  dto: CreateListDTO,
  onSuccess: (data: ListCategory) => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosTeamServiceInstance.post<ListCategory>(
      API_ENDPOINT.LIST,
      dto
    );

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

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

    function initOrderedStatusCategories(StatusCategories: StatusCategories) {
      StatusCategories[0].isSelected = true;

      StatusCategories.forEach((category) =>
        category.statusColumns.sort((a, b) => a.orderIndex - b.orderIndex)
      );

      return StatusCategories;
    }

    onSuccess(initOrderedStatusCategories(response.data));
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function createStatusColumn(
  dto: CreateStatusColumnDTO,
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

export async function addStatusColumn(
  dto: AddStatusColumnDTO,
  onSuccess: (responseDTO: AddStatusColumnResponseDTO) => void,
  onFailure?: () => void
) {
  try {
    const response =
      await axiosStatusCategoryServiceInstance.post<AddStatusColumnResponseDTO>(
        API_ENDPOINT.STATUS_CATEGORY + "/add_column",
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

export async function updateStatusColumn(
  dto: UpdateStatusColumnDTO,
  onSuccess: () => void,
  onFailure?: () => void
) {
  try {
    const response = await axiosStatusCategoryServiceInstance.put<boolean>(
      API_ENDPOINT.STATUS_COLUMN,
      dto
    );
    if (!response.data) throw new Error("updateStatusColumn failed");

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
  dto: CreateStatusCategoryDTO,
  onSuccess: (data: StatusCategory) => void,
  onFailure?: () => void
) {
  try {
    const response =
      await axiosStatusCategoryServiceInstance.post<StatusCategory>(
        API_ENDPOINT.STATUS_CATEGORY,
        dto
      );

    onSuccess(response.data);
  } catch (error) {
    const err = error as AxiosError;
    const response = err.response?.data as ErrorResponse;
    console.log(response);
    onFailure && onFailure();
  }
}

export async function fetchTeamList(
  teamId: number,
  onSuccess: (initTeamListDTO: Team[]) => void,
  onFailure: (msg: string) => void
) {
  try {
    const response = await axiosTeamServiceInstance.get<Team[]>(
      API_ENDPOINT.TEAM + `/${teamId}`
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
  onSuccess: (data: RegistrationResponse) => void,
  onFailure: (msg: FieldErrors) => void
) {
  try {
    const response =
      await axiosAuthServiceInstance.post<RegistrationResponse>(
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

export function logOutUser() {
  // invalidate session
  axiosTaskServiceInstance.post(API_ENDPOINT.AUTH_LOGOUT);
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
  navigate: NavigateFunction,
  isAuthPath: boolean
) {
  try {
    const response =
      await axiosAuthServiceInstance.post<AuthenticationResponse>(
        API_ENDPOINT.AUTH_REFRESH_TOKEN
      );
    const { defaultTeamId, joinedTeamCount, accessToken } = response.data;

    // store accessToken to localStorage
    localStorage.setItem(ACCESS_TOKEN, accessToken);

    // update auth taskState
    dispatch({
      type: AUTH_ACTION.LOGIN_USER,
      payload: { user: response.data },
    });

    navigate(
      joinedTeamCount > 0 && defaultTeamId
        ? getTaskBoardURL({ teamId: defaultTeamId })
        : CLIENT_ROUTE.ON_BOARDING
    );
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);

    // clear local auth taskState and accessToken
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch({ type: AUTH_ACTION.LOGOUT_USER });
    const response = err.response?.data as ErrorResponse;

    if (!isAuthPath) navigate(CLIENT_ROUTE.LOGIN);
    toast({
      title: "Error!",
      description: response.message,
      status: "error",
    });
  }
}

export async function fetchTaskEvents(taskId: number) {
  try {
    const response = await axiosTaskServiceInstance.get<TaskEvents>(
      API_ENDPOINT.TASK_EVENT + `/${taskId}`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function deleteTask(taskId: number) {
  try {
    const response = await axiosTaskServiceInstance.delete<boolean>(
      API_ENDPOINT.TASK + `/${taskId}`
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
    const response = await axiosTaskServiceInstance.put<boolean>(
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
    const response = await axiosTaskServiceInstance.put<boolean>(
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
    const response = await axiosTaskServiceInstance.put<boolean>(
      API_ENDPOINT.TASK,
      deepCopy(updateTasksPositionDTO)
    );

    // return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function fetchAllTasks(
  listId: number,
  defaultStatusCategoryId: number
) {
  try {
    const params = new URLSearchParams({
      listId: String(listId),
      defaultStatusCategoryId: String(defaultStatusCategoryId),
    });

    const response =
      await axiosTaskServiceInstance.get<TaskListStatusCategoryDTO>(
        API_ENDPOINT.TASK + `?${params}`
      );

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function createTask(createTaskDTO: Task) {
  try {
    const res = await axiosTaskServiceInstance.post<Task>(
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
  onSuccess: (createTeamResponseDTO: Team) => void
) {
  try {
    const response = await axiosTeamServiceInstance.post<Team>(
      API_ENDPOINT.TEAM,
      createTeamDTO
    );

    onSuccess(response.data);
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
