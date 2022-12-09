import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import useAuthContext from "../../context/auth/useAuthContext";
import logo from "../../media/clickup_logo.png";

type Props = { isOpen: boolean; onClose: () => void };

export default function WorkSpaceEntryModal({ isOpen, onClose }: Props) {
  const { authState } = useAuthContext();
  const username = authState.user?.username;
  const initialInput = username ? `${username}'s Workspace` : "";
  const [input, setInput] = useState(initialInput);

  function handleOnChange(e: ChangeEvent<HTMLInputElement>): void {
    setInput(e.target.value);
  }

  return (
    <Modal
      size="4xl"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px) " />
      <ModalContent
        rounded="xl"
        height="480px"
        bgColor="white"
        alignSelf="center"
        position="relative"
        color="darkMain.200"
      >
        <Flex cursor="pointer" ml="30px" mt="-2">
          <Center boxSize="90px">
            <img src={logo} />
          </Center>
          <Flex ml="2" alignItems="center">
            <span>&nbsp;</span>
            <Box fontWeight="light" fontSize="10px">
              (clone)
            </Box>
          </Flex>
        </Flex>

        <Center flexDir="column">
          <Box fontSize="45px" fontWeight="bold">
            Just one step away!
          </Box>
          <Box mt="60px">What would you like to name your Workspace?</Box>
          <Input mt="3" width="40%" value={input} onChange={handleOnChange} />
          <Box color="blackAlpha.400" fontSize="smaller" mt="1">
            Try the name of your company or organization.
          </Box>
        </Center>

        <Button
          height="45px"
          bottom="40px"
          right="40px"
          width="100px"
          color="white"
          position="absolute"
          bgColor="submitBtn.100"
          _hover={{ bgColor: "submitBtn.200" }}
        >
          GO!
        </Button>
      </ModalContent>
    </Modal>
  );
}
