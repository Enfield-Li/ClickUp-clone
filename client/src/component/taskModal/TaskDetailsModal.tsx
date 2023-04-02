import {
  Center,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useRef } from "react";
import { useModalControl } from "../../context/modalControl/useModalControl";
import TaskDetailHead from "./TaskDetailHead";
import TaskEvent from "./TaskEvent";
import TaskInfo from "./TaskInfo";

type Props = {};

export default memo(TaskDetailModal);
function TaskDetailModal({}: Props) {
  const initialRef = useRef(null);
  const bgColor = useColorModeValue("white", "darkMain.100");
  const { isTaskDetailModalOpen, onTaskDetailModalClose } = useModalControl();

  return (
    <Modal
      size="6xl"
      initialFocusRef={initialRef}
      isOpen={isTaskDetailModalOpen}
      onClose={onTaskDetailModalClose}
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
