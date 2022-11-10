import { Center, Tooltip } from "@chakra-ui/react";
import React from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { ColumnOptions, StatusColumn, Task } from "../../../types";

type Props = {
  task: Task;
  setShowSubTask: React.Dispatch<React.SetStateAction<boolean>>;
};
type StatusTask = { id: number; color: string; amount: number; name: string };

export default function SubTaskIcons({ task, setShowSubTask }: Props) {
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions } = taskStateContext!;

  function getStatusArr(task: Task, columnOptions: ColumnOptions) {
    const statusTaskList: StatusTask[] = [];

    task.subTasks.forEach((subTask) => {
      const SubTaskStatus = statusTaskList.find(
        (subTaskStatus) => subTaskStatus.id === subTask.status
      );

      if (SubTaskStatus) {
        SubTaskStatus.amount += 1;
      } else {
        const statusColumn = columnOptions.status.find(
          (statusColumn) => statusColumn.id === subTask.status
        );
        if (statusColumn)
          statusTaskList.push({
            id: statusColumn.id,
            color: statusColumn.color,
            name: statusColumn.title,
            amount: 1,
          });
      }
    });

    return statusTaskList;
  }

  const statusTaskList = getStatusArr(task, columnOptions);

  return (
    <Center>
      {statusTaskList.map((statusTask) => (
        <Tooltip px={2} placement="top" label={statusTask.name}>
          <Center
            mr={1}
            mt="2px"
            width="16px"
            rounded="sm"
            height="16px"
            color="black"
            fontStyle="bold"
            bgColor={statusTask.color}
            onClick={(e) => setShowSubTask((prev) => !prev)}
          >
            {statusTask.amount}
          </Center>
        </Tooltip>
      ))}
    </Center>
  );
}
