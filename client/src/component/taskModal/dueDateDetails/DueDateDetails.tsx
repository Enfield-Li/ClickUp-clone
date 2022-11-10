import { Box, Center } from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import ExpectedDueDateDisplay from "./ExpectedDueDateDisplay";
import SelectDueDateIcon from "./SelectDueDateIcon";

type Props = {};

export default function DueDateDetails({}: Props) {
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
  const hasExpectedDueDate = task?.expectedDueDate;

  return (
    <Box>
      {hasExpectedDueDate ? (
        <Box fontSize="small" height="35px">
          <Box opacity="50%">DUE DATE</Box>
          <ExpectedDueDateDisplay task={task} setTask={setTask} />
        </Box>
      ) : (
        <SelectDueDateIcon task={task!}>
          <Center
            width="35px"
            height="35px"
            opacity="55%"
            fontSize={"17px"}
            cursor={"pointer"}
            border="1px dashed"
            borderRadius={"50%"}
          >
            <i className="bi bi-calendar2-check"></i>
          </Center>
        </SelectDueDateIcon>
      )}
    </Box>
  );
}
