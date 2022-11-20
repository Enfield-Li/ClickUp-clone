import { useDisclosure } from "@chakra-ui/react";
import { createContext, useState } from "react";
import { Task } from "../../types";
import {
  TaskDetailContextType,
  TaskStateContext,
} from "./TaskDetailContextTypes";

export const taskDetailContext = createContext<TaskDetailContextType | null>(
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
  const modalState = { isModalOpen, onModalOpen, onModalClose };
  const [taskStateContext, setTaskStateContext] =
    useState<TaskStateContext | null>(null);

  return (
    <taskDetailContext.Provider
      value={{
        task,
        setTask,
        modalState,
        taskStateContext,
        setTaskStateContext,
      }}
    >
      {children}
    </taskDetailContext.Provider>
  );
}
