import { Center } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { useTaskDetail } from "../../../../context/task_detail/useTaskDetail";
import CreateSelectPriorityPopover from "./CreateSelectPriorityPopover";

type Props = {
  priority?: number;
  setPriority: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export default memo(CreateSelectPriorityIcon);
function CreateSelectPriorityIcon({ priority, setPriority }: Props) {
  const { taskStateContext } = useTaskDetail();
  const { columnOptions } = taskStateContext!;

  const noPriority = priority === 1;
  const currentPriorityColumn = useMemo(() => {
    return columnOptions.priorityColumns.find(
      (priorityColumn) => priorityColumn.id === priority
    );
  }, [columnOptions.priorityColumns, priority]);

  return (
    <CreateSelectPriorityPopover
      priority={priority}
      setPriority={setPriority}
      currentPriorityColumn={currentPriorityColumn}
    >
      {!priority || noPriority ? (
        <Center
          width="10px"
          height="10px"
          opacity="75%"
          fontSize="14px"
          cursor="pointer"
          _hover={{ opacity: "100%", color: "purple.400" }}
        >
          <i className="bi bi-flag"></i>
        </Center>
      ) : (
        <Center
          width="10px"
          height="10px"
          opacity="75%"
          fontSize="14px"
          cursor="pointer"
          _hover={{ opacity: "100%" }}
          color={currentPriorityColumn?.color}
        >
          <i className="bi bi-flag-fill"></i>
        </Center>
      )}
    </CreateSelectPriorityPopover>
  );
}
