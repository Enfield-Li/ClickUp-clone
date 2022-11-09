import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { SetState, SortBy, Task } from "../../../types";
import DueDateOptions from "./DueDateOptions";
import DueDatePicker from "./DueDatePicker";

type Props = {
  task: Task;
  setTask?: SetTask;
  onClose: () => void;
  isOptionOpen: boolean;
};

export default function DueDateSwitch({
  task,
  setTask,
  onClose,
  isOptionOpen,
}: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { taskStateContext } = useTaskDetailContext();
  const { setState, sortBy } = taskStateContext!;

  useEffect(() => {
    // Reset to use DueDateOptions
    setShowDatePicker(false);
  }, [isOptionOpen]);

  return (
    <Box>
      <Box
        p={2}
        pl={4}
        cursor="pointer"
        borderTopRadius="md"
        bgColor="darkMain.200"
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        {showDatePicker ? "Hide " : "Show "} date picker
      </Box>

      {showDatePicker ? (
        <DueDatePicker onClose={onClose} />
      ) : (
        <DueDateOptions
          task={task}
          sortBy={sortBy}
          onClose={onClose}
          setTask={setTask}
          setState={setState}
        />
      )}
    </Box>
  );
}
