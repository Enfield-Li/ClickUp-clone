export function handleDeleteTask() {
  //   let taskListForUpdate: TaskList = [];
  //   setTaskState(
  //     (prev) =>
  //       prev &&
  //       task &&
  //       produce(prev, (draftState) => {
  //         const columns: (keyof PreviousTaskIds)[] = [
  //           "inStatus",
  //           "inDueDate",
  //           "inPriority",
  //         ];
  //         for (const column of columns) {
  //           draftState.orderedTasks.forEach((tasks) => {
  //             tasks.taskList.forEach((currentTask, index, currentArray) => {
  //               const sourceTaskAfter = currentTask;
  //               const isSourceTaskAfter =
  //                 sourceTaskAfter.previousTaskIds[column] === task.id;
  //               // assign new previousTaskIds for sourceTaskAfter
  //               if (isSourceTaskAfter) {
  //                 sourceTaskAfter.previousTaskIds[column] =
  //                   task.previousTaskIds[column];
  //                 // push to the taskListForUpdate
  //                 const sourceTaskAfterExist = taskListForUpdate.find(
  //                   (task) => task.id === sourceTaskAfter.id
  //                 );
  //                 if (!sourceTaskAfterExist) {
  //                   taskListForUpdate.push(deepCopy(sourceTaskAfter));
  //                 } else if (sourceTaskAfterExist) {
  //                   taskListForUpdate = deepCopy(
  //                     taskListForUpdate.map((taskForUpdate) =>
  //                       taskForUpdate.id === sourceTaskAfter.id
  //                         ? sourceTaskAfter
  //                         : taskForUpdate
  //                     )
  //                   );
  //                 }
  //               }
  //             });
  //           });
  //           // Delete sourceTask from taskState
  //           // https://stackoverflow.com/a/24813338/16648127
  //           draftState.orderedTasks.forEach((tasks) => {
  //             tasks.taskList.forEach(
  //               (currentTask, index, currentArray) =>
  //                 currentTask.id === task.id && currentArray.splice(index, 1)
  //             );
  //           });
  //         }
  //       })
  //   );
  //   deleteTask(task!.id!, taskListForUpdate);
  //   // Close modal and navigate back
  //   onModalClose();
  //   navigate(CLIENT_ROUTE.TASK);
}
