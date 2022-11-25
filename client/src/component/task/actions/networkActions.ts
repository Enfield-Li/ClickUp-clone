import { AxiosError } from "axios";
import { axiosInstance } from "../../../utils/AxiosInterceptor";
import { deepCopy } from "../../../utils/deepCopy";
import {
  Task,
  TaskEvents,
  TaskList,
  UpdateTaskDescDTO,
  UpdateTasksPositionDTO,
  UpdateTaskTitleDTO,
} from "../../../types";
import { API_ENDPOINT } from "../../../constant";

export async function getTasks() {}

export async function deleteTask(taskId: number, taskListForUpdate: TaskList) {
  try {
    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK + `/${taskId}`,
      deepCopy(taskListForUpdate)
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function fetchTaskEvents(taskId: number) {
  try {
    const response = await axiosInstance.get<TaskEvents>(
      API_ENDPOINT.TASK_EVENT + `/${taskId}`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function createTask(task: Task) {
  try {
    const res = await axiosInstance.post<Task>(API_ENDPOINT.TASK, task);

    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function fetchAllTasks(errorHandler: () => void) {
  try {
    const response = await axiosInstance.get<TaskList>(
      API_ENDPOINT.TASK_ALL_TASKS
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
    errorHandler();
  }
}

export async function updateTasksPosition(
  updateTasksPositionDTO: UpdateTasksPositionDTO
) {
  try {
    const response = await axiosInstance.put<boolean>(
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

export async function updateTaskTitle(updateTaskTitleDTO: UpdateTaskTitleDTO) {
  try {
    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK_UPDATE_TITLE,
      updateTaskTitleDTO
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateTaskDescription(
  updateTaskDescDTO: UpdateTaskDescDTO
) {
  try {
    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK_UPDATE_DESC,
      updateTaskDescDTO
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function createComment() {}

export async function assignTask() {}

export async function addAssignee() {}

export async function addWatcher() {}
