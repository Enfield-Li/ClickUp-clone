import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  Modal,
  ModalContent,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { FileUploader } from "react-drag-drop-files";

export default function TestDev() {
  const [input, setInput] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  console.log(isAddingUser);

  function handleInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  return (
    <InputGroup onClick={() => setIsAddingUser(true)}>
      {isAddingUser && (
        <InputLeftElement
          pointerEvents="none"
          children={
            <Box opacity="40%" fontSize="13px">
              <i className="bi bi-search"></i>
            </Box>
          }
        />
      )}

      <Input
        autoFocus
        value={input}
        placeholder="Enter list name"
        onChange={handleInputOnChange}
        variant={isAddingUser ? undefined : ""}
      />

      {!isAddingUser ? (
        <InputRightAddon
          p="0"
          children={
            <Button
              _focus={{}}
              _active={{}}
              width="100%"
              type="submit"
              color="white"
              borderLeftRadius="0"
              bgColor="customBlue.200"
              _hover={{ bgColor: "customBlue.100" }}
            >
              Invite
            </Button>
          }
        />
      ) : (
        <InputRightElement
          cursor="pointer"
          children={
            <Center
              width="15px"
              height="15px"
              rounded="full"
              color="lightMain.200"
              fontWeight="extrabold"
              bgColor="customBlue.200"
              _hover={{ bgColor: "customBlue.100" }}
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingUser(false);
              }}
            >
              <i className="bi bi-x"></i>
            </Center>
          }
        />
      )}
    </InputGroup>
  );
}
