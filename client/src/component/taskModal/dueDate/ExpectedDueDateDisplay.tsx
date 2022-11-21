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
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { SortBy, Task, UpdateEvent } from "../../../types";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { toYYYYMMDDString } from "../../../utils/getWeekDays";
import { getDueDateString } from "../../task/actions/columnProcessing";
import { updateTaskPriorityOrDueDate } from "../../task/actions/updateTaskPriorityOrDueDate";
import DueDatePanel from "./DueDatePanel";

type Props = {
  task: Task;
};

export default memo(ExpectedDueDateDisplay);
function ExpectedDueDateDisplay({ task }: Props) {
  const { authState } = useAuthContext();
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const { taskStateContext } = useTaskDetailContext();
  const { setTaskState, sortBy, columnOptions } = taskStateContext!;

  const popoverContentBg = useColorModeValue("white", "darkMain.100");
  const popoverContentColor = useColorModeValue(
    "darkMain.400",
    "lightMain.200"
  );

  function clearDueDate() {
    // Update list taskState
    updateTaskPriorityOrDueDate(
      task,
      setTaskState,
      1 // No due date
    );

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId: authState.user?.id,
      taskId: task.id!,
      field: SortBy.DUE_DATE,
      beforeUpdate: String(task.dueDate),
      afterUpdate: "1",
      createdAt: new Date(),
    };
    // Update modal task taskState
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
      <Popover>
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
                  {toYYYYMMDDString(new Date(task?.expectedDueDate!))}
                </Box>
              }
            >
              <Box display="inline-block">
                <PopoverTrigger>
                  <Center opacity="65%">
                    {getDueDateString(
                      new Date(task?.expectedDueDate!),
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
