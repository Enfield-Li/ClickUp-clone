import { Box } from "@chakra-ui/react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";

type Props = {};

export default function ExpectedDueDate({}: Props) {
  const { task } = useTaskDetailContext();

  return (
    <Box fontSize="small" height="35px">
      <Box opacity="50%">DUE DATE</Box>
      <Box opacity="65%">
        {new Date(task?.expectedDueDate!).toLocaleDateString()}
      </Box>
    </Box>
  );
}
