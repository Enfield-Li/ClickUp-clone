import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo, useState } from "react";
import { getMonthAndDay } from "../../../../utils/getWeekDays";
import CreateDueDateOptions from "./CreateDueDateOptions";
import CreateDueDatePicker from "./CreateDueDatePicker";

type Props = {
  onClose: () => void;
  expectedDueDate: Date | undefined;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function CreateDueDatePanel({
  onClose,
  expectedDueDate,
  setExpectedDueDate,
}: Props) {
  const borderColor = useColorModeValue("lightMain.200", "darkMain.300");
  const bgColor = useColorModeValue("white", "darkMain.200");

  return (
    <Box>
      <Box p={2} bgColor={bgColor}>
        Expected due date: <span> </span>
        {expectedDueDate ? (
          <>
            <span style={{ textDecoration: "underline" }}>
              {getMonthAndDay(expectedDueDate)}
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
          <CreateDueDateOptions
            onClose={onClose}
            setExpectedDueDate={setExpectedDueDate}
          />
        </Box>

        <Box borderTopWidth="1px" borderColor={borderColor}>
          <CreateDueDatePicker
            onClose={onClose}
            expectedDueDate={expectedDueDate}
            setExpectedDueDate={setExpectedDueDate}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default memo(CreateDueDatePanel);
