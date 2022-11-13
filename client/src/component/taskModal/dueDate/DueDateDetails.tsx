import { Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import ExpectedDueDateDisplay from "./ExpectedDueDateDisplay";
import SelectDueDatePopover from "./SelectDueDatePopover";

type Props = {};

function DueDateDetails({}: Props) {
  const { task, setTask } = useTaskDetailContext();

  const hasExpectedDueDate = task?.expectedDueDate;

  return (
    <Box>
      {hasExpectedDueDate ? (
        // Due date display
        <Box fontSize="small" height="35px">
          <Box opacity="50%">DUE DATE</Box>
          <ExpectedDueDateDisplay task={task} setTask={setTask} />
        </Box>
      ) : (
        // Icon
        <SelectDueDatePopover task={task!} setTask={setTask}>
          <Center
            width="35px"
            height="35px"
            opacity="55%"
            fontSize="17px"
            cursor="pointer"
            borderRadius="50%"
            border="1px dashed"
          >
            <i className="bi bi-calendar2-check"></i>
          </Center>
        </SelectDueDatePopover>
      )}
    </Box>
  );
}
export default memo(DueDateDetails);
