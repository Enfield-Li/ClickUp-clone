import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import { useTaskDetail } from "../../../../context/task_detail/useTaskDetail";
import { DueDate, DueDateColumn, DueDateRange } from "../../../../types";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { getExpectedDueDateFromWeekString } from "../../actions/columnProcessing";

type Props = {
  onClose: () => void;
  setExpectedDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

function CreateDueDateOptions({ onClose, setExpectedDueDate }: Props) {
  const popoverContentHoverBgColor = useColorModeValue(
    "lightMain.100",
    "darkMain.300"
  );
  const bgColor = useColorModeValue("lightMain.50", "darkMain.200");

  const { taskStateContext } = useTaskDetail();
  const { columnOptions } = taskStateContext!;

  function handleSelect(targetColumn: DueDateColumn) {
    const weekString = targetColumn.title;
    const expectedDueDate = getExpectedDueDateFromWeekString(
      weekString as DueDate
    );
    setExpectedDueDate(expectedDueDate);
    onClose();
  }

  return (
    <>
      {columnOptions.dueDateColumns.map((column, index) => {
        return (
          column.title !== DueDateRange.FUTURE &&
          column.title !== DueDateRange.OVER_DUE &&
          column.title !== DueDateRange.NO_DUE_DATE && (
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
