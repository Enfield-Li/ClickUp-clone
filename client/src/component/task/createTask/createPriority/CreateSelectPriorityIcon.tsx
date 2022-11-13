import { Center } from "@chakra-ui/react";
import { memo, useMemo, useState } from "react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import CreateSelectPriorityPopover from "./CreateSelectPriorityPopover";

type Props = {
  priority: number | null;
  setPriority: React.Dispatch<React.SetStateAction<number | null>>;
};

function CreateSelectPriorityIcon({ priority, setPriority }: Props) {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions } = taskStateContext!;

  const currentPriority = useMemo(() => {
    return columnOptions.priority.find(
      (priorityColumn) => priorityColumn.id === priority
    );
  }, [columnOptions.priority, priority]);
  const priorityFlagColor = currentPriority?.color;
  //   const noPriorityOrTaskFinished = task?.priority === 1 || task?.priority === 0;

  return (
    <CreateSelectPriorityPopover
      priority={priority}
      setPriority={setPriority}
      currentPriority={currentPriority}
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
          //   color: noPriorityOrTaskFinished ? "purple.400" : undefined,
        }}
      >
        <i className="bi bi-flag-fill"></i>

        {showDeleteBtn && (
          //   !noPriorityOrTaskFinished &&
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
            onClick={(e) => e.stopPropagation()}
          >
            <i className="bi bi-x"></i>
          </Center>
        )}
      </Center>
    </CreateSelectPriorityPopover>
  );
}
export default memo(CreateSelectPriorityIcon);
