import { Box } from "@chakra-ui/react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import DueDatePicker from "./DueDatePicker";
import ExpectedDueDate from "./ExpectedDueDate";

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
  console.log({ expectedDueDate: task?.expectedDueDate });

  return (
    <Box>
      <Box>
        {task?.expectedDueDate ? <ExpectedDueDate /> : <DueDatePicker />}
      </Box>
    </Box>
  );
}
