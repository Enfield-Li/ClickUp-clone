import React, { useContext } from "react";
import { GlobalContext as TaskDetailContext } from "./TaskDetailContext";

export default function useTaskDetailContext() {
  return useContext(TaskDetailContext);
}
