import { Columns, OrderedTasks, SortBy, TaskList } from "./Data";

export const lookUpId = {
  status: "statusId",
  priority: "priorityId",
  dueDate: "dueDateId",
} as const;

/* 
  Convert unordered Task[] list to ordered nested Task[][] list group by for example task.priorityId:
  Find all sorting occurrences,
    and, based on the id, generate respective nested list for that id, 
    for example:
      from:
        status column data: 
          [
            { id: 1, title: "TO DO" },
            { id: 2, title: "IN PROGRESS" },
            { id: 3, title: "DONE" },
          ],
        with task data:
          {
            id: 111,
            title: "11111",
            status: 1,
            priority: 2,
            dueDate: 1,
            previousItem: {},
          },
          {
            id: 222,
            title: "22222",
            status: 1,
            priority: 1,
            dueDate: 1,
            previousItem: { statusId: 111, dueDateId: 111 },
          },
      to:
        [
          [{
            id: 111,
            title: "11111",
            status: 1,
            priority: 2,
            dueDate: 1,
            previousItem: {},
          }],
          [{
            "id": 222,
            "title": "22222",
            "status": 1,
            "priority": 1,
            "dueDate": 1,
            "previousItem": {
              "statusId": 111,
              "dueDateId": 111
            }
          }]
        ]
*/
export function processTaskBasedOnSortBy(
  tasks: TaskList,
  columns: Columns,
  sortBy: SortBy
) {
  const nestedTasks: OrderedTasks = [];

  for (let i = 0; i < columns.length; i++) {
    nestedTasks[i] = [];

    const element = columns[i];
    const stageId = element.id;

    // add the first item by initializing the first task in the list with, for example, previousItem.statusId === undefined
    for (let j = 0; j < tasks.length; j++) {
      const task = tasks[j];

      if (task[sortBy] === stageId && !task.previousItem[lookUpId[sortBy]]) {
        nestedTasks[i][0] = task;
      }
    }

    // pushing the entailing task based on, for example, previousItem.statusId
    for (let k = 0; k < nestedTasks[i].length; k++) {
      const currentTask = nestedTasks[i][k];

      const entailingTask = tasks.find((task) => {
        return task.previousItem[lookUpId[sortBy]] === currentTask.id;
      });

      if (entailingTask) nestedTasks[i].push(entailingTask);
    }
  }

  return nestedTasks;
}
