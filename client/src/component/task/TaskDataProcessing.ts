import { Columns, ColumnType, InitialData, OrderedTasks, SortBy } from "./Data";

export const lookUp = {
  status: "statusId",
  priority: "priorityId",
  dueDate: "dueDateId",
} as const;

/* 
  Convert unordered Task[] to ordered nested Task[][] array group by task.stage:
  [
    [task1, task2], // <- task with stage 1 and ordered by previousId
    [task3, task4] // <- task with stage 2 and ordered by previousId
  ]
*/
export function processTaskBasedOnStage(
  data: InitialData,
  columns: Columns,
  sortBy: SortBy
) {
  const tasks = data.tasks;

  const idArr: number[] = [];
  const nestedTasks: OrderedTasks = [];

  // find all stages and collect it into "taskStageArr"
  for (let i = 0; i < columns.length; i++) {
    const element = columns[i];
    idArr.push(element.id);
    nestedTasks[i] = [];
  }

  // forming a nested structure from type Task[] to Task[][]
  for (let i = 0; i < idArr.length; i++) {
    const stageId = idArr[i];

    // add the first item by initializing the first task in the array with previousId === undefined
    for (let j = 0; j < tasks.length; j++) {
      const task = tasks[j];

      if (task.status === stageId && !task.previousItem?.[lookUp[sortBy]]) {
        nestedTasks[i][0] = task;
      }
    }

    // pushing the entailing task based on previousId
    for (let j = 0; j < nestedTasks[i].length; j++) {
      const currentTask = nestedTasks[i][j];

      const entailingTask = tasks.find((task) => {
        // console.log(task.previousItem?.[lookUp[sortBy]]);
        return task.previousItem?.[lookUp[sortBy]] === currentTask.id;
      });

      if (entailingTask) nestedTasks[i].push(entailingTask);
    }
  }
  console.log("nestedTasks: ", nestedTasks)

  return nestedTasks;
}
