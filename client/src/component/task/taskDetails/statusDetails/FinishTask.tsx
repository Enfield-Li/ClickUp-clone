import { CheckIcon } from "@chakra-ui/icons";
import { Box, Center, Tooltip } from "@chakra-ui/react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTaskDetailContext, {
  updateCurrentTaskStatus,
} from "../../../../context/task_detail/useTaskDetailContext";

type Props = {};

export default function FinishTask({}: Props) {
  const { authState } = useAuthContext();
  const {
    task,
    isModalOpen,
    setTask,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  return (
    <Tooltip hasArrow placement="top" label="Set to complete">
      <Center
        opacity="65%"
        fontSize={"33px"}
        cursor={"pointer"}
        _hover={{ color: "yellow.400", opacity: "100%" }}
        onClick={() => {
          setTask({ ...task!, status: 3 });
          updateCurrentTaskStatus(sortBy, task!, setState, 3, authState.user!);
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
