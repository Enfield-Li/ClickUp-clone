import {
  Button,
  Center,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import useTaskDetailContext, {
  updateCurrentTaskStatus,
} from "../../../../context/task_detail/useTaskDetailContext";
import StatusOptions from "./StatusOptions";

type Props = {};

export default function StatusDetails({}: Props) {
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

  const column = columnOptions.status.find(
    (column) => column.id === task!.status
  );
  const statusButtonColor = column?.color.split(".")[0];

  return (
    <Center>
      <Popover>
        {({ onClose: onOptionClose }) => (
          // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
          <>
            <PopoverTrigger>
              <Button colorScheme={statusButtonColor}>{column?.title}</Button>
            </PopoverTrigger>

            {/* Set to finish */}
            {task!.status !== 3 && (
              <Tooltip label="Set to complete" placement="top" hasArrow>
                <Center
                  cursor={"pointer"}
                  fontSize={"30px"}
                  _hover={{ color: "yellow.400" }}
                  onClick={() => {
                    setTask({ ...task!, status: 3 });
                    updateCurrentTaskStatus(sortBy, task!, setState, 3);
                  }}
                >
                  <i className="bi bi-check-square"></i>
                </Center>
              </Tooltip>
            )}

            {/* Status option */}
            <PopoverContent width="200px">
              <PopoverBody shadow={"2xl"}>
                <StatusOptions onOptionClose={onOptionClose} />
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </Center>
  );
}
