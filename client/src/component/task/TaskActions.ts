import { axiosInstance } from "../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../utils/constant";
import { toPlainObject } from "../../utils/proxyToObject";
import { Task, TaskList, UpdateTasksPositionDTO } from "./taskTypes";

export async function createTask(task: Task) {
  console.log({ task });
  try {
    const res = await axiosInstance.post<Task>(API_ENDPOINT.TASK, task);

    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTasks() {
  try {
    const response = await axiosInstance.get<TaskList>(
      API_ENDPOINT.TASK_ALL_TASKS
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateTasksPosition(
  updateTasksPositionDTO: UpdateTasksPositionDTO
) {
  console.log({ updateTaskPositionDTO: toPlainObject(updateTasksPositionDTO) });
  try {
    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK,
      toPlainObject(updateTasksPositionDTO)
    );
  } catch (error) {
    console.log(error);
  }
}

export async function createComment() {}

export async function assignTask() {}

export async function addAssignee() {}

export async function addWatcher() {}
