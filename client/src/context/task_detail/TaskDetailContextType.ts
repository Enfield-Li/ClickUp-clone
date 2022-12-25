import { ColumnOptions, SetTaskState, SortBy, Task } from "../../types";

export type TaskDetailContextType = {
  task: Task | null;
  modalState: ModalState;
  taskStateContext: TaskStateContext | null;
  setTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setTaskStateContext: React.Dispatch<
    React.SetStateAction<TaskStateContext | null>
  >;
};

export type ModalState = {
  isModalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
};

export type TaskStateContext = {
  sortBy: SortBy;
  currentListId: number;
  setTaskState: SetTaskState;
  columnOptions: ColumnOptions;
};
