import { useContext } from "react";
import { TaskDetailContext } from "./TaskDetailContext";

export default function useTaskDetailContext() {
  return useContext(TaskDetailContext);
}
