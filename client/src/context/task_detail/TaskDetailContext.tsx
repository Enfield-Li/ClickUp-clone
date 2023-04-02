import { createContext, useState } from "react";
import { Task, TaskDetailContextType, TaskStateContext } from "../../types";

export const TaskDetailContext = createContext<TaskDetailContextType | null>(
  null
);

type ProviderType = {
  children: React.ReactNode;
};

export default function TaskDetailProvider({ children }: ProviderType) {
  const [task, setTask] = useState<Task | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskStateContext, setTaskStateContext] =
    useState<TaskStateContext | null>(null);

  return (
    <TaskDetailContext.Provider
      value={{
        task,
        setTask,
        isCreatingTask,
        taskStateContext,
        setIsCreatingTask,
        setTaskStateContext,
      }}
    >
      {children}
    </TaskDetailContext.Provider>
  );
}
