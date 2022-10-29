import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import React from "react";

type Props = { isOpen: boolean; onClose: () => void };

export default function TaskDetailLoading({ isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>loading</ModalBody>
      </ModalContent>
    </Modal>
  );
}
