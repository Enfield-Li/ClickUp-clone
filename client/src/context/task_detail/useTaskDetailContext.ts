import { useContext } from "react";
import { TaskDetailContext } from "./TaskDetailContext";

export default function useTaskDetailContext() {
  const context = useContext(TaskDetailContext);
  if (!context) {
    throw new Error(
      "useTaskDetailContext must be used within a taskDetailContextProvider"
    );
  }
  return context;
}
