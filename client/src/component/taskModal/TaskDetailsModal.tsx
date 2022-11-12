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
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useEffect, useRef } from "react";
import TaskInfo from "./TaskInfo";
import TaskDetailHead from "./TaskDetailHead";
import TaskEvent from "./TaskEvent";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { fetchTaskEvents } from "../task/actions/TaskActions";

type Props = {};

function TaskDetailModal({}: Props) {
  const initialRef = useRef(null);
  const bgColor = useColorModeValue("white", "darkMain.100");

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
    <Modal
      size="6xl"
      isOpen={isModalOpen}
      onClose={onModalClose}
      initialFocusRef={initialRef}
    >
      <ModalOverlay />

      <ModalContent height="540px" bgColor={bgColor}>
        {/* Header */}
        <ModalHeader mb={"-4"}>
          <TaskDetailHead />
        </ModalHeader>

        {/* Body */}
        <ModalBody pb={6} mb={2}>
          <Flex height="100%" justifyContent="center" alignContent="center">
            {/* Left side */}
            <TaskInfo />

            {/* Divider */}
            <Center>
              <Divider orientation="vertical" borderColor="gray.500" />
            </Center>

            {/* Right side */}
            <TaskEvent />
          </Flex>
        </ModalBody>

        {/* Close button */}
        <ModalCloseButton ref={initialRef} />

        {/* Footer */}
        {/* <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onModalClose}>
            Close
          </Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}
export default memo(TaskDetailModal);
