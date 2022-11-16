import { Center } from "@chakra-ui/react";
import { memo, useMemo, useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { Task } from "../../../types";
import { selectPriority } from "./PriorityOptions";
import SelectPriorityPopover from "./SelectPriorityPopover";

type Props = { task: Task; setTask?: SetTask };

function SelectPriorityIcon({ task, setTask }: Props) {
  const { authState } = useAuthContext();
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions, setState, sortBy } = taskStateContext!;

  const currentTaskPriority = useMemo(() => {
    return columnOptions.priority.find(
      (priority) => priority.id === task!.priority
    );
  }, [columnOptions.priority, task!.priority]);
  const priorityFlagColor = currentTaskPriority?.color;
  const noPriorityOrTaskFinished = task?.priority === 1 || task?.priority === 0;

  return (
    <SelectPriorityPopover
      task={task}
      setTask={setTask}
      currentTaskPriority={currentTaskPriority}
    >
      <Center
        border="1px"
        width="35px"
        height="35px"
        fontSize="17px"
        cursor="pointer"
        borderRadius="50%"
        position="relative"
        color={priorityFlagColor}
        onMouseMoveCapture={() => setShowDeleteBtn(true)}
        onMouseOutCapture={() => setShowDeleteBtn(false)}
        _hover={{
          opacity: "100%",
          border: "1px dashed",
          color: noPriorityOrTaskFinished ? "purple.400" : undefined,
        }}
      >
        <i className="bi bi-flag-fill"></i>

        {showDeleteBtn && !noPriorityOrTaskFinished && (
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
                sortBy,
                setState,
                1, // no priority
                setTask
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
export default memo(SelectPriorityIcon);