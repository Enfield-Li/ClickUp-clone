import {
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import TaskDetailHead from "./TaskDetailHead";
import TaskDetailLoading from "./TaskDetailLoading";
import TaskEvent from "./TaskEvent";
import TaskInfo from "./TaskInfo";

type Props = {};

export default function TaskDetailModal({}: Props) {
  const initialRef = useRef(null);
  const {
    isOpen,
    onClose,
    setTask,
    taskDetails,
    setTaskDetails,
    task,
  } = useTaskDetailContext();

  if (!task || !taskDetails)
    return <TaskDetailLoading isOpen={isOpen} onClose={onClose} />;

  const { state, setState, currentColumnId } = taskDetails;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />

      <ModalContent>
        {/* Header */}
        <ModalHeader mb={"-4"}>
          <TaskDetailHead task={task} setState={setState} />
        </ModalHeader>

        {/* Body */}
        <ModalBody minHeight="450px">
          <Flex>
            {/* Left side */}
            <TaskInfo
              task={task}
              state={state}
              setTask={setTask}
              setState={setState}
              currentColumnId={currentColumnId}
            />

            {/* Divider */}
            <Center>
              <Divider orientation="vertical" />
            </Center>

            {/* Right side */}
            <TaskEvent task={task} />
          </Flex>
        </ModalBody>

        {/* Close button */}
        <ModalCloseButton ref={initialRef} />

        {/* Footer */}
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
