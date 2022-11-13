import { Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import CreateExpectedDueDateDisplay from "./CreateExpectedDueDateDisplay";
import CreateSelectDueDatePopover from "./CreateSelectDueDatePopover";

type Props = {
  expectedDueDate: Date | null;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

function CreateDueDateDetails({ expectedDueDate, setExpectedDueDate }: Props) {
  return (
    <Box>
      {expectedDueDate ? (
        // Due date display
        <Box fontSize="small" height="35px">
          <Box opacity="50%">DUE DATE</Box>
          <CreateExpectedDueDateDisplay
            expectedDueDate={expectedDueDate}
            setExpectedDueDate={setExpectedDueDate}
          />
        </Box>
      ) : (
        // Icon
        <CreateSelectDueDatePopover
          expectedDueDate={expectedDueDate}
          setExpectedDueDate={setExpectedDueDate}
        >
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
        </CreateSelectDueDatePopover>
      )}
    </Box>
  );
}
export default memo(CreateDueDateDetails);
