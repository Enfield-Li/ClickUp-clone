import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import { Task } from "../../../types";
import { convertUTCDateToLocalDate } from "../../../utils/convertUTCDateToLocalDate";
import { getMonthAndDay } from "../../../utils/getWeekDays";
import DueDateOptions from "./DueDateOptions";
import DueDatePicker from "./DueDatePicker";

type Props = {
  task: Task;
  onClose: () => void;
};

export default memo(DueDatePanel);
function DueDatePanel({ task, onClose }: Props) {
  const borderColor = useColorModeValue("lightMain.200", "darkMain.300");
  const bgColor = useColorModeValue("white", "darkMain.200");

  return (
    <Box>
      <Box p={2} bgColor={bgColor}>
        Expected due date: <span>&nbsp;</span>
        {task.expectedDueDate ? (
          <>
            <span style={{ textDecoration: "underline" }}>
              {getMonthAndDay(convertUTCDateToLocalDate(task.expectedDueDate))}
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
          <DueDateOptions task={task} onClose={onClose} />
        </Box>

        <Box borderTopWidth="1px" borderColor={borderColor}>
          <DueDatePicker task={task} onClose={onClose} />
        </Box>
      </Flex>
    </Box>
  );
}
