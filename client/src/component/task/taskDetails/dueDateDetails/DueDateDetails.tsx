import {
  Center,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import DueDateOptions from "./DueDateOptions";

type Props = {};

export default function DueDateDetails({}: Props) {
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
  const isTaskFinished = task?.dueDate === 0 || task?.dueDate === 1;

  return (
    <>
      <Popover>
        {({ onClose: onOptionClose, isOpen: isOptionOpen }) => (
          // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
          <>
            <PopoverTrigger>
              <Center
                width="35px"
                height="35px"
                opacity="55%"
                fontSize={"17px"}
                cursor={"pointer"}
                border="1px dashed"
                borderRadius={"50%"}
                _hover={{ color: "purple.400", opacity: "100%" }}
              >
                <i className="bi bi-calendar2-check"></i>
              </Center>
            </PopoverTrigger>

            {/* DueDate option */}
            <PopoverContent width="200px">
              <PopoverBody shadow={"2xl"} p={0}>
                <DueDateOptions
                  onOptionClose={onOptionClose}
                  isOptionOpen={isOptionOpen}
                />
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </>
  );
}
