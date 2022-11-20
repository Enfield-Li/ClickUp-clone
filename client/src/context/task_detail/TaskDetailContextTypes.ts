import { ColumnOptions, SetTaskState, SortBy, Task } from "../../types";

export type SetTask = React.Dispatch<React.SetStateAction<Task | undefined>>;

export type TaskDetailContextType = {
  task?: Task;
  setTask: SetTask;
  isModalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
  taskStateContext: TaskStateContext | undefined;
  setTaskStateContext: React.Dispatch<
    React.SetStateAction<TaskStateContext | undefined>
  >;
};

export type TaskStateContext = {
  sortBy: SortBy;
  setTaskState: SetTaskState;
  columnOptions: ColumnOptions;
};
