import { axiosInstance } from "../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../utils/constant";
import { toPlainObject } from "../../utils/proxyToObject";
import { Task, TaskList, UpdateListTaskDTO } from "./Data";

export async function createTask(task: Task) {
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

export async function updateTasks(updateTaskListDto: UpdateListTaskDTO) {
  try {
    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK,
      toPlainObject(updateTaskListDto)
    );
  } catch (error) {
    console.log(error);
  }
}
