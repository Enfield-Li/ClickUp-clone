import { axiosInstance } from "../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../utils/constant";
import { Task, TaskList, UpdateTaskDTO } from "./Data";

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

export async function updateTasks(taskList: UpdateTaskDTO) {
  try {
    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK,
      taskList
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
