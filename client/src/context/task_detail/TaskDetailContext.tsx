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
  const [task, setTask] = useState<Task>();
  console.log("task in context: ", task);
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [taskStateContext, setTaskStateContext] = useState<TaskStateContext>();

  return (
    <taskDetailContext.Provider
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
    </taskDetailContext.Provider>
  );
}
