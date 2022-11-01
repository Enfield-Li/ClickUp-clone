import { AxiosError } from "axios";
import { axiosInstance } from "../../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../../utils/constant";
import { deepCopy } from "../../../utils/deepCopy";
import {
  Task,
  TaskEvents,
  TaskList,
  UpdateTaskDescDTO,
  UpdateTasksPositionDTO,
  UpdateTaskTitleDTO,
} from "../taskTypes";

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

export async function fetchAllTasks() {
  try {
    const response = await axiosInstance.get<TaskList>(
      API_ENDPOINT.TASK_ALL_TASKS
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.log(err);
  }
}

export async function updateTasksPosition(
  updateTasksPositionDTO: UpdateTasksPositionDTO
) {
  console.log(deepCopy(updateTasksPositionDTO));
  try {
    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK,
      deepCopy(updateTasksPositionDTO)
    );

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
