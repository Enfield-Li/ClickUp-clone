import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { GroupBy, Task } from "../../../types";
import { convertUTCDateToLocalDate } from "../../../utils/convertUTCDateToLocalDate";
import { toYYYYMMDDString } from "../../../utils/getWeekDays";
import { getDueDateString } from "../../task/actions/columnProcessing";
import { updateTaskAttribute } from "../../task/actions/updateTaskAttributes";
import DueDatePanel from "./DueDatePanel";

type Props = {
  task: Task;
};

export default memo(ExpectedDueDateDisplay);
function ExpectedDueDateDisplay({ task }: Props) {
  const { user } = useAuth();
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const { taskStateContext } = useTaskDetailContext();
  const { groupBy, setTaskState, columnOptions } = taskStateContext!;

  const popoverContentBg = useColorModeValue("white", "darkMain.100");
  const popoverContentColor = useColorModeValue(
    "darkMain.400",
    "lightMain.200"
  );

  function clearDueDate() {
    const noDueDateColumnId = 1;

    updateTaskAttribute({
      groupBy: groupBy,
      setTaskState,
      currentTask: task,
      expectedDueDate: null,
      userId: user!.id!,
      targetField: GroupBy.DUE_DATE,
      targetColumnId: noDueDateColumnId, // No due date
    });
  }

  return (
    <Flex
      cursor="pointer"
      alignItems="center"
      width="fit-content"
      justifyContent="center"
      _hover={{ textDecoration: "underline" }}
      onMouseOverCapture={() => setShowDeleteButton(true)}
      onMouseOutCapture={() => setShowDeleteButton(false)}
    >
      <Popover isLazy>
        {({
          onClose,
          isOpen: isOptionOpen,
        }: {
          onClose: () => void;
          isOpen: boolean;
        }) => (
          // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-taskState
          <>
            <Tooltip
              my={2}
              hasArrow
              placement="top"
              fontWeight="semibold"
              label={
                <Box>
                  Time:<span>&nbsp;</span>
                  {toYYYYMMDDString(
                    convertUTCDateToLocalDate(new Date(task?.expectedDueDate!))
                  )}
                </Box>
              }
            >
              <Box display="inline-block">
                <PopoverTrigger>
                  <Center opacity="65%">
                    {task.expectedDueDate &&
                      getDueDateString(
                        convertUTCDateToLocalDate(
                          new Date(task?.expectedDueDate!)
                        ),
                        columnOptions.dueDateColumns
                      )}
                  </Center>
                </PopoverTrigger>
              </Box>
            </Tooltip>

            {/* DueDate option */}
            <PopoverContent
              width="383px"
              borderRadius="0px"
              bgColor={popoverContentBg}
              color={popoverContentColor}
            >
              <PopoverBody shadow={"2xl"} p={0}>
                <DueDatePanel task={task} onClose={onClose} />
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>

      {/* Delete button */}
      {showDeleteButton && (
        <Center
          ml={1}
          width="12px"
          height="12px"
          rounded="full"
          bgColor="customBlue.200"
          onClick={() => clearDueDate()}
        >
          <Center fontWeight="extrabold" color="white">
            <i className="bi bi-x"></i>
          </Center>
        </Center>
      )}
    </Flex>
  );
}
