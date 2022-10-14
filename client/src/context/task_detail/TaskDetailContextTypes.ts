import { SetState, State, Task } from "../../component/task/Data";

export type SetTask = React.Dispatch<React.SetStateAction<Task | undefined>>;

export type TaskDetailContextType = {
  task: Task | undefined;
  setTask: SetTask;
  taskUpdateInfo: TaskUpdateInfo | undefined;
  setTaskUpdateInfo: React.Dispatch<
    React.SetStateAction<TaskUpdateInfo | undefined>
  >;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type TaskDetailStateType = {
  globalState: Task | undefined;
};

export type TaskUpdateInfo = {
  state: State;
  setState: SetState;
  currentColumnId: number;
};
