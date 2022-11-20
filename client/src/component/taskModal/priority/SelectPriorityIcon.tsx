import { Center } from "@chakra-ui/react";
import { memo, useMemo, useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { Priority, Task } from "../../../types";
import { selectPriority } from "./PriorityOptions";
import SelectPriorityPopover from "./SelectPriorityPopover";

type Props = { task: Task };

export default memo(SelectPriorityIcon);
function SelectPriorityIcon({ task }: Props) {
  const { authState } = useAuthContext();
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions, setTaskState, sortBy } = taskStateContext!;

  const currentTaskPriority = useMemo(() => {
    return columnOptions.priorityColumns.find(
      (priority) => priority.id === task!.priority.columnId
    );
  }, [columnOptions.priorityColumns, task!.priority]);
  const priorityFlagColor = currentTaskPriority?.color;
  const noPriority = task?.priority.name === Priority.NO_PRIORITY;

  return (
    <SelectPriorityPopover
      task={task}
      currentTaskPriority={currentTaskPriority}
    >
      <Center
        width="35px"
        height="35px"
        fontSize="17px"
        cursor="pointer"
        borderRadius="50%"
        position="relative"
        color={priorityFlagColor}
        border={noPriority ? "1px dashed" : "1px"}
        onMouseMoveCapture={() => setShowDeleteBtn(true)}
        onMouseOutCapture={() => setShowDeleteBtn(false)}
        _hover={{
          opacity: "100%",
          border: "1px dashed",
          color: noPriority ? "purple.400" : undefined,
        }}
      >
        <i className="bi bi-flag-fill"></i>

        {showDeleteBtn && !noPriority && (
          <Center
            top="-6px"
            right="-6px"
            width="15px"
            height="15px"
            rounded="full"
            position="absolute"
            color="lightMain.100"
            fontWeight="extrabold"
            bgColor="rgb(151, 151, 151)"
            _hover={{ bgColor: "customBlue.200" }}
            onClick={(e) => {
              e.stopPropagation();
              selectPriority(
                task,
                authState.user!.id!,
                setTaskState,
                1 // no priority
              );
            }}
          >
            <i className="bi bi-x"></i>
          </Center>
        )}
      </Center>
    </SelectPriorityPopover>
  );
}
