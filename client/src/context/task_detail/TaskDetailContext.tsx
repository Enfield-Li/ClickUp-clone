import { useDisclosure } from "@chakra-ui/react";
import { createContext, useState } from "react";
import { Task } from "../../component/task/Data";
import {
  TaskDetailContextType,
  TaskStateContext,
} from "./TaskDetailContextTypes";

export const GlobalContext = createContext({} as TaskDetailContextType);

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
    <GlobalContext.Provider
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
    </GlobalContext.Provider>
  );
}
