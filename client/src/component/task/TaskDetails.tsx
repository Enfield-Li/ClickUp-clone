import React, { useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Flex,
  Box,
  Divider,
  Center,
  background,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { Task } from "./Data";

type Props = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

export default function TaskDetails({ isOpen, onClose, task }: Props) {
  const initialRef = useRef(null);

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
          <Flex>
            <Editable mr={6} defaultValue={task.title}>
              <EditablePreview />
              <EditableInput
                onBlur={(e) => {
                  if (e.target.value === task.title) {
                    console.log("unchanged");
                  } else {
                    console.log("Changed value: ", {
                      value: e.target.value,
                    });
                  }
                }}
              />
            </Editable>

            <Center opacity={"40%"}>
              <i className="bi bi-pencil-square"></i>
            </Center>
          </Flex>
        </ModalHeader>

        {/* Body */}
        <ModalBody minHeight="450px">
          <Flex>
            {/* Left side */}
            <Box flexBasis={"50%"}>
              <Flex justifyContent={"space-evenly"} my={3}>
                <Center>
                  <Popover>
                    <PopoverTrigger>
                      <Button>Status</Button>
                    </PopoverTrigger>

                    <Center fontSize={"30px"}>
                      <i className="bi bi-check-square"></i>
                    </Center>

                    <PopoverContent width="200px">
                      {/* <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Search</PopoverHeader> */}
                      <PopoverBody>
                        Are you sure you want to have that milkshake?
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Center>

                <Center
                  border="1px solid"
                  borderRadius={"50%"}
                  width="40px"
                  height="40px"
                >
                  <i className="bi bi-flag"></i>
                </Center>
              </Flex>

              {/* Desc */}
              <Box>
                <Flex>
                  Desc:
                  <Center opacity={"40%"}>
                    {/* Edit button */}
                    <i className="bi bi-pencil-square"></i>
                  </Center>
                </Flex>

                <Editable
                  width="100%"
                  defaultValue={task.description}
                  placeholder="Add some desc"
                >
                  <EditablePreview />
                  <EditableTextarea
                    onBlur={(e) => {
                      if (e.target.value === task.description) {
                        console.log("unchanged");
                      } else {
                        console.log("Changed value: ", {
                          value: e.target.value,
                        });
                      }
                    }}
                  />
                </Editable>
              </Box>
            </Box>

            <Center>
              <Divider orientation="vertical" />
            </Center>

            {/* Right side */}
            <Box flexBasis={"50%"}>
              <Flex justifyContent={"space-evenly"} my={3}>
                <Box>Stats 1</Box>
                <Box>Task dueDate: {task.dueDate}</Box>
              </Flex>
              <Box>Events</Box>
            </Box>
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
