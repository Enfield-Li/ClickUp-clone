import { Box } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import OptionWrapper from "../../task/optionWrapper/SelectOption";
import { STATUS, StatusColumn, UpdateEvent } from "../../../types";
import { memo } from "react";
import { updateCurrentTaskStatus } from "../../task/actions/updateCurrentTaskStatus";

type Props = { onOptionClose: () => void };

function StatusOptions({ onOptionClose }: Props) {
  const { authState } = useAuthContext();
  const {
    task,
    setTask,
    isModalOpen,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  function selectStatus(column: StatusColumn) {
    onOptionClose();
    const targetStatusColumnId = column.id;

    // Update task in state
    updateCurrentTaskStatus(sortBy, task!, setState, targetStatusColumnId);

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId: authState.user?.id,
      taskId: task!.id!,
      field: STATUS,
      beforeUpdate: String(task?.status),
      afterUpdate: String(targetStatusColumnId),
      createdAt: new Date(),
    };

    // Update modal task state
    setTask({
      ...task!,
      status: targetStatusColumnId,
      taskEvents: [...task!.taskEvents, newEvent],
    });
  }

  return (
    <>
      {columnOptions.status.map(
        (column) =>
          task!.status !== column.id && (
            // Hide current column option
            <Box key={column.id} onClick={() => selectStatus(column)}>
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
export default memo(StatusOptions);
