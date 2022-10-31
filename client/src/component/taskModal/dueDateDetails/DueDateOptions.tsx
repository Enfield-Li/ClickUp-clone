import { Box, Button, Center, Flex, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../context/task_detail/useTaskDetailContext";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { useFocus } from "../../../utils/useFocus";
import { getDueDateInfo } from "../../task/actions/columnProcessing";
import { getDueDateFromExpectedDueDateString } from "../../task/actions/taskProcessing";
import { SelectableDueDate, UpdateEvent } from "../../task/taskTypes";

type Props = { isOptionOpen: boolean };

export default function DueDateOptions({ isOptionOpen }: Props) {
  const { authState } = useAuthContext();
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
      const targetDueDateColumnId = getDueDateFromExpectedDueDateString(
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

      const newEvent: UpdateEvent = {
        id: getRandomNumberNoLimit(),
        userId: authState.user?.id,
        taskId: task!.id!,
        field: "dueDate",
        beforeUpdate: String(task?.dueDate),
        afterUpdate: String(targetDueDateColumnId),
        createdAt: new Date(),
      };

      // Update modal task state
      setTask({
        ...task!,
        expectedDueDate,
        taskEvents: [...task!.taskEvents, newEvent],
      });
    }
  }

  function handleSelect(weekString: string) {
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

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId: authState.user?.id,
      taskId: task!.id!,
      field: "dueDate",
      beforeUpdate: String(task?.dueDate),
      afterUpdate: String(targetDueDateColumn!.id),
      createdAt: new Date(),
    };

    // Update task state
    setTask({
      ...task!,
      expectedDueDate,
      taskEvents: [...task!.taskEvents, newEvent],
    });
  }

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
        // date picker
        <>
          <Input
            my={2}
            type="datetime-local"
            onChange={(e) => {
              setDueDateInput(e.target.value);
            }}
            // onFocus={(e) => e.target.showPicker()}
            // ref={(input) => input !== null && input.focus()}
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

{
  /* <Flex>
<Flex flexDirection="column">
  {arrOfThisWeekDay.map((weekString, index) => (
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
  ))}
</Flex>

<Box>
  <Center mb={2}>
    <Button pl={4} onClick={() => handleDatePicker()}>
      Confirm
    </Button>
  </Center>
  <Input
    my={2}
    type="datetime-local"
    onChange={(e) => {
      setDueDateInput(e.target.value);
    }}
    //   onFocus={(e) => e.target.showPicker()}
    //   ref={(input) => input !== null && input.focus()}
  />
</Box>
</Flex> */
}
