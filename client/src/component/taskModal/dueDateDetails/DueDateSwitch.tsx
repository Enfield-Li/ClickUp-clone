import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { Task } from "../../../types";
import { getMonthAndDay } from "../../../utils/getWeekDays";
import DatePicker from "./DatePicker";
import DueDateOptions from "./DueDateOptions";

type Props = {
  task: Task;
  setTask?: SetTask;
  onClose: () => void;
};

export default function DueDateSwitch({ task, setTask, onClose }: Props) {
  const { taskStateContext } = useTaskDetailContext();
  const { setState, sortBy, columnOptions } = taskStateContext!;
  const [expectedDueDate, setExpectedDueDate] = useState<Date | undefined>(
    task.expectedDueDate
  );

  const borderColor = useColorModeValue("lightMain.200", "darkMain.300");
  const bgColor = useColorModeValue("white", "darkMain.200");

  return (
    <Box>
      <Box p={2} bgColor={bgColor}>
        Expected due date: <span> </span>
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
            sortBy={sortBy}
            onClose={onClose}
            setTask={setTask}
            setState={setState}
          />
        </Box>

        <Box borderTopWidth="1px" borderColor={borderColor}>
          <DatePicker
            task={task}
            sortBy={sortBy}
            onClose={onClose}
            setState={setState}
            columnOptions={columnOptions}
            expectedDueDate={expectedDueDate}
            setExpectedDueDate={setExpectedDueDate}
          />
        </Box>
      </Flex>
    </Box>
  );
}
