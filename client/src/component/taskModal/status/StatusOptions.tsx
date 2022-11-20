import { Box } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { handleSelectStatus } from "../../task/actions/handleSelectStatus";
import OptionWrapper from "../../task/optionWrapper/SelectOption";

type Props = { onOptionClose: () => void };

export default memo(function StatusOptions({ onOptionClose }: Props) {
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

  const { setTaskState, sortBy, columnOptions } = taskStateContext!;

  return (
    <>
      {columnOptions.statusColumns.map(
        (column) =>
          task!.status.columnId !== column.id && (
            // Hide current column option
            <Box key={column.id} onClick={() => handleSelectStatus(column)}>
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
});
