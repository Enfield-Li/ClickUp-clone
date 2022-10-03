import { axiosInstance } from "../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../utils/constant";
import { Task } from "./Data";

export async function createTask(task: Task) {
  const res = await axiosInstance.post<Task>(API_ENDPOINT.TASK_ENDPOINT, task, {
    withCredentials: true,
  });

  return res.data;
}
