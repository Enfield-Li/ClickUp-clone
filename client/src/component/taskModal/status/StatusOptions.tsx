import { Box } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { SortBy, StatusColumn, Task } from "../../../types";
import {
  newUpdateEvent,
  updateCurrentTaskStatus,
} from "../../task/actions/updateTaskAttributes";
import OptionWrapper from "../../task/optionWrapper/SelectOption";

type Props = { onOptionClose: () => void };

export default memo(StatusOptions);
function StatusOptions({ onOptionClose }: Props) {
  const { authState } = useAuthContext();
  const { task, taskStateContext, setTaskStateContext } =
    useTaskDetailContext();

  const { setTaskState, sortBy, columnOptions } = taskStateContext!;

  function handleSelectStatus(task: Task, column: StatusColumn) {
    const targetStatusColumnId = column.id;
    const newEvent = newUpdateEvent(
      authState.user!.id!,
      task.id!,
      SortBy.STATUS,
      task.status.columnId,
      targetStatusColumnId
    );

    updateCurrentTaskStatus(
      task!,
      setTaskState,
      targetStatusColumnId,
      newEvent
    );
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
