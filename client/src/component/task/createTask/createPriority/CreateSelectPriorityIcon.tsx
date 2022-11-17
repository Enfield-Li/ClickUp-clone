import { Center } from "@chakra-ui/react";
import { memo, useMemo, useState } from "react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import CreateSelectPriorityPopover from "./CreateSelectPriorityPopover";

type Props = {
  priority: number | null;
  setPriority: React.Dispatch<React.SetStateAction<number | null>>;
};

function CreateSelectPriorityIcon({ priority, setPriority }: Props) {
  const { taskStateContext } = useTaskDetailContext();
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
export default memo(CreateSelectPriorityIcon);
