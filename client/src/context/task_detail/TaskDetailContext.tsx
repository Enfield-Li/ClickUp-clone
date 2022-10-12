import { useDisclosure } from "@chakra-ui/react";
import { createContext, useState } from "react";
import { Task } from "../../component/task/Data";
import {
  TaskDetailContextType,
  TaskUpdateInfo,
} from "./TaskDetailContextTypes";

export const GlobalContext = createContext({} as TaskDetailContextType);

type ProviderType = {
  children: React.ReactNode;
};

export default function TaskDetailProvider({ children }: ProviderType) {
  const [task, setTask] = useState<Task>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskUpdateInfo, setTaskUpdateInfo] = useState<TaskUpdateInfo>();

  return (
    <GlobalContext.Provider
      value={{
        task,
        setTask,
        isOpen,
        onOpen,
        onClose,
        taskUpdateInfo,
        setTaskUpdateInfo,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
