import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../../context/task_detail/useTaskDetailContext";
import {
  DueDateColumn,
  SelectableDueDate,
  DUE_DATE,
  UpdateEvent,
} from "../../../../types";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { getRandomNumberNoLimit } from "../../../../utils/getRandomNumber";
import { getLookUpDueDateTable } from "../../actions/columnProcessing";

type Props = {
  onClose: () => void;
  expectedDueDate: Date | null;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

function CreateDueDateOptions({
  onClose,
  expectedDueDate,
  setExpectedDueDate,
}: Props) {
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.300"
  );
  const bgColor = useColorModeValue("lightMain.50", "darkMain.200");

  const { authState } = useAuthContext();
  const lookUpDueDate = getLookUpDueDateTable();
  const { taskStateContext } = useTaskDetailContext();
  const { setState, sortBy, columnOptions } = taskStateContext!;

  function handleSelect(targetColumn: DueDateColumn) {
    const weekString = targetColumn.title;
    const expectedDueDate = lookUpDueDate[weekString as SelectableDueDate];

    onClose();
  }

  return (
    <>
      {columnOptions.dueDate.map((column, index) => {
        return (
          column.title !== "FUTURE" &&
          column.title !== "OVER DUE" &&
          column.title !== "FINISHED" &&
          column.title !== "NO DUE DATE" && (
            <Flex
              py={2}
              px={3}
              key={index}
              width="130px"
              fontSize="13px"
              cursor="pointer"
              bgColor={bgColor}
              justifyContent="space-between"
              onClick={() => handleSelect(column)}
              _hover={{ backgroundColor: popoverContentHoverBgColor }}
            >
              <Box>{capitalizeFirstLetter(column.title.toString())}</Box>
              <Box opacity="60%" fontWeight="semibold">
                txt
              </Box>
            </Flex>
          )
        );
      })}
    </>
  );
}

export default memo(CreateDueDateOptions);
