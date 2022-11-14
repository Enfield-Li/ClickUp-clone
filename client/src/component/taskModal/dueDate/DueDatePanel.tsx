import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo, useState } from "react";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { Task } from "../../../types";
import { getMonthAndDay } from "../../../utils/getWeekDays";
import DueDatePicker from "./DueDatePicker";
import DueDateOptions from "./DueDateOptions";

type Props = {
  task: Task;
  setTask?: SetTask;
  onClose: () => void;
};

function DueDatePanel({ task, setTask, onClose }: Props) {
  const [expectedDueDate, setExpectedDueDate] = useState<Date | undefined>(
    task.expectedDueDate
  );

  const borderColor = useColorModeValue("lightMain.200", "darkMain.300");
  const bgColor = useColorModeValue("white", "darkMain.200");

  return (
    <Box>
      <Box p={2} bgColor={bgColor}>
        Expected due date: <span>&nbsp;</span>
        {task.expectedDueDate ? (
          <>
            <span style={{ textDecoration: "underline" }}>
              {getMonthAndDay(task.expectedDueDate)}
            </span>
          </>
        ) : (
          <span> ____</span>
        )}
      </Box>

      <Flex>
        <Box
          bgColor={bgColor}
          borderTopWidth="1px"
          borderRightWidth="1px"
          borderColor={borderColor}
        >
          <DueDateOptions
            task={task}
            onClose={onClose}
            setTask={setTask}
            setExpectedDueDate={setExpectedDueDate}
          />
        </Box>

        <Box borderTopWidth="1px" borderColor={borderColor}>
          <DueDatePicker
            task={task}
            setTask={setTask}
            onClose={onClose}
            expectedDueDate={expectedDueDate}
            setExpectedDueDate={setExpectedDueDate}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default memo(DueDatePanel);
