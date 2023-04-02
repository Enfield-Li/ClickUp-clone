import produce from "immer";
import { create } from "zustand";
import { Task, TaskStateContext } from "../../types";

interface TaskDetailContextType {
  task: Task | null;
  isCreatingTask: boolean;
  selectTask: (task: Task) => void;
  taskStateContext: TaskStateContext | null;
  setCreatingTask: (isCreating: boolean) => void;
  initTaskStateContext: (dto: TaskStateContext | null) => void;
}

export const useTaskDetail = create<TaskDetailContextType>()((set) => ({
  task: null,
  isCreatingTask: false,
  taskStateContext: null,
  initTaskStateContext: (dto) =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.taskStateContext = dto;
      })
    ),
  setCreatingTask: (isCreating) =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.isCreatingTask = isCreating;
      })
    ),
  selectTask: (task) =>
    set((state) =>
      produce(state, (draftState) => {
        draftState.task = task;
      })
    ),
}));
