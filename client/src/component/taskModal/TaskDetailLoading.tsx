import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import React, { memo } from "react";

type Props = { isOpen: boolean; onClose: () => void };

export default memo(TaskDetailLoading);
function TaskDetailLoading({ isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>loading</ModalBody>
      </ModalContent>
    </Modal>
  );
}
