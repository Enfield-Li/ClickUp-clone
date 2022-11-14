import {
  lookUpPreviousTaskId,
  SetState,
  SortBy,
  State,
  TargetColumn,
  Task,
  UndeterminedColumn,
} from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import {
  getDueDateFromExpectedDueDate,
  updatePreviousIdsInColumn,
} from "./taskProcessing";

export type NewTask = {
  title: string;
  expectedDueDate?: Date;
  priority: number | null;
};

export async function createNewTask(
  newTaskInput: NewTask,
  state: State,
  currentColumn: UndeterminedColumn,
  sortBy: SortBy,
  setState: SetState
) {
  // Prepare newTask
  const { title, expectedDueDate, priority } = newTaskInput;

  const newTask: Task = {
    id: Math.random(),
    title,
    expectedDueDate,
    previousTaskIds: {},
    taskEvents: [],
    watchers: [],
    assignees: [],
    subTasks: [],
  };

  // default setting with no setting and override by below
  const targetColumn: TargetColumn = {
    priority: "1",
    dueDate: "1",
    status: "1",
  };

  if (priority) targetColumn.priority = String(priority);
  if (expectedDueDate) {
    newTask.expectedDueDate = new Date(expectedDueDate);

    const dueDateColumnId = getDueDateFromExpectedDueDate(
      state.columnOptions.dueDate,
      expectedDueDate
    );

    targetColumn.dueDate = String(dueDateColumnId);
  }

  updatePreviousIdsInColumn(state, targetColumn, newTask);

  // Updates for newTask's previousItem for current sortBy
  const currentOrderedTasks = state.orderedTasks.find(
    (task) => task.id === currentColumn.id
  );

  const currentTaskList = currentOrderedTasks?.taskList;
  const currentTaskArrLength = currentTaskList?.length;

  const previousTaskId = currentTaskArrLength
    ? currentTaskList?.[currentTaskArrLength - 1].id
    : undefined;

  newTask[sortBy] = currentColumn.id;
  newTask.previousTaskIds[lookUpPreviousTaskId[sortBy]] = previousTaskId;

  //   const newTaskData = await createTask(newTask);
  // Update state
  setState((previousState) => {
    // Deep copy
    const copiedState = deepCopy(previousState) as State;

    // Push newTask to current column array
    const taskArr = copiedState.orderedTasks.find(
      (task) => task.id === currentColumn.id
    );
    // if (newTaskData) {
    //   newTaskData.taskEvents = [];
    //   taskArr?.taskList.push(newTaskData);
    // }
    taskArr?.taskList.push(newTask);

    return copiedState;
  });
}
