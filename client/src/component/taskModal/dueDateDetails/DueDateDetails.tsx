import { Box } from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import SelectDueDateIcon from "./SelectDueDateIcon";
import ExpectedDueDateDisplay from "./ExpectedDueDateDisplay";

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
      <Box>
        {hasExpectedDueDate ? (
          <ExpectedDueDateDisplay />
        ) : (
          <SelectDueDateIcon />
        )}
      </Box>
    </Box>
  );
}
