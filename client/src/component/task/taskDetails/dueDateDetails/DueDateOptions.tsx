import { Box, Button, Center, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../../context/task_detail/useTaskDetailContext";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { getDueDateColumnFromDateString } from "../../TaskDataProcessing";

type Props = { onOptionClose: () => void; isOptionOpen: boolean };

export default function DueDateOptions({ onOptionClose, isOptionOpen }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState<string>();

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
              setDueDate(e.target.value);
            }}
          />
          <Center mb={2}>
            <Button
              pl={4}
              onClick={() => {
                onOptionClose();
                setShowDatePicker(false);

                if (dueDate) {
                  const targetDueDateColumnId = getDueDateColumnFromDateString(
                    columnOptions.dueDate,
                    dueDate
                  );

                  // Update list state
                  updateTaskPriorityOrDueDate(
                    sortBy,
                    task!,
                    setState,
                    "dueDate",
                    targetDueDateColumnId
                  );

                  // Update modal task state
                  setTask({ ...task!, dueDate: targetDueDateColumnId });
                }
              }}
            >
              Confirm
            </Button>
          </Center>
        </>
      ) : (
        // dueDate columns
        columnOptions.dueDate.map(
          (dueDate) =>
            dueDate.id !== 0 &&
            dueDate.id !== task?.dueDate && (
              <Box
                p={2}
                pl={4}
                key={dueDate.id}
                cursor="pointer"
                onClick={() => {
                  onOptionClose();
                  setShowDatePicker(false);

                  const targetDueDateColumnId = dueDate.id;

                  // Update list state
                  updateTaskPriorityOrDueDate(
                    sortBy,
                    task!,
                    setState,
                    "dueDate",
                    targetDueDateColumnId
                  );
                  // Update modal task state
                  setTask({ ...task!, dueDate: targetDueDateColumnId });
                }}
                _hover={{ backgroundColor: "blue.600" }}
              >
                {capitalizeFirstLetter(dueDate.title.toLowerCase())}
              </Box>
            )
        )
      )}
    </Box>
  );
}
