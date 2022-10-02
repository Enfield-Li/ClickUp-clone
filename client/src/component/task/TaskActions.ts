import axios from "axios";
import { ACCESS_TOKEN, API_ENDPOINT, BEARER } from "../../utils/constant";
import { Task } from "./Data";

export async function createTask(task: Task) {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  const res = await axios.post<Task>(API_ENDPOINT.TASK_ENDPOINT, task, {
    withCredentials: true,
    headers: { Authorization: `${BEARER} ${accessToken}` },
  });

  console.log(res.data);
  return res.data;
}
