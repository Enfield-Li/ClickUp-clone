import { Box } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext, {
  updateTaskPriorityOrDueDate,
} from "../../../context/task_detail/useTaskDetailContext";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import { getLookUpDueDateTable } from "../../task/actions/columnProcessing";
import {
  DueDateColumn,
  DUE_DATE,
  SelectableDueDate,
  UpdateEvent,
} from "../../task/taskTypes";

type Props = { onClose: () => void };

export default function DueDateOptions({ onClose }: Props) {
  const { authState } = useAuthContext();
  const lookUpDueDate = getLookUpDueDateTable();

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

  function handleSelect(targetColumn: DueDateColumn) {
    const weekString = targetColumn.title;
    const expectedDueDate = lookUpDueDate[weekString as SelectableDueDate];

    // Update list state
    updateTaskPriorityOrDueDate(
      sortBy,
      task!,
      setState,
      DUE_DATE,
      targetColumn.id,
      expectedDueDate
    );

    const newEvent: UpdateEvent = {
      id: getRandomNumberNoLimit(),
      userId: authState.user?.id,
      taskId: task!.id!,
      field: DUE_DATE,
      beforeUpdate: String(task?.dueDate),
      afterUpdate: String(targetColumn.id),
      createdAt: new Date(),
    };

    // Update task state
    setTask({
      ...task!,
      expectedDueDate,
      dueDate: targetColumn.id,
      taskEvents: [...task!.taskEvents, newEvent],
    });

    onClose();
  }

  return (
    <>
      {columnOptions.dueDate.map(
        (column, index) =>
          column.title !== "NO DUE DATE" &&
          column.title !== "FINISHED" && (
            <Box
              p={2}
              pl={4}
              key={index}
              cursor="pointer"
              _hover={{ backgroundColor: "blue.600" }}
              onClick={() => handleSelect(column)}
            >
              {capitalizeFirstLetter(column.title.toString().toLowerCase())}
            </Box>
          )
      )}
    </>
  );
}
