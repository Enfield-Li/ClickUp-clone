import { Box, Flex } from "@chakra-ui/react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext, {
  updateCurrentTaskStatus,
} from "../../../context/task_detail/useTaskDetailContext";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";
import SelectOption from "../../task/select/SelectOption";
import { UpdateEvent } from "../../task/taskTypes";

type Props = { onOptionClose: () => void };

export default function StatusOptions({ onOptionClose }: Props) {
  const { authState } = useAuthContext();
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
    <>
      {columnOptions.status.map(
        (column) =>
          task!.status !== column.id && (
            // Hide current column option
            <Box
              key={column.id}
              onClick={() => {
                onOptionClose();
                const targetStatusColumnId = column.id;

                // Update task in state
                updateCurrentTaskStatus(
                  sortBy,
                  task!,
                  setState,
                  targetStatusColumnId
                );

                const newEvent: UpdateEvent = {
                  id: getRandomNumberNoLimit(),
                  userId: authState.user?.id,
                  taskId: task!.id!,
                  field: "status",
                  beforeUpdate: String(task?.status),
                  afterUpdate: String(targetStatusColumnId),
                  createdAt: new Date(),
                };

                // Update modal task state
                setTask({
                  ...task!,
                  status: targetStatusColumnId,
                  taskEvents: [...task!.taskEvents, newEvent],
                });
              }}
            >
              <SelectOption
                optionName={column.title}
                backgroundColor={column.color}
              >
                <Box
                  rounded="sm"
                  width="10px"
                  height="10px"
                  backgroundColor={column.color}
                ></Box>
              </SelectOption>
            </Box>
          )
      )}
    </>
  );
}
