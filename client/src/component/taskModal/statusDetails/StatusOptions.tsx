import { Box, Flex } from "@chakra-ui/react";
import useTaskDetailContext, {
  updateCurrentTaskStatus,
} from "../../../context/task_detail/useTaskDetailContext";
import SelectOption from "../../task/select/SelectOption";

type Props = { onOptionClose: () => void };

export default function StatusOptions({ onOptionClose }: Props) {
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

  return (
    <>
      {columnOptions.status.map(
        (column) =>
          task!.status !== column.id && (
            // Hide current column option
            <Box
              key={column.id}
              onClick={() => {
                onOptionClose();
                const targetStatusColumnId = column.id;

                // Update task state in taskDetail
                setTask({ ...task!, status: targetStatusColumnId });
                // Update task in state
                updateCurrentTaskStatus(
                  sortBy,
                  task!,
                  setState,
                  targetStatusColumnId
                );
              }}
            >
              <SelectOption
                optionName={column.title}
                backgroundColor={column.color}
              >
                <Box
                  rounded="sm"
                  width="10px"
                  height="10px"
                  backgroundColor={column.color}
                ></Box>
              </SelectOption>
            </Box>
          )
      )}
    </>
  );
}
