import { useDisclosure } from "@chakra-ui/react";
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
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskStateContext, setTaskStateContext] =
    useState<TaskStateContext | null>(null);

  const modalState = { isModalOpen, onModalOpen, onModalClose };
  return (
    <TaskDetailContext.Provider
      value={{
        task,
        setTask,
        modalState,
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
