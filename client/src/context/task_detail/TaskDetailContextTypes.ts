import { ColumnOptions, SetState, Task } from "../../component/task/Data";

export type SetTask = React.Dispatch<React.SetStateAction<Task | undefined>>;

export type TaskDetailContextType = {
  task?: Task;
  setTask: SetTask;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  taskStateContext: TaskStateContext | undefined;
  setTaskStateContext: React.Dispatch<
    React.SetStateAction<TaskStateContext | undefined>
  >;
};

export type TaskDetailStateType = {
  globalState: Task | undefined;
};

export type TaskStateContext = {
  setState: SetState;
  columnOptions: ColumnOptions;
};
