import { Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import ExpectedDueDateDisplay from "./ExpectedDueDateDisplay";
import SelectDueDateIcon from "./SelectDueDateIcon";

type Props = {};

export default memo(DueDateDetails);
function DueDateDetails({}: Props) {
  const { task } = useTaskDetail();

  const hasExpectedDueDate = task?.expectedDueDate;

  return (
    <Box>
      {hasExpectedDueDate ? (
        // Due date display
        <Box fontSize="small" height="35px">
          <Box opacity="50%">DUE DATE</Box>
          <ExpectedDueDateDisplay task={task} />
        </Box>
      ) : (
        // Icon
        <SelectDueDateIcon task={task!}>
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
        </SelectDueDateIcon>
      )}
    </Box>
  );
}
