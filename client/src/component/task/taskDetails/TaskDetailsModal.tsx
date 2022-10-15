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
import CurrentTask from "./CurrentTask";
import TaskDetailHead from "./TaskDetailHead";
import TaskEvent from "./TaskEvent";

type Props = {};

export default function TaskDetailModal({}: Props) {
  const initialRef = useRef(null);
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
    <Modal
      isOpen={isOpen}
      onClose={onModalClose}
      size="6xl"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />

      <ModalContent>
        {/* Header */}
        <ModalHeader mb={"-4"}>
          <TaskDetailHead />
        </ModalHeader>

        {/* Body */}
        <ModalBody minHeight="450px">
          <Flex>
            {/* Left side */}
            <CurrentTask />

            {/* Divider */}
            <Center>
              <Divider orientation="vertical" />
            </Center>

            {/* Right side */}
            <TaskEvent />
          </Flex>
        </ModalBody>

        {/* Close button */}
        <ModalCloseButton ref={initialRef} />

        {/* Footer */}
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onModalClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
