import { useContext } from "react";
import { taskDetailContext } from "./TaskDetailContext";

export default function useTaskDetailContext() {
  const context = useContext(taskDetailContext);
  if (!context) {
    throw new Error(
      "useTaskDetailContext must be used within a taskDetailContextProvider"
    );
  }
  return context;
}
