import { CheckIcon } from "@chakra-ui/icons";
import { Center, Tooltip } from "@chakra-ui/react";
import useTaskDetailContext, {
  updateCurrentTaskStatus,
} from "../../../../context/task_detail/useTaskDetailContext";

type Props = {};

export default function FinishTask({}: Props) {
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
    <Tooltip fontWeight={600} hasArrow placement="top" label="Set to complete">
      <Center
        opacity="65%"
        fontSize={"33px"}
        cursor={"pointer"}
        _hover={{ color: "yellow.400", opacity: "100%" }}
        onClick={() => {
          setTask({ ...task!, status: 3 });
          updateCurrentTaskStatus(sortBy, task!, setState, 3);
        }}
      >
        {/* <i className="bi bi-check-square"></i> */}
        <Center border="1.1px solid" rounded="sm" p={2}>
          <CheckIcon fontSize="md" alignSelf="center" />
        </Center>
      </Center>
    </Tooltip>
  );
}
