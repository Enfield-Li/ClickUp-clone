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
import { memo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "../../context/auth/useAuthContext";
import logo from "../../media/clickup_logo.png";

type Props = { isOpen: boolean; onClose: () => void };

export default memo(WorkSpaceEntryModal);
function WorkSpaceEntryModal({ isOpen, onClose }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const { authState } = useAuthContext();
  const username = authState.user?.username;
  const initialInput = username ? `${username}'s Workspace` : "";
  const [input, setInput] = useState(initialInput);

  function handleFinish() {
    // https://stackoverflow.com/a/72121443/16648127
    onClose();
    navigate(".", {
      replace: true,
      state: { statusColumns: location.state.statusColumns },
    });
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
          <Input
            mt="3"
            width="40%"
            value={input}
            borderColor="gray.400"
            onChange={(e) => setInput(e.target.value)}
          />
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
          onClick={handleFinish}
          bgColor="customBlue.200"
          _hover={{ bgColor: "customBlue.100" }}
        >
          GO!
        </Button>
      </ModalContent>
    </Modal>
  );
}
