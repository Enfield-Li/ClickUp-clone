import { axiosInstance } from "../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../utils/constant";
import { Task, TaskList } from "./Data";

export async function createTask(task: Task) {
  const res = await axiosInstance.post<Task>(API_ENDPOINT.TASK_ENDPOINT, task, {
    withCredentials: true,
  });

  return res.data;
}

export async function getAllTasks() {
  try {
    const response = await axiosInstance.get<TaskList>(
      API_ENDPOINT.TASK_ENDPOINT_ALL_TASKS
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
