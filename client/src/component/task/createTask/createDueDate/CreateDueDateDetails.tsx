import { Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import CreateExpectedDueDateDisplay from "./CreateExpectedDueDateDisplay";
import CreateSelectDueDateIcon from "./CreateSelectDueDateIcon";

type Props = {
  expectedDueDate: Date | undefined;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function CreateDueDateDetails({ expectedDueDate, setExpectedDueDate }: Props) {
  return (
    <>
      {expectedDueDate ? (
        // Due date display
        <Center height="10px">
          <CreateExpectedDueDateDisplay
            expectedDueDate={expectedDueDate}
            setExpectedDueDate={setExpectedDueDate}
          />
        </Center>
      ) : (
        // Icon
        <CreateSelectDueDateIcon
          expectedDueDate={expectedDueDate}
          setExpectedDueDate={setExpectedDueDate}
        >
          <Center
            width="10px"
            height="10px"
            opacity="75%"
            fontSize="14px"
            cursor="pointer"
          >
            <i className="bi bi-calendar2-check"></i>
          </Center>
        </CreateSelectDueDateIcon>
      )}
    </>
  );
}
export default memo(CreateDueDateDetails);
