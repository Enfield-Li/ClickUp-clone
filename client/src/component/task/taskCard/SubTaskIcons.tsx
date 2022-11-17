import { Box, Center, Tooltip } from "@chakra-ui/react";
import React, { memo } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { ColumnOptions, StatusColumn, Task } from "../../../types";

type Props = {
  task: Task;
  setShowSubTask: React.Dispatch<React.SetStateAction<boolean>>;
};
type StatusTask = { id: number; color: string; amount: number; name: string };

function SubTaskIcons({ task, setShowSubTask }: Props) {
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
        const statusColumn = columnOptions.statusColumns.find(
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
      {statusTaskList.map((statusTask, index) => (
        <Box key={index}>
          <Tooltip
            px={2}
            placement="top"
            fontWeight="bold"
            label={statusTask.name}
          >
            <Center
              mr={1}
              mt="2px"
              pb="1.5px"
              width="16px"
              rounded="sm"
              height="16px"
              color="white"
              fontWeight="bold"
              bgColor={statusTask.color}
              onClick={(e) => setShowSubTask((prev) => !prev)}
            >
              {statusTask.amount}
            </Center>
          </Tooltip>
        </Box>
      ))}
    </Center>
  );
}
export default memo(SubTaskIcons);
