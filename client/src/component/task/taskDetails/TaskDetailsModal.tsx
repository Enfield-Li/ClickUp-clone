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
import TaskInfo from "./TaskInfo";
import TaskDetailHead from "./TaskDetailHead";
import TaskEvent from "./TaskEvent";

type Props = {};

export default function TaskDetailModal({}: Props) {
  const initialRef = useRef(null);
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
    <Modal
      size="6xl"
      isOpen={isModalOpen}
      onClose={onModalClose}
      initialFocusRef={initialRef}
    >
      <ModalOverlay />

      <ModalContent height="540px">
        {/* Header */}
        <ModalHeader mb={"-4"}>
          <TaskDetailHead />
        </ModalHeader>

        {/* Body */}
        <ModalBody>
          <Flex height="100%">
            {/* Left side */}
            <TaskInfo />

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
