import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DueDateOptions from "./DueDateOptions";
import DueDatePicker from "./DueDatePicker";

type Props = { isOptionOpen: boolean; onClose: () => void };

export default function DueDateSwitch({ isOptionOpen, onClose }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        onClick={() => {
          setShowDatePicker(!showDatePicker);
        }}
        _hover={{ backgroundColor: "blue.600" }}
      >
        {showDatePicker ? "Hide " : "Show "} date picker
      </Box>

      {showDatePicker ? (
        <DueDatePicker onClose={onClose} />
      ) : (
        <DueDateOptions onClose={onClose} />
      )}
    </Box>
  );
}
