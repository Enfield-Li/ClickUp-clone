import { Box, Divider, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { PriorityColumn } from "../../../../types";

type Props = {
  priority: number | null;
  onOptionClose: () => void;
  setPriority: React.Dispatch<React.SetStateAction<number | null>>;
};

function CreatePriorityOptions({
  priority,
  setPriority,
  onOptionClose,
}: Props) {
  const fontColor = useColorModeValue("black", "lightMain.200");
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.200"
  );

  const { authState } = useAuthContext();
  const { taskStateContext } = useTaskDetailContext();
  const { setState, sortBy, columnOptions } = taskStateContext!;

  function selectPriority(priorityColumn: PriorityColumn) {
    onOptionClose();
    setPriority(priorityColumn.id);
  }

  return (
    <>
      {columnOptions.priority.map((priority) => {
        const noPriority = priority.id === 1;
        const taskFinished = priority.id !== 0;

        return (
          // Hide finished column and current priority stage
          taskFinished && (
            // Hide finished column and current priority stage
            <Box
              key={priority.id}
              _hover={{ backgroundColor: popoverContentHoverBgColor }}
            >
              <Flex
                p={3}
                rounded="sm"
                cursor="pointer"
                alignItems="center"
                onClick={() => selectPriority(priority)}
              >
                {noPriority ? (
                  // Select priority
                  <Flex color="red.300">
                    <Box mr={4}>
                      <i className="bi bi-x-lg"></i>
                    </Box>
                    <Box>Clear</Box>
                  </Flex>
                ) : (
                  // Clear priority
                  <Flex>
                    <Box color={priority.color} mr={4}>
                      <i className="bi bi-flag-fill"></i>
                    </Box>
                    <Box color={fontColor}>{priority.title}</Box>
                  </Flex>
                )}
              </Flex>

              {/* Last row hide Divider */}
              {priority.id !== 5 && <Divider />}
            </Box>
          )
        );
      })}
    </>
  );
}
export default memo(CreatePriorityOptions);
