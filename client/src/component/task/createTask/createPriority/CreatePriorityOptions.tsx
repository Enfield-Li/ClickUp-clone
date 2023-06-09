import { Box, Divider, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import { useAuth } from "../../../../context/auth/useAuth";
import { useTaskDetail } from "../../../../context/task_detail/useTaskDetail";
import { PriorityColumn } from "../../../../types";
import { reorderPriorityColumn } from "../../actions/taskProcessing";

type Props = {
  priority?: number;
  onOptionClose: () => void;
  setPriority: React.Dispatch<React.SetStateAction<number | undefined>>;
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

  const { user } = useAuth();
  const { taskStateContext } = useTaskDetail();
  const { columnOptions } = taskStateContext!;

  function selectPriority(priorityColumn: PriorityColumn) {
    onOptionClose();
    setPriority(priorityColumn.id);
  }

  return (
    <>
      {reorderPriorityColumn(columnOptions.priorityColumns).map(
        (priorityColumn) => {
          const noPriority = priorityColumn.id === 1;
          const taskFinished = priorityColumn.id !== 0;

          return (
            // Hide finished column and current priority stage
            taskFinished && (
              // Hide finished column and current priority stage
              <Box
                key={priorityColumn.id}
                _hover={{ backgroundColor: popoverContentHoverBgColor }}
              >
                <Flex
                  p={3}
                  rounded="sm"
                  cursor="pointer"
                  alignItems="center"
                  onClick={() => selectPriority(priorityColumn)}
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
                    <Flex>
                      <Box color={priorityColumn.color} mr={4}>
                        <i className="bi bi-flag-fill"></i>
                      </Box>
                      <Box color={fontColor}>{priorityColumn.title}</Box>
                    </Flex>
                  )}
                </Flex>

                {/* Last row hide Divider */}
                {priorityColumn.id !== 1 && <Divider />}
              </Box>
            )
          );
        }
      )}
    </>
  );
}
export default memo(CreatePriorityOptions);
