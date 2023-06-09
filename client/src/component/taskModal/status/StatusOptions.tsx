import { Box } from "@chakra-ui/react";
import { memo } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import { GroupBy, StatusColumn, Task } from "../../../types";
import OptionWrapper from "../../task/optionWrapper/SelectOption";

type Props = { onOptionClose: () => void };

export default memo(StatusOptions);
function StatusOptions({ onOptionClose }: Props) {
  const { user } = useAuth();
  const { task, taskStateContext, updateTaskAttribute } = useTaskDetail();
  const { groupBy: groupBy, columnOptions } = taskStateContext!;

  function handleSelectStatus(task: Task, column: StatusColumn) {
    const targetStatusColumnId = column.id!;

    updateTaskAttribute({
      groupBy: groupBy,
      currentTask: task,
      targetField: GroupBy.STATUS,
      userId: user!.id!,
      targetColumnId: targetStatusColumnId,
    });
  }

  return (
    <>
      {columnOptions.statusColumns.map(
        (column) =>
          task!.status.columnId !== column.id && (
            // Hide current column option
            <Box
              key={column.id}
              onClick={() => handleSelectStatus(task!, column)}
            >
              <OptionWrapper
                onClose={onOptionClose}
                optionName={column.title}
                hoverBgColor={column.color}
              >
                <Box
                  rounded="sm"
                  width="10px"
                  height="10px"
                  backgroundColor={column.color}
                ></Box>
              </OptionWrapper>
            </Box>
          )
      )}
    </>
  );
}
