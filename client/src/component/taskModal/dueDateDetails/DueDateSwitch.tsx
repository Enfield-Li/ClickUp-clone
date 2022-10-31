import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DueDateOptions from "./DueDateOptions";
import DueDatePicker from "./DueDatePicker";

type Props = { isOptionOpen: boolean };

export default function DueDateSwitch({ isOptionOpen }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    // Reset to hide date picker
    if (!isOptionOpen) setShowDatePicker(false);
  }, [isOptionOpen]);

  return (
    <Box>
      <Box
        p={2}
        pl={4}
        cursor="pointer"
        onClick={() => {
          setShowDatePicker(!showDatePicker);
        }}
        _hover={{ backgroundColor: "blue.600" }}
      >
        {showDatePicker ? "Hide " : "Show "} date picker
      </Box>

      {showDatePicker ? <DueDatePicker /> : <DueDateOptions />}
    </Box>
  );
}
