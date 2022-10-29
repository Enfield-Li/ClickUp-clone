import {
  Box,
  Center,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import PriorityOptions from "./PriorityOptions";

type Props = {};

export default function PriorityDetails({}: Props) {
  const {
    task,
    isModalOpen,
    onModalClose: onClose,
    setTask,
    taskStateContext,
    onModalOpen: onOpen,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  const currentTaskPriority = columnOptions.priority.find(
    (priority) => priority.id === task!.priority
  );
  const priorityFlagColor = currentTaskPriority?.color;

  return (
    // https://github.com/chakra-ui/chakra-ui/issues/2843#issuecomment-748641805
    <Popover>
      {({ onClose: onOptionClose }) => (
        <>
          <Tooltip
            my={2}
            hasArrow
            placement="top"
            fontWeight="semibold"
            label="Set priority"
          >
            <Box display="inline-block">
              <PopoverTrigger>
                <Center
                  width="35px"
                  height="35px"
                  opacity="65%"
                  cursor={"pointer"}
                  fontSize={"17px"}
                  border="1px dashed"
                  borderRadius={"50%"}
                  color={priorityFlagColor}
                  _hover={{ color: "purple.400", opacity: "100%" }}
                >
                  <i className="bi bi-flag"></i>
                </Center>
              </PopoverTrigger>
            </Box>
          </Tooltip>

          <PopoverContent width="200px">
            <PopoverBody shadow={"2xl"} m={0} p={0}>
              <PriorityOptions onOptionClose={onOptionClose} />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
