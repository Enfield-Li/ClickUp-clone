import { Box, Button, Center, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../../context/task_detail/useTaskDetailContext";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { getDueDateInfo } from "../../dataProcessing/columnProcessing";
import { getDueDateColumnFromDateString } from "../../dataProcessing/taskProcessing";
import { SelectableDueDate } from "../../taskTypes";

type Props = { isOptionOpen: boolean };

export default function DueDateOptions({ isOptionOpen }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDateInput, setDueDateInput] = useState<string>();
  const { arrOfThisWeekDay, lookUpDueDate } = getDueDateInfo();

  useEffect(() => {
    // Reset to hide date picker
    if (!isOptionOpen) setShowDatePicker(false);
  }, [isOptionOpen]);

  const {
    task,
    setTask,
    isModalOpen,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  function handleDatePicker() {
    if (dueDateInput) {
      const targetDueDateColumnId = getDueDateColumnFromDateString(
        columnOptions.dueDate,
        dueDateInput
      );

      const expectedDueDate = new Date(dueDateInput);

      // Update list state
      updateTaskPriorityOrDueDate(
        sortBy,
        task!,
        setState,
        "dueDate",
        targetDueDateColumnId,
        expectedDueDate
      );

      // Update modal task state
      setTask({ ...task!, expectedDueDate });
    }
  }

  function handleSelect(weekString: string) {
    console.log({ weekString });
    const expectedDueDate = lookUpDueDate[weekString as SelectableDueDate];

    const targetDueDateColumn = columnOptions.dueDate.find(
      (column) => column.title === weekString
    );

    // Update list state
    updateTaskPriorityOrDueDate(
      sortBy,
      task!,
      setState,
      "dueDate",
      targetDueDateColumn!.id,
      expectedDueDate
    );

    // Update modal task state
    setTask({ ...task!, expectedDueDate });
  }

  return (
    <Box>
      <Box
        p={2}
        pl={4}
        cursor="pointer"
        onClick={() => setShowDatePicker(!showDatePicker)}
        _hover={{ backgroundColor: "blue.600" }}
      >
        {showDatePicker ? "Hide " : "Show "} date picker
      </Box>

      {showDatePicker ? (
        // date picker
        <>
          <Input
            my={2}
            type="date"
            onChange={(e) => {
              setDueDateInput(e.target.value);
            }}
          />
          <Center mb={2}>
            <Button pl={4} onClick={() => handleDatePicker()}>
              Confirm
            </Button>
          </Center>
        </>
      ) : (
        // dueDate columns
        arrOfThisWeekDay.map((weekString, index) => (
          // weekString !== "NO DUE DATE" &&
          <Box
            p={2}
            pl={4}
            key={index}
            cursor="pointer"
            _hover={{ backgroundColor: "blue.600" }}
            onClick={() => handleSelect(weekString)}
          >
            {capitalizeFirstLetter(weekString.toString().toLowerCase())}
          </Box>
        ))
      )}
    </Box>
  );
}
