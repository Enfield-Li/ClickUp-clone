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
import CurrentTask from "./CurrentTask";

type Props = {};

export default function TaskDetailModal({}: Props) {
  const initialRef = useRef(null);
  const { task, isOpen, onClose, setTask, taskStateContext } =
    useTaskDetailContext();

  if (!task || !taskStateContext)
    return <TaskDetailLoading isOpen={isOpen} onClose={onClose} />;

  const { setState, columnOptions } = taskStateContext;

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
            <CurrentTask
              task={task}
              setTask={setTask}
              setState={setState}
              columnOptions={columnOptions}
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
