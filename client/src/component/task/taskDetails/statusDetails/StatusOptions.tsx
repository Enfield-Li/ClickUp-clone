import { Box, Flex } from "@chakra-ui/react";
import useTaskDetailContext, {
    updateCurrentTaskStatus
} from "../../../../context/task_detail/useTaskDetailContext";

type Props = { onOptionClose: () => void };

export default function StatusOptions({ onOptionClose }: Props) {
  const {
    task,
    isModalOpen,
    setTask,
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
              my="1"
              rounded="sm"
              key={column.id}
              cursor="pointer"
              _hover={{ backgroundColor: column.color }}
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
              <Flex alignItems="center">
                <Box
                  ml="3"
                  mr="2"
                  rounded="sm"
                  width="10px"
                  height="10px"
                  backgroundColor={column.color}
                ></Box>

                {/* Title */}
                <Box>{column.title}</Box>
              </Flex>
            </Box>
          )
      )}
    </>
  );
}
