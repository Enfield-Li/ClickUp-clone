import { useDisclosure } from "@chakra-ui/react";
import { createContext, useState } from "react";
import { Task } from "../../component/task/taskTypes";
import {
  TaskDetailContextType,
  TaskStateContext,
} from "./TaskDetailContextTypes";

export const TaskDetailContext = createContext({} as TaskDetailContextType);

type ProviderType = {
  children: React.ReactNode;
};

export default function TaskDetailProvider({ children }: ProviderType) {
  const [task, setTask] = useState<Task>();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [taskStateContext, setTaskStateContext] = useState<TaskStateContext>();

  return (
    <TaskDetailContext.Provider
      value={{
        task,
        setTask,
        isModalOpen,
        onModalOpen,
        onModalClose,
        taskStateContext,
        setTaskStateContext,
      }}
    >
      {children}
    </TaskDetailContext.Provider>
  );
}
