import {
  ColumnOptions,
  SetState,
  State,
  Task,
} from "../../component/task/Data";

export type SetTask = React.Dispatch<React.SetStateAction<Task | undefined>>;

export type TaskDetailContextType = {
  task: Task | undefined;
  setTask: SetTask;
  taskStateContext: TaskStateContext | undefined;
  setTaskStateContext: React.Dispatch<
    React.SetStateAction<TaskStateContext | undefined>
  >;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type TaskDetailStateType = {
  globalState: Task | undefined;
};

export type TaskStateContext = {
  setState: SetState;
  currentColumnId: number;
  columnOptions: ColumnOptions;
};
