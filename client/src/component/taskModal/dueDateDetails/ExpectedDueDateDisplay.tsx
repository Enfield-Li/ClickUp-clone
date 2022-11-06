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
import { useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { DUE_DATE, UpdateEvent } from "../../task/taskTypes";
import DueDateSwitch from "./DueDateSwitch";

type Props = {};

export default function ExpectedDueDateDisplay({}: Props) {
  const { authState } = useAuthContext();

  const toolTipColor = "lightMain.100";
  const toolTipBG = "darkMain.50";

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

  const [showDeleteButton, setShowDeleteButton] = useState(false);

  function clearDueDate() {
    // Update list state
    updateTaskPriorityOrDueDate(
      sortBy,
      task!,
      setState,
      DUE_DATE,
      1, // No due date
      undefined
    );

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId: authState.user?.id,
      taskId: task!.id!,
      field: DUE_DATE,
      beforeUpdate: String(task?.dueDate),
      afterUpdate: "1",
      createdAt: new Date(),
    };

    // Update modal task state
    setTask({
      ...task!,
      expectedDueDate: undefined,
      taskEvents: [...task!.taskEvents, newEvent],
    });
  }

  return (
    <Box fontSize="small" height="35px">
      <Box opacity="50%">DUE DATE</Box>
      <Flex
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
        onMouseOverCapture={() => setShowDeleteButton(true)}
        onMouseOutCapture={() => setShowDeleteButton(false)}
      >
        <Popover>
          {({ onClose, isOpen: isOptionOpen }) => (
            // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
            <>
              <Tooltip
                my={2}
                hasArrow
                placement="top"
                bgColor={toolTipBG}
                color={toolTipColor}
                label={
                  <Box>
                    Time:&nbsp;
                    {new Date(task?.expectedDueDate!).toLocaleTimeString()}
                  </Box>
                }
                fontWeight="semibold"
              >
                <Box display="inline-block">
                  <PopoverTrigger>
                    <Center opacity="65%">
                      {new Date(task?.expectedDueDate!).toLocaleDateString()}
                    </Center>
                  </PopoverTrigger>
                </Box>
              </Tooltip>

              {/* DueDate option */}
              <PopoverContent width="200px">
                <PopoverBody shadow={"2xl"} p={0}>
                  <DueDateSwitch
                    onClose={onClose}
                    isOptionOpen={isOptionOpen}
                  />
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>

        {/* Delete button */}
        {showDeleteButton && (
          <Center
            p={1}
            color="red"
            opacity="65%"
            fontSize="8px"
            onClick={() => clearDueDate()}
          >
            <i className="bi bi-x-circle-fill"></i>
          </Center>
        )}
      </Flex>
    </Box>
  );
}
