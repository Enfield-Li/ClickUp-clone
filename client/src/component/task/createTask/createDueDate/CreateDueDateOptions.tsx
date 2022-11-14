import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { updateTaskPriorityOrDueDate } from "../../actions/updateTaskPriorityOrDueDate";
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
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function CreateDueDateOptions({ onClose, setExpectedDueDate }: Props) {
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.300"
  );
  const bgColor = useColorModeValue("lightMain.50", "darkMain.200");

  const lookUpDueDate = getLookUpDueDateTable();
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions } = taskStateContext!;

  function handleSelect(targetColumn: DueDateColumn) {
    const weekString = targetColumn.title;
    const expectedDueDate = lookUpDueDate[weekString as SelectableDueDate];
    setExpectedDueDate(expectedDueDate);
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
