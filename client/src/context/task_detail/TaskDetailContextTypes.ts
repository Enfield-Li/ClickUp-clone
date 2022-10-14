import { SetState, State, Task } from "../../component/task/Data";

export type SetTask = React.Dispatch<React.SetStateAction<Task | undefined>>;

export type TaskDetailContextType = {
  task: Task | undefined;
  setTask: SetTask;
  taskDetails: TaskDetails | undefined;
  setTaskDetails: React.Dispatch<React.SetStateAction<TaskDetails | undefined>>;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type TaskDetailStateType = {
  globalState: Task | undefined;
};

export type TaskDetails = {
  state: State;
  setState: SetState;
  currentColumnId: number;
};
