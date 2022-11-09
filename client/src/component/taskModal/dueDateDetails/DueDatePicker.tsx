import { Button, Center, Input } from "@chakra-ui/react";
import { useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { getDueDateFromExpectedDueDateString } from "../../task/actions/taskProcessing";
import { DUE_DATE, UpdateEvent } from "../../../types";

type Props = { onClose: () => void };

export default function DueDateOptions({ onClose }: Props) {
  const { authState } = useAuthContext();
  const [dueDateInput, setDueDateInput] = useState<string>();

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

      // Do nothing when it comes to selecting the same day
      const isSameDay = targetDueDateColumnId === task?.dueDate;
      if (isSameDay) {
        onClose();
        return;
      }

      const expectedDueDate = new Date(dueDateInput);

      // Update list state
      updateTaskPriorityOrDueDate(
        sortBy,
        task!,
        setState,
        DUE_DATE,
        targetDueDateColumnId,
        expectedDueDate
      );

      const newEvent: UpdateEvent = {
        id: getRandomNumberNoLimit(),
        userId: authState.user?.id,
        taskId: task!.id!,
        field: DUE_DATE,
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

      onClose();
    }
  }

  return (
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
  );
}
