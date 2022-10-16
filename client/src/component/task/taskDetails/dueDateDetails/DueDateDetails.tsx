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
    isOpen,
    setTask,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  return (
    <>
      <Popover>
        {({ onClose: onOptionClose }) => (
          // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
          <>
            <PopoverTrigger>
              <Center
                width="40px"
                height="40px"
                fontSize={"20px"}
                cursor={"pointer"}
                border="1px dashed"
                borderRadius={"50%"}
                _hover={{ color: "purple.400" }}
              >
                <i className="bi bi-calendar2-check"></i>
              </Center>
            </PopoverTrigger>

            {/* DueDate option */}
            <PopoverContent width="200px">
              <PopoverBody shadow={"2xl"} p={0}>
                <DueDateOptions onOptionClose={onOptionClose} />
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </>
  );
}
