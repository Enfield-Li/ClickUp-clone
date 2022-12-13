import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { darkNavBG } from "../../../globalTheme";

type Props = {
  isCreateListModalOpen: boolean;
  onCreateListModalClose: () => void;
};

export default function CreateListModal({
  isCreateListModalOpen,
  onCreateListModalClose,
}: Props) {
  const [value, setValue] = useState("");
  const topBgColor = useColorModeValue("white", "darkMain.100");
  const bottomBgColor = useColorModeValue("lightMain.50", "darkMain.200");

  function handleCreateList(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }

  function handleCancel() {
    setValue("");
    onCreateListModalClose();
  }

  return (
    <Modal
      size="2xl"
      closeOnOverlayClick={false}
      isOpen={isCreateListModalOpen}
      onClose={onCreateListModalClose}
    >
      <ModalOverlay />
      <ModalContent bgColor={topBgColor} height="340px" rounded="md">
        <Flex
          px="37px"
          height="100px"
          alignItems="center"
          borderTopRadius="md"
          bgColor={bottomBgColor}
        >
          <Box fontSize="2xl" fontWeight="semibold">
            Create List
          </Box>

          <ModalCloseButton
            top="37px"
            right="37px"
            fontSize="lg"
            position="absolute"
            width="fit-content"
            height="fit-content"
            _hover={{ color: "purple.500" }}
          />
        </Flex>

        <Divider borderColor="blackAlpha.300" />

        <Box px="37px" py="6">
          <Box>
            <Box fontWeight="semibold" fontSize="sm" mb="2">
              List name
            </Box>
            <Input
              autoFocus
              rounded="3px"
              value={value}
              bgColor={darkNavBG}
              borderColor="blackAlpha.500"
              onChange={(e) => setValue(e.target.value)}
            />
          </Box>

          <Flex justifyContent="flex-end" alignItems="center" mt="65px">
            <Button rounded="3px" onClick={handleCancel}>
              Cancel
            </Button>

            <Button
              ml="4"
              _focus={{}}
              _active={{}}
              rounded="3px"
              color="white"
              bgColor="customBlue.200"
              onClick={(e) => handleCreateList(e)}
              _hover={{ bgColor: "customBlue.100" }}
            >
              Create List
            </Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
}
